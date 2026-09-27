// Import only the settlement example published by AEON, after on-chain verification.
import {createDb} from './local-db.mjs';
import {BNB_TOKENS} from '../server/bnb-facilitators.mjs';
const transaction='0x09e289173079ba3dcee54d9ff23f4b27d45f34100c7dda93daa29e1d53bd9d92';
const contract='0x555e3311a9893c9b17444c1ff0d88192a57ef13e';
const provenance='https://github.com/AEON-Project/bnb-x402/blob/V2.0/facilitator.md';
async function rpc(method,params){const r=await fetch(process.env.BSC_RPC_URL||'https://bsc-dataseed.bnbchain.org',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('RPC HTTP '+r.status);const d=await r.json();if(d.error||d.result==null)throw Error('RPC unavailable: '+method);return d.result}
if(await rpc('eth_chainId',[])!=='0x38')throw Error('Wrong chain');
const receipt=await rpc('eth_getTransactionReceipt',[transaction]);
const block=await rpc('eth_getBlockByNumber',[receipt.blockNumber,false]);
const head=await rpc('eth_getBlockByNumber',['finalized',false]);
if(receipt.status!=='0x1'||receipt.to?.toLowerCase()!==contract||receipt.transactionHash!==transaction||receipt.blockHash!==block.hash||!block.transactions.includes(transaction)||BigInt(block.number)>BigInt(head.number))throw Error('Settlement verification failed');
const db=createDb(process.env.INDEXER_DB||'.local/development.sqlite');let count=0;
const writes=[];
for(const l of receipt.logs){const token=BNB_TOKENS[l.address.toLowerCase()];if(!token||l.topics[0]!=='0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')continue;
if(l.removed||l.transactionHash!==transaction||l.blockHash!==block.hash||l.topics.length!==3||!l.topics.every(t=>/^0x[0-9a-f]{64}$/i.test(t))||!/^0x[0-9a-f]{64}$/i.test(l.data))throw Error('Invalid transfer');
const event=String(Number(BigInt(l.logIndex))),payer='0x'+l.topics[1].slice(-40),seller='0x'+l.topics[2].slice(-40);
writes.push(db.prepare('INSERT INTO receipts(network,`transaction`,event_id,source,payer,pay_to,asset,amount,decimals,timestamp,status,received_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(network,`transaction`,event_id) DO NOTHING').bind('BSC',transaction,event,'bsc-documented-settlement',payer,seller,l.address,BigInt(l.data).toString(),token.decimals,Number(BigInt(block.timestamp))*1000,'settled',Date.now()));
writes.push(db.prepare('INSERT INTO chain_evidence(network,`transaction`,event_id,block_number,block_hash,contract,context_key) VALUES(?,?,?,?,?,?,?) ON CONFLICT(network,`transaction`,event_id) DO NOTHING').bind('BSC',transaction,event,Number(BigInt(block.number)),block.hash,contract,'aeon'));count++;
}
if(!count)throw Error('No supported transfers');await db.batch(writes);console.log(JSON.stringify({transaction,verifiedPaymentEvents:count,provenance,date:new Date(Number(BigInt(block.timestamp))*1000).toISOString(),note:'Published historical settlement example; not evidence of complete coverage.'}));
