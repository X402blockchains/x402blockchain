(()=>{'use strict';const timers=new WeakSet();let catalog=[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function enhance(ad){const track=ad.querySelector('.ad-track');if(!track)return;
 for(const slide of track.querySelectorAll('.ad-slide')){const p=catalog.find(p=>p.name===slide.querySelector('strong')?.textContent);if(p&&slide.getAttribute('href')==='/#new-reviewed-listings')slide.href='/ai-agents-apps/?project='+encodeURIComponent(p.id);}
 for(const p of catalog){if([...track.querySelectorAll('.ad-slide')].some(s=>s.querySelector('strong')?.textContent===p.name))continue;
  const a=document.createElement('a');a.className='ad-slide';a.hidden=true;a.href='/ai-agents-apps/?project='+encodeURIComponent(p.id);a.dataset.communitySpotlight=p.id;
  a.innerHTML=`<img class="ad-project-logo" src="${esc(p.logo)}" alt="${esc(p.name)} logo" width="64" height="64"><div class="ad-copy"><span class="ad-eyebrow">PROJECT SPOTLIGHT <span>· ${p.networks.map(esc).join(' · ')}</span></span><strong>${esc(p.name)}</strong><p>${esc(p.description)}</p></div><span class="ad-cta">Explore project ↗</span>`;track.append(a);
 }
 if(timers.has(ad))return;timers.add(ad);let current=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const state=()=>ad.classList.toggle('paused',reduced.matches||document.hidden);reduced.addEventListener('change',state);document.addEventListener('visibilitychange',state);state();
 const timer=setInterval(()=>{if(!ad.isConnected){clearInterval(timer);return}if(reduced.matches||document.hidden)return;const slides=[...ad.querySelectorAll('.ad-slide')];if(!slides.length)return;current=(current+1)%slides.length;slides.forEach((slide,i)=>{slide.hidden=i!==current;slide.classList.toggle('active',i===current)})},6000);
}
async function start(){try{const r=await fetch('/ai-agents-apps/reviewed-projects.json',{cache:'no-store'});if(r.ok)catalog=(await r.json()).projects.filter(p=>p.approved);}catch{}document.querySelectorAll('.directory-ad').forEach(enhance);let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;document.querySelectorAll('.directory-ad').forEach(enhance)})}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
