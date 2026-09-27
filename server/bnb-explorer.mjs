// AEON explorer aggregates remain separate from independently indexed receipts.
export async function syncBnbExplorer(env){
 const source='bnb-explorer-30d',old=await env.DB.prepare('SELECT checked_at FROM external_snapshots WHERE source=?').bind(source).first();
 if(old&&Date.now()-old.checked_at<900000)return{cached:true};
 const end=new Date(),start=new Date(end.getTime()-30*86400000),format=d=>d.toISOString().slice(0,19).replace('T',' ');
 const response=await fetch('https://x402-scan-api.aeon.xyz/api/home/transaction/transactionOverallStats',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({startDate:format(start),endDate:format(end),menu:'all',groupType:'day'}),signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error('BNB explorer HTTP '+response.status);
 const payload=await response.json(),m=payload.model;
 if(payload.code!=='0'||!m||!Number.isSafeInteger(m.totalCount)||m.totalCount<0||!Number.isFinite(m.totalAmount)||m.totalAmount<0||!Array.isArray(m.list))throw Error('Invalid BNB aggregate');
 const history=m.list.map(p=>{const time=Date.parse(p.timeGroup+'T00:00:00Z');if(!Number.isFinite(time)||!Number.isSafeInteger(p.transactionCount)||p.transactionCount<0||!Number.isFinite(p.totalAmount)||p.totalAmount<0)throw Error('Invalid BNB history');return{time,network:'BSC',transactions:p.transactionCount,volumeUsd:p.totalAmount}});
 const data={source:'AEON BNB explorer',sourceUrl:'https://bnbscan.ai/',periodDays:30,checkedAt:Date.now(),start: start.toISOString(),end:end.toISOString(),rows:[{network:'BSC',amountUsd:String(m.totalAmount),transactions:m.totalCount,buyers:m.totalBuyersCount,sellers:m.totalSellersCount}],history,scope:'Provider-reported BNB payment activity. Not independently verified x402 coverage; not added to other providers’ ecosystem totals.'};
 await env.DB.prepare('INSERT INTO external_snapshots VALUES(?,?,?) ON CONFLICT(source) DO UPDATE SET payload=excluded.payload,checked_at=excluded.checked_at').bind(source,JSON.stringify(data),Date.now()).run();return{indexed:1};
}
