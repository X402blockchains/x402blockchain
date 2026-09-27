"""Build a public icon manifest from provider-declared HTML icons.
Resolve and pin public IPs before fetching; never follow redirects implicitly.
Run after refreshing catalog-snapshot.mjs. No credentials are used.
"""
import os, concurrent.futures, json, ipaddress, socket, subprocess, urllib.parse, urllib.request
from html.parser import HTMLParser
from pathlib import Path
snapshot=json.loads(Path('server/catalog-snapshot.mjs').read_text().split('export const SNAPSHOT=',1)[1].rstrip(';\n'))
registry=json.loads(Path('server/facilitator-registry.mjs').read_text().split('export const REGISTRY=',1)[1].rstrip(';\n'))
origins=sorted(set(urllib.parse.urlsplit(r['url']).scheme+'://'+urllib.parse.urlsplit(r['url']).netloc for r in snapshot['resources'])|set(urllib.parse.urlsplit(r.get('docs') or r['url']).scheme+'://'+urllib.parse.urlsplit(r.get('docs') or r['url']).netloc for r in registry))
# Include every currently listed origin, not only the bundled snapshot.
for page_number in range(1,101):
 with urllib.request.urlopen(os.environ.get('CATALOG_API','http://127.0.0.1:4174/api/live/projects')+'?limit=100&page='+str(page_number),timeout=40) as r:live=json.load(r)
 origins=sorted(set(origins)|{p['website'] for p in live['items']})
 if page_number*100>=live['total']:break
origins=sorted(set(origins)|{'https://x-pay.llc','https://www.api-xpay.com'})
previous=json.loads(Path('public/logos.json').read_text())
def image_ok(url):
 dest=public(url)
 if not dest:return False
 u,ip=dest;ip='['+ip+']' if ':' in ip else ip
 r=subprocess.run(['curl','-sS','-I','--max-time','4','--resolve',u.hostname+':443:'+ip,url],capture_output=True)
 text=r.stdout.decode('latin1').lower()
 return not r.returncode and (' 200 ' in text or ' 200\r' in text) and any(t in text for t in ['content-type: image/','content-type: application/octet-stream'])
class Icons(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='link' and 'icon' in a.get('rel','').lower() and a.get('href'):self.links.append(a['href'])
def public(url):
 u=urllib.parse.urlsplit(url)
 if u.scheme!='https' or u.username or u.password or u.port or not u.hostname:return None
 try:
  ips={r[4][0] for r in socket.getaddrinfo(u.hostname,443,type=socket.SOCK_STREAM)}
  if not ips or any(not ipaddress.ip_address(i).is_global for i in ips):return None
  return u,sorted(ips,key=lambda i:':' in i)[0]
 except (OSError,ValueError):return None
def page(url):
 for _ in range(3):
  dest=public(url)
  if not dest:return None
  u,ip=dest;ip='['+ip+']' if ':' in ip else ip
  r=subprocess.run(['curl','-sS','--max-time','4','--max-filesize','500000','--resolve',u.hostname+':443:'+ip,'-D','-','-A','x402blockchains-icon-discovery/1.0',url],capture_output=True)
  if r.returncode:return None
  head,_,body=r.stdout.partition(b'\r\n\r\n')
  # CONNECT proxy headers are not expected on the deployment host.
  lines=head.decode('latin1').splitlines();status=lines[0].split()[1] if lines else ''
  headers={k.lower():v.strip() for l in lines[1:] if ':' in l for k,v in [l.split(':',1)]}
  if status.startswith('3') and headers.get('location'):url=urllib.parse.urljoin(url,headers['location']);continue
  if status=='200' and 'html' in headers.get('content-type',''):return url,body.decode('utf-8','replace')
  return None
 return None
def discover(origin):
 try:
  candidates=list(previous.get(origin,[]));origins_to_check=[origin]
  host=urllib.parse.urlsplit(origin).hostname
  # Only conventional API hostnames: never infer parent brands for hosted tenants.
  if host.startswith('api.') and len(host.split('.'))>=3:origins_to_check.append('https://'+host[4:])
  for site in origins_to_check:
   found=page(site)
   if found:
    url,content=found;parser=Icons();parser.feed(content)
    candidates.extend(urllib.parse.urljoin(url,href) for href in parser.links)
   candidates.append(site+'/favicon.ico')
  verified=[]
  for icon in dict.fromkeys(candidates):
   if image_ok(icon):verified.append(icon)
   if len(verified)>=2:break
  return origin,verified
 except Exception:return origin,[]
manifest=dict(previous);completed=0
if os.environ.get('MISSING_ONLY')=='1':origins=[o for o in origins if not previous.get(o)]
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
 for origin,icons in pool.map(discover,origins):
  completed+=1
  if icons:manifest[origin]=icons
  if completed%100==0:print(f'Checked {completed}/{len(origins)} origins; {len(manifest)} declared icon sets',flush=True)
Path('public/logo-coverage.json').write_text(json.dumps({'checkedOrigins':len(set(origins)|set(previous)),'verifiedOrigins':len(manifest),'missingOrigins':[o for o in origins if o not in manifest]},separators=(',',':')))
Path('public/logos.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n')
print(f'Complete: {len(manifest)} declared icon sets across {len(origins)} origins',flush=True)
