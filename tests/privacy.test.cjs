const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../privacy-consent.js'),'utf8');
const KEY = 'ironpack.privacy.v1', DAY = 86400000;
function setup(initial = {}, blocked = false) {
  const data = new Map(Object.entries(initial)), listeners = {}, events = [], intervals = [];
  let now = Date.UTC(2026,9,11);
  const storage = {getItem:k=>{if(blocked)throw Error('blocked');return data.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');data.set(k,v);},removeItem:k=>data.delete(k),key:i=>[...data.keys()][i],get length(){return data.size;}};
  const document = {readyState:'loading',cookie:'',addEventListener(){}};
  const window = {localStorage:storage,sessionStorage:storage,addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn),dispatchEvent:event=>{events.push(event);(listeners[event.type]||[]).forEach(fn=>fn(event));}};
  const context = {document,window,localStorage:storage,location:{hostname:'www.ironpack.app',protocol:'https:'},Date:{now:()=>now},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},setInterval:fn=>intervals.push(fn)};
  vm.runInNewContext(source,context);
  return {api:window.IronpackPrivacy,data,events,advance:days=>now+=days*DAY,tick:()=>intervals.forEach(fn=>fn()),storageEvent:key=>(listeners.storage||[]).forEach(fn=>fn({key}))};
}
test('no prior or corrupt consent allows no external form',()=>{for(const raw of [undefined,'invalid','null','{}','{"version":1,"form":true}']){const env=setup(raw?{[KEY]:raw}:{});assert.equal(env.api.allowed(),false);}});
test('acceptance and refusal have the same 180-day lifetime',()=>{for(const choice of [true,false]){const env=setup();const state=env.api.save(choice);assert.equal(state.expiresAt-state.savedAt,180*DAY);assert.equal(env.api.allowed(),choice);env.advance(180);assert.equal(env.api.read(),null);}});
test('stored consent survives page reload and expires',()=>{const first=setup();first.api.save(true);const next=setup(Object.fromEntries(first.data));assert.equal(next.api.allowed(),true);next.advance(181);assert.equal(next.api.allowed(),false);});
test('refusal removes only provider keys and emits immediate revocation',()=>{const env=setup({'mailerlite:session_id':'x',ml_guid:'y',unrelated:'keep'});env.api.save(true);env.api.save(false);assert.equal(env.data.get('unrelated'),'keep');assert.equal(env.data.has('mailerlite:session_id'),false);assert.equal(env.data.has('ml_guid'),false);assert.equal(env.events.at(-1).detail.form,false);assert.ok(env.data.has(KEY));});
test('storage failure preserves choice on current page only',()=>{const env=setup({},true);env.api.save(true);assert.equal(env.api.allowed(),true);assert.equal(env.data.size,0);env.api.save(false);assert.equal(env.api.allowed(),false);});
test('cross-tab refusal overrides in-memory acceptance',()=>{const env=setup();env.api.save(true);const record=JSON.parse(env.data.get(KEY));record.form=false;env.data.set(KEY,JSON.stringify(record));env.storageEvent(KEY);assert.equal(env.api.allowed(),false);assert.equal(env.events.at(-1).detail.form,false);});
test('cross-tab deletion and live expiration revoke an already open form',()=>{const env=setup();env.api.save(true);env.data.delete(KEY);env.storageEvent(null);assert.equal(env.api.allowed(),false);env.api.save(true);env.advance(180);env.tick();assert.equal(env.events.at(-1).detail.form,false);});
test('expiration purges the saved preference and does not interrupt an undecided visitor',()=>{const env=setup();env.tick();assert.equal(env.events.length,0);env.api.save(true);env.advance(180);env.tick();assert.equal(env.data.has(KEY),false);assert.equal(env.api.allowed(),false);});
test('homepage and legal pages have local assets and working legal links',()=>{
 const root=path.join(__dirname,'..');
 for(const name of ['index','mentions-legales','confidentialite','cookies','conditions-utilisation','inscription']){
  const html=fs.readFileSync(path.join(root,name+'.html'),'utf8');
  for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
   const url=match[1]; if (/^(?:https?:|mailto:)/.test(url))continue;
   let file=['/','./'].includes(url)?'index.html':url.split('#')[0];if(!path.extname(file))file+='.html';
   assert.ok(fs.existsSync(path.join(root,file)),name+' links to missing '+url);
  }
  assert.doesNotMatch(html,/https:\/\/fonts\.(googleapis|gstatic)\.com/);
  assert.doesNotMatch(html,/<script[^>]+src="https?:/);
  if(name!=='inscription')assert.match(html,/data-cookie-settings/);
 }
});

function setupFormParent(allowed=false) {
 const nodes={},listeners={},timers=new Set(); let opened=0;
 const element=()=>({hidden:false,disabled:false,style:{},listeners:{},setAttribute(){},addEventListener(name,fn){this.listeners[name]=fn;},remove(){this.removed=true;},replaceChildren(...children){this.children=children;},contentWindow:{postMessage(){}}});
 for(const id of ['load-signup','signup-container','signup-status'])nodes[id]=element();
 const created=[];
 const document={getElementById:id=>nodes[id],createElement:()=>{const node=element();created.push(node);return node;}};
 const window={IronpackPrivacy:{allowed:()=>allowed,open:()=>opened++},addEventListener:(name,fn)=>listeners[name]=fn};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),{window,document,location:{origin:'https://www.ironpack.app'},setTimeout:fn=>{timers.add(fn);return fn;},clearTimeout:fn=>timers.delete(fn)});
 return {nodes,created,click:()=>nodes['load-signup'].listeners.click(),get opened(){return opened;},consent:value=>{allowed=value;listeners['ironpack:privacy']({detail:{form:value}});},message:(type,source,origin='https://www.ironpack.app')=>listeners.message({source,origin,data:{type}}),timeout:()=>[...timers].forEach(fn=>fn())};
}
test('a form is never mounted before both request and consent',()=>{const env=setupFormParent();env.click();assert.equal(env.opened,1);assert.equal(env.created.length,0);env.consent(false);assert.equal(env.created.length,0);env.consent(true);assert.equal(env.created.length,0);env.click();assert.equal(env.created.length,1);});
test('withdrawal removes the live iframe and prevents silent reopening',()=>{const env=setupFormParent(true);env.click();const frame=env.created[0];env.consent(false);assert.equal(frame.removed,true);assert.equal(env.nodes['signup-container'].hidden,true);assert.equal(env.nodes['load-signup'].disabled,false);env.consent(true);assert.equal(env.created.length,1);});
test('foreign messages cannot report form readiness',()=>{const env=setupFormParent(true);env.click();const frame=env.created[0];env.message('ironpack:form:ready',{},'https://evil.example');assert.equal(env.nodes['load-signup'].hidden,false);env.message('ironpack:form:ready',{},'https://www.ironpack.app');assert.equal(env.nodes['load-signup'].hidden,false);env.message('ironpack:form:ready',frame.contentWindow);assert.equal(env.nodes['load-signup'].hidden,true);});
test('provider timeout restores a retry without claiming subscription success',()=>{const env=setupFormParent(true);env.click();env.timeout();assert.equal(env.created[0].removed,true);assert.equal(env.nodes['load-signup'].disabled,false);assert.match(env.nodes['signup-status'].textContent,/ne s’est pas chargé/);env.click();assert.equal(env.created.length,2);});
