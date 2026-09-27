// AEON's public /supported response observed 2026-09-26. No signing keys.
export const BNB_PROVIDERS=[
 {id:'aeon',name:'AEON',url:'https://facilitator.aeon.xyz',docs:'https://github.com/AEON-Project/bnb-x402',signers:['0xe91e0e6080b0c19c71b616e628d7b715313d5036'],evidence:'Public /supported response',scheme:'exact',checkedAt:'2026-09-26'},
 {id:'dexter',name:'Dexter',url:'https://x402.dexter.cash',docs:'https://dexter.cash/facilitator',signers:['0x402feee072d655b85e08f1751af9ddbcd249521f'],evidence:'Public /supported response advertises BNB mainnet and EVM signer',scheme:'exact',checkedAt:'2026-09-26'},
 {id:'x402-exec',name:'x402-exec',url:'https://facilitator.x402x.ai',docs:'https://github.com/nuwa-protocol/x402-exec',signers:[],evidence:'Published settlement router',scheme:'Settled event',checkedAt:'2026-09-26'}
];
export const BNB_TOKENS={
 '0x55d398326f99059ff775485246999027b3197955':{symbol:'USDT',decimals:18},
 '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d':{symbol:'USDC',decimals:18}
};
const topic='0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const hash=x=>typeof x==='string'&&/^0x[0-9a-f]{64}$/i.test(x);
const qty=x=>{if(!/^0x[0-9a-f]+$/i.test(x))throw Error('Invalid chain quantity');const n=Number(BigInt(x));if(!Number.isSafeInteger(n))throw Error('Quantity overflow');return n};
export function decodeBnbTransfer(tx,receipt,block){
 const provider=BNB_PROVIDERS.find(p=>p.signers.includes(tx.from?.toLowerCase()));
 if(!provider||receipt.status!=='0x1')return[];
 if(!hash(tx.hash)||tx.hash.toLowerCase()!==receipt.transactionHash?.toLowerCase()||!hash(block.hash)||receipt.blockHash?.toLowerCase()!==block.hash.toLowerCase()||tx.blockHash?.toLowerCase()!==block.hash.toLowerCase()||receipt.blockNumber!==block.number||tx.blockNumber!==block.number)throw Error('BNB receipt identity mismatch');
 return (receipt.logs||[]).filter(l=>!l.removed&&BNB_TOKENS[l.address?.toLowerCase()]&&l.topics?.[0]?.toLowerCase()===topic).map(l=>{
 if(l.topics.length!==3||!l.topics.every(hash)||!hash(l.data)||l.transactionHash?.toLowerCase()!==tx.hash.toLowerCase()||l.blockHash?.toLowerCase()!==block.hash.toLowerCase())throw Error('Invalid BNB transfer log');
 const token=BNB_TOKENS[l.address.toLowerCase()];return {network:'BSC',transaction:tx.hash.toLowerCase(),eventId:String(qty(l.logIndex)),source:'bsc-facilitator-indexer',payer:'0x'+l.topics[1].slice(-40).toLowerCase(),payTo:'0x'+l.topics[2].slice(-40).toLowerCase(),asset:l.address.toLowerCase(),amount:BigInt(l.data).toString(),decimals:token.decimals,timestamp:qty(block.timestamp)*1000,status:'settled',facilitator:provider.id,block:qty(block.number),blockHash:block.hash.toLowerCase()};
 });
}
export async function syncBnbFacilitators(env){
 const db=env.DB,id='bnb-facilitators-v1',now=Date.now();
 const call=async(method,params)=>{const r=await fetch(env.BSC_RPC_URL||'https://bsc-dataseed.bnbchain.org',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),redirect:'error',signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('BNB RPC HTTP '+r.status);const d=await r.json();if(d.error||d.result==null)throw Error('BNB RPC unavailable: '+method);return d.result};
 const lock=await db.prepare('INSERT INTO sync_locks(id,until) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET until=excluded.until WHERE sync_locks.until<? RETURNING id').bind(id,now+60000,now).first();if(!lock)return{busy:true};
 let start=0,next=0,indexed=0;
 try{const prior=await db.prepare('SELECT * FROM chain_cursors WHERE id=?').bind(id).first();start=prior?.start_block||0;next=prior?.next_block||0;
 if(qty(await call('eth_chainId',[]))!==56)throw Error('Wrong BNB network');const head=await call('eth_getBlockByNumber',['finalized',false]),height=qty(head.number);
 if(!start){start=Number(env.BNB_START_BLOCK)||Math.max(1,height-100);if(!Number.isSafeInteger(start)||start<1||start>height)throw Error('Invalid BNB start block');next=start}
 if(prior?.last_block_hash){const last=await call('eth_getBlockByNumber',['0x'+(next-1).toString(16),false]);if(last.hash!==prior.last_block_hash)throw Error('BNB checkpoint changed; review required')}
 const end=Math.min(height,next+29);for(;next<=end&&Date.now()-now<30000;next++){
 const block=await call('eth_getBlockByNumber',['0x'+next.toString(16),true]);if(qty(block.number)!==next||!hash(block.hash))throw Error('Invalid BNB block');const records=[];
 for(const tx of block.transactions){if(BNB_PROVIDERS.some(p=>p.signers.includes(tx.from?.toLowerCase())))records.push(...decodeBnbTransfer(tx,await call('eth_getTransactionReceipt',[tx.hash]),block))}
 const writes=[];for(const r of records){writes.push(db.prepare('INSERT INTO receipts(network,`transaction`,event_id,source,payer,pay_to,asset,amount,decimals,timestamp,status,received_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(network,`transaction`,event_id) DO NOTHING').bind(r.network,r.transaction,r.eventId,r.source,r.payer,r.payTo,r.asset,r.amount,r.decimals,r.timestamp,r.status,now));writes.push(db.prepare('INSERT INTO chain_evidence(network,`transaction`,event_id,block_number,block_hash,contract,context_key) VALUES(?,?,?,?,?,?,?) ON CONFLICT(network,`transaction`,event_id) DO NOTHING').bind(r.network,r.transaction,r.eventId,r.block,r.blockHash,r.asset,r.facilitator))}
 writes.push(db.prepare('INSERT INTO chain_cursors(id,start_block,next_block,last_block_hash,head,checked_at,error) VALUES(?,?,?,?,?,?,NULL) ON CONFLICT(id) DO UPDATE SET next_block=excluded.next_block,last_block_hash=excluded.last_block_hash,head=excluded.head,checked_at=excluded.checked_at,error=NULL').bind(id,start,next+1,block.hash,height,Date.now()));await db.batch(writes);indexed+=records.length;
 }return{indexed,nextBlock:next,head:height};
 }catch(e){await db.prepare('INSERT INTO chain_cursors(id,start_block,next_block,checked_at,error) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET checked_at=excluded.checked_at,error=excluded.error').bind(id,start,next,Date.now(),e.message).run();return{indexed,error:e.message}}finally{await db.prepare('DELETE FROM sync_locks WHERE id=?').bind(id).run()}
}
