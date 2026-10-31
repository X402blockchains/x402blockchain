(()=>{'use strict';
const profile='/ai-agents-apps/?project=vextorium.com',rowId='vextorium-featured-row';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let data=null,busy=false,queued=false;
function paint(){
 if(location.pathname!=='/'){document.getElementById(rowId)?.remove();return;}
 const table=document.querySelector('#featured-services tbody');if(!table)return;
 let row=document.getElementById(rowId);
 if(!row){row=document.createElement('tr');row.id=rowId;row.className='fs-row';row.tabIndex=0;row.setAttribute('role','link');row.setAttribute('aria-label','Open Vextorium');
 row.innerHTML=`<td><div class="fs-server"><img class="fs-logo" alt="Vextorium logo" loading="lazy" src="https://raw.githubusercontent.com/bru1noia/vextorium-mcp/main/logo.svg"><div class="fs-server__text"><div class="fs-server__name"><a class="fs-server__title" href="${profile}">Vextorium</a><em>NEW · 2 chains</em></div><p>Paid data APIs · indexed USDC receipts</p><a class="fs-server__url" href="https://vextorium.com/" target="_blank" rel="noopener">vextorium.com</a></div></div></td><td><div class="fs-bars" data-vx-chart role="img" aria-label="Daily indexed receipts over 30 days"></div></td><td class="fs-num" data-project-volume title="Indexed USDC receipt volume over 30 days">—</td><td class="fs-num" data-vx-transactions title="Verified recipient receipts over 30 days, including operator tests">—</td><td class="fs-num" data-vx-wallets title="Distinct sender wallets in indexed receipts; not verified individual buyers">—</td><td><span class="fs-chain fs-chain--multi" title="Base · Solana"><span class="fs-chain__icon"><img src="/ai-agents-apps/logos/base.svg" width="16" height="16" alt="Base"></span><span class="fs-chain__icon"><img src="/ai-agents-apps/logos/solana.svg" width="16" height="16" alt="Solana"></span></span></td><td><a class="fs-try" href="${profile}">Details<span aria-hidden="true">→</span></a></td>`;
 row.addEventListener('click',e=>{if(!e.target.closest('a'))location.assign(profile)});row.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target===row)location.assign(profile)});
 const after=[...table.querySelectorAll('tr')].find(r=>r.getAttribute('aria-label')==='Open three.ws');if(after)after.after(row);else table.append(row);
 }
 if(!data)return;
 const volume=row.querySelector('[data-project-volume]');const v=data.volumeUSDC===null||data.volumeUSDC===undefined?null:Number(data.volumeUSDC);const label=v===null||!Number.isFinite(v)?'—':v>=1e6?'$'+(v/1e6).toFixed(2)+'M':v>=1000?'$'+(v/1000).toFixed(2)+'K':v>0&&v<.01?'$'+v.toFixed(6).replace(/0+$/,''):'$'+v.toFixed(2);if(volume.textContent!==label)volume.textContent=label;volume.title=(data.volumeUSDC??'Unavailable')+' USDC · indexed recipient receipts over 30 days'+(data.partial?' · historical coverage incomplete':'')+'. Operator tests included.';
 const count=Number(data.transactions).toLocaleString(),wallets=Number(data.wallets).toLocaleString();
 const tx=row.querySelector('[data-vx-transactions]'),w=row.querySelector('[data-vx-wallets]');
 if(tx.textContent!==count)tx.textContent=count;if(w.textContent!==wallets)w.textContent=wallets;
 const key=JSON.stringify(data.history||[]),chart=row.querySelector('[data-vx-chart]');
 if(chart.dataset.history!==key){const points=data.history||[],max=Math.max(1,...points.map(x=>x.count));chart.innerHTML=points.map(x=>`<span class="fs-bars__bar" title="${esc(x.date)}: ${Number(x.count).toLocaleString()} receipts" style="height:${Math.max(0,Number(x.count))/max*100}%;background:#0052ff;opacity:.8"></span>`).join('');chart.dataset.history=key;}
 row.title='Indexed recipient receipts · last 30 days'+(data.partial?' · history still indexing':'')+'. Operator tests included. See profile for coverage.';
}
async function refresh(){if(busy)return;busy=true;try{const r=await fetch('/new-listings/activity.php?project=vextorium',{cache:'no-store'});if(!r.ok)throw Error();const d=await r.json();if(!Number.isSafeInteger(d.transactions)||d.transactions<0||!Number.isSafeInteger(d.wallets)||d.wallets<0)throw Error();data=d;paint();}catch{}finally{busy=false;}}
function start(){paint();refresh();new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;paint()})}).observe(document.body,{childList:true,subtree:true});setInterval(refresh,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){paint();refresh()}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
