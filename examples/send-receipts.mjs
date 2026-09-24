import {readFile} from 'node:fs/promises';import {createHmac} from 'node:crypto';
const {SITE_ORIGIN,SOURCE_ID,INGEST_SECRET}=process.env;
if(!SITE_ORIGIN?.startsWith('https://')||!SOURCE_ID||!INGEST_SECRET||!process.argv[2])throw new Error('Set SITE_ORIGIN, SOURCE_ID, INGEST_SECRET and pass a receipt JSON file.');
const body=await readFile(process.argv[2],'utf8');JSON.parse(body);const timestamp=String(Date.now());
const signature=createHmac('sha256',INGEST_SECRET).update(timestamp+'.'+body).digest('hex');
const response=await fetch(new URL('/api/ingest/'+encodeURIComponent(SOURCE_ID),SITE_ORIGIN),{method:'POST',headers:{'content-type':'application/json','x-timestamp':timestamp,'x-signature':'sha256='+signature},body,redirect:'error'});
console.log(response.status,await response.text());if(!response.ok)process.exitCode=1;
