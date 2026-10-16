'use strict';
const referralValue=new URLSearchParams(location.search).get('code')||'';
const validReferral=/^[a-fA-F0-9]{12}$/.test(referralValue);
document.getElementById(validReferral?'valid':'invalid').hidden=false;
if(validReferral){
 const code=referralValue.toUpperCase();document.getElementById('code').textContent=code;
 document.getElementById('open').href='ironpack-prototype://referral?code='+encodeURIComponent(code);
 document.getElementById('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code);document.getElementById('copy-status').textContent='Code copié.';}catch{document.getElementById('copy-status').textContent='Sélectionne et copie le code affiché ci-dessus.';}});
}
// No attribution SDK, device fingerprint, analytics, cookies or automatic redirect.
