(() => {
const $ = s => document.querySelector(s);
const scene = $('.journey'), stage = $('.stage');
const els = {rider:$('.scene-rider'),photo:$('.scene-photo'),copy:$('.hero-copy'),bottom:$('.hero-bottom'),cockpit:$('.scene-cockpit'),plane:$('.cockpit-plane'),cockpitCopy:$('.cockpit-copy'),phone:$('.phone-ui'),helmet:$('.scene-helmet'),road:$('.helmet-plane'),helmetCopy:$('.helmet-copy'),end:$('.helmet-end')};
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = n => Math.max(0,Math.min(1,n));
const part = (p,a,b) => clamp((p-a)/(b-a));
const ease = n => n*n*(3-2*n);
const fade = (el,n) => {el.style.opacity=clamp(n);};
let scheduled=false, current=null;
function render(){scheduled=false;if(reduce.matches){[els.rider,els.cockpit,els.helmet].forEach(el=>{el.removeAttribute('aria-hidden');el.inert=false;});return;}const rect=scene.getBoundingClientRect();const target=clamp(-rect.top/(scene.offsetHeight-stage.offsetHeight));current=current===null?target:current+(target-current)*.2;if(Math.abs(target-current)<.0001)current=target;const p=current;stage.style.setProperty('--progress',p);
 const enter=ease(part(p,.18,.31));const fly=ease(part(p,.53,.65));
 fade(els.rider,1-enter);els.photo.style.transform=`scale(${1.025+part(p,0,.32)*.045})`;els.copy.style.transform=`translateY(${-part(p,.05,.28)*28}px)`;fade(els.copy,1-part(p,.16,.27));fade(els.bottom,1-part(p,.10,.23));
 fade(els.cockpit,enter*(1-fly));const zoom=1+ease(part(p,.3,.65))*.055;els.plane.style.transform=`translate(-50%,-50%) scale(${zoom})`;
 const opening=ease(part(p,.35,.43));els.phone.style.setProperty('--splash-opacity',1-opening);els.phone.style.setProperty('--logo-scale',.94+opening*.36);els.phone.style.setProperty('--startup-glow',Math.sin(opening*Math.PI));els.phone.style.setProperty('--app-ready',ease(part(p,.39,.445)));
 const press=part(p,.48,.49)*(1-part(p,.51,.53));els.phone.style.setProperty('--button-scale',1-press*.025);els.phone.style.setProperty('--tap',press*.4);els.phone.style.setProperty('--route',ease(part(p,.415,.49)));const ripple=part(p,.495,.54);els.phone.style.setProperty('--ripple',ripple*2);els.phone.style.setProperty('--ripple-opacity',(1-ripple)*part(p,.495,.505)*.5);
 fade(els.cockpitCopy,part(p,.24,.31)*(1-part(p,.50,.57)));els.cockpitCopy.style.transform=`translateY(${(1-enter)*18}px)`;
 fade(els.helmet,fly);els.road.style.transform=`translate(-50%,-50%) scale(${1.015+part(p,.56,1)*.04})`;
 fade(els.helmetCopy,part(p,.60,.67)*(1-part(p,.71,.78)));els.helmetCopy.style.transform=`translateY(${-part(p,.70,.78)*18}px)`;
 const end=ease(part(p,.94,1));fade(els.end,end);els.end.style.transform=`translateY(${(1-end)*18}px)`;
 const chapter=p<.255?0:p<.59?1:2;$('#chapter-name').textContent=['L’APPEL','LE DÉPART','L’IMMERSION'][chapter];$('#chapter-count').textContent=['01 / 03','02 / 03','03 / 03'][chapter];
 [els.rider,els.cockpit,els.helmet].forEach((el,i)=>{el.setAttribute('aria-hidden',chapter!==i);el.inert=chapter!==i;el.style.pointerEvents=chapter===i?'auto':'none';});
 if(current!==target)schedule();
}
const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(render);}};
$('.start-ride').addEventListener('click',()=>{if(reduce.matches){els.helmet.scrollIntoView({behavior:'auto'});return;}scrollTo({top:scrollY+scene.getBoundingClientRect().top+(scene.offsetHeight-stage.offsetHeight)*.83,behavior:'smooth'});});
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',()=>location.reload());
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));render();
})();

