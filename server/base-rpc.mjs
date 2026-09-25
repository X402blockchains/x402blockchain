export async function baseBatch(env,calls){
 if(!calls.length)return[];
 const r=await fetch(env.BASE_BATCH_RPC_URL||env.BASE_RPC_URL||'https://mainnet.base.org',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(calls.map(([method,params],id)=>({jsonrpc:'2.0',id,method,params}))),redirect:'error',signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error('Base batch RPC HTTP '+r.status);
 const text=await r.text();if(text.length>16000000)throw Error('Base batch response too large');
 const data=JSON.parse(text);if(!Array.isArray(data)||data.length!==calls.length)throw Error('Incomplete RPC batch');
 const byId=new Map();for(const row of data){if(row.error)throw Error('Base RPC '+String(row.error.code)+': '+String(row.error.message).slice(0,140));if(!Number.isInteger(row.id)||row.id<0||row.id>=calls.length||byId.has(row.id)||row.error||row.result==null)throw Error('Invalid RPC batch response');byId.set(row.id,row.result)}
 return calls.map((_,id)=>byId.get(id));
}
