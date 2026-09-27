// Generate a read-only query; does not connect to CDP or incur charges.
import {SOURCES} from '../server/sources.mjs';
import {BASE_USDC} from '../server/base.mjs';
export function auditQuery({start,end,recipient,offset=0}){
 const date=x=>{const d=new Date(x);if(!Number.isFinite(d.getTime()))throw Error('Invalid UTC boundary');return d.toISOString().replace('T',' ').replace('Z','')};
 const from=date(start),until=date(end);if(from>=until)throw Error('Start must precede end');
 if(!/^0x[0-9a-f]{40}$/i.test(recipient))throw Error('Invalid Base recipient');
 if(!Number.isSafeInteger(offset)||offset<0)throw Error('Invalid offset');
 const senders=[...new Set(SOURCES.flatMap(s=>(s.addresses||[]).filter(a=>a.network==='Base').map(a=>a.address.toLowerCase())))];
 if(senders.some(a=>!/^0x[0-9a-f]{40}$/.test(a)))throw Error('Invalid configured facilitator');
 return `SELECT address AS contract_address, parameters['from']::String AS sender,
transaction_from, parameters['to']::String AS recipient, transaction_hash,
block_timestamp, parameters['value']::UInt256 AS amount_atomic, log_index
FROM base.events
WHERE event_signature = 'Transfer(address,address,uint256)'
AND address = '${BASE_USDC}'
AND transaction_from IN (${senders.map(a=>"'"+a+"'").join(',')})
AND parameters['to']::String = '${recipient.toLowerCase()}'
AND block_timestamp >= '${from}' AND block_timestamp < '${until}'
ORDER BY block_timestamp ASC, transaction_hash ASC, log_index ASC
LIMIT 10000 OFFSET ${offset};\n`;
}
if(process.argv[1]?.endsWith('cdp-audit-query.mjs')){
 const end=process.argv[2]||new Date().toISOString(),start=new Date(new Date(end).getTime()-30*86400000).toISOString();
 console.log(auditQuery({start,end,recipient:process.argv[3]||'0x589a2314a2e05f45e40c4823da3ba58d421db3d8',offset:Number(process.argv[4]||0)}));
}
