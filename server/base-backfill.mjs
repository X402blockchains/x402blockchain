import {SOURCES} from './sources.mjs';
import {BASE_USDC,extractBasePayments} from './base.mjs';
const HASH=/^0x[0-9a-f]{64}$/i;
const XPAY='0x589a2314a2e05f45e40c4823da3ba58d421db3d8';
// Explorer pages discover candidate hashes only. RPC receipts remain authoritative.
import {baseBatch} from './base-rpc.mjs';
export {baseBatch} from './base-rpc.mjs';
export async function verifyCandidates(env,hashes){
 const unique=[...new Set(hashes)];if(unique.some(h=>!HASH.test(h)))throw Error('Invalid candidate hash');
 const [chain,head]=await baseBatch(env,[['eth_chainId',[]],['eth_getBlockByNumber',['finalized',false]]]);if(Number(BigInt(chain))!==8453)throw Error('Wrong Base network');
 const records=[];
 for(let i=0;i<unique.length;i+=5){const group=unique.slice(i,i+5),result=await baseBatch(env,group.flatMap(h=>[['eth_getTransactionByHash',[h]],['eth_getTransactionReceipt',[h]]]));
  const blocks=await baseBatch(env,group.map((_,j)=>['eth_getBlockByNumber',[result[j*2+1].blockNumber,false]]));
  for(let j=0;j<group.length;j++){const tx=result[j*2],receipt=result[j*2+1],block=blocks[j];
   if(tx.hash?.toLowerCase()!==group[j].toLowerCase()||receipt.transactionHash?.toLowerCase()!==group[j].toLowerCase()||tx.blockHash?.toLowerCase()!==block.hash?.toLowerCase()||receipt.blockHash?.toLowerCase()!==block.hash?.toLowerCase()||receipt.blockNumber!==block.number||tx.blockNumber!==block.number)throw Error('Candidate identity mismatch');
   if(BigInt(block.number)>BigInt(head.number))throw Error('Candidate not finalized yet');
   // A facilitator wallet's ordinary USDC transfer is not a payment authorization.
   if(tx.to?.toLowerCase()===BASE_USDC&&!String(tx.input||'').startsWith('0xe3ee160e'))continue;
   records.push(...extractBasePayments(tx,receipt,block));
  }
 }
 return records;
}
export async function saveVerified(db,records){const writes=[];for(const r of records){writes.push(db.prepare('INSERT INTO receipts(network,`transaction`,event_id,source,payer,pay_to,asset,amount,decimals,timestamp,status,received_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(network,`transaction`,event_id) DO NOTHING').bind(r.network,r.transaction,r.eventId,r.source,r.payer,r.payTo,r.asset,r.amount,r.decimals,r.timestamp,r.status,Date.now()));writes.push(db.prepare('INSERT INTO chain_evidence(network,`transaction`,event_id,block_number,block_hash,contract,context_key) VALUES (?,?,?,?,?,?,?) ON CONFLICT(network,`transaction`,event_id) DO NOTHING').bind(r.network,r.transaction,r.eventId,r.block,r.blockHash,r.asset,r.facilitator))}if(writes.length)await db.batch(writes);return records.length}
export async function syncBaseAddressHistory(env){const db=env.DB;
 await db.prepare('CREATE TABLE IF NOT EXISTS address_backfills(id TEXT PRIMARY KEY,address TEXT NOT NULL,kind TEXT NOT NULL,cursor TEXT,queue TEXT NOT NULL DEFAULT \'[]\',complete INTEGER NOT NULL DEFAULT 0,checked_at INTEGER NOT NULL DEFAULT 0,verified INTEGER NOT NULL DEFAULT 0,error TEXT)').run();
 const addresses=[...new Set(SOURCES.flatMap(s=>(s.addresses||[]).filter(a=>a.network==='Base').map(a=>a.address.toLowerCase())))];
 const merchants=[...new Set((env.BASE_MERCHANT_ADDRESSES||[]).filter(a=>/^0x[0-9a-f]{40}$/i.test(a)).map(a=>a.toLowerCase()))].filter(a=>a!==XPAY);
 const jobs=[{id:'xpay-merchant',address:XPAY,kind:'token-transfers'},...merchants.map(address=>({id:'merchant-'+address,address,kind:'token-transfers'})),...addresses.map(address=>({id:'sender-'+address,address,kind:'transactions'}))];
 for(const j of jobs)await db.prepare('INSERT INTO address_backfills(id,address,kind) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING').bind(j.id,j.address,j.kind).run();
 // Revisit completed addresses daily for payments newer than their last sweep.
 await db.prepare('UPDATE address_backfills SET complete=0,cursor=NULL,queue=? WHERE complete=1 AND checked_at<?').bind('[]',Date.now()-86400000).run();
 // Give X Pay a bounded priority share while rotating all other known addresses.
 const clock=Math.floor(Date.now()/60000);const job=clock%3===0?await db.prepare("SELECT * FROM address_backfills WHERE id='xpay-merchant' AND complete=0").first():clock%3===1?await db.prepare("SELECT * FROM address_backfills WHERE id=? AND complete=0").bind('sender-'+XPAY).first():null;
 const row=job||await db.prepare('SELECT * FROM address_backfills WHERE complete=0 ORDER BY checked_at,id LIMIT 1').first();if(!row)return{state:'completed_known_addresses',inserted:0};
 try{let queue=JSON.parse(row.queue),cursor=row.cursor?JSON.parse(row.cursor):null,complete=false;
  if(!queue.length){const params=new URLSearchParams(row.kind==='token-transfers'?{type:'ERC-20'}:{filter:'from'});if(cursor)for(const[k,v]of Object.entries(cursor))params.set(k,String(v));
   const r=await fetch('https://base.blockscout.com/api/v2/addresses/'+row.address+'/'+row.kind+'?'+params,{redirect:'error',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Base discovery HTTP '+r.status);const page=await r.json();if(!Array.isArray(page.items)||page.items.length>100)throw Error('Invalid discovery page');
   queue=[...new Set(page.items.filter(x=>row.kind!=='token-transfers'||x.token?.address_hash?.toLowerCase()===BASE_USDC).map(x=>x.transaction_hash||x.hash))];if(queue.some(h=>!HASH.test(h)))throw Error('Malformed discovery hash');
   const next=page.next_page_params||null;if(next&&JSON.stringify(next)===JSON.stringify(cursor))throw Error('Repeated discovery cursor');cursor=next;complete=!next;
   // Persist candidate queue before verification, so failed RPC requests never skip a page.
   await db.prepare('UPDATE address_backfills SET queue=?,cursor=?,complete=0 WHERE id=?').bind(JSON.stringify(queue),JSON.stringify(cursor),row.id).run();
  }else complete=!cursor;
  const began=Date.now();let verified=0,processed=0;
  // Commit each verified group before requesting another: timeouts preserve progress.
  do{const subset=queue.slice(0,5),records=await verifyCandidates(env,subset);await saveVerified(db,records);queue=queue.slice(subset.length);verified+=records.length;processed+=subset.length;
   await db.prepare('UPDATE address_backfills SET queue=?,complete=?,verified=verified+?,checked_at=?,error=NULL WHERE id=?').bind(JSON.stringify(queue),complete&&!queue.length?1:0,records.length,Date.now(),row.id).run();
   if(queue.length)await new Promise(resolve=>setTimeout(resolve,250));
  }while(queue.length&&processed<50&&Date.now()-began<25000);
  return{job:row.id,verified,inserted:verified,processed,remainingCandidates:queue.length};
 }catch(e){await db.prepare('UPDATE address_backfills SET error=?,checked_at=? WHERE id=?').bind(String(e.message).slice(0,200),Date.now(),row.id).run();return{job:row.id,error:e.message,inserted:0}}
}
