"""Build a public icon manifest from provider-declared HTML icons.
Resolve and pin public IPs before fetching; never follow redirects implicitly.
Run after refreshing catalog-snapshot.mjs. No credentials are used.
"""
import concurrent.futures, json, ipaddress, socket, subprocess, urllib.parse
from html.parser import HTMLParser
from pathlib import Path
snapshot=json.loads(Path('server/catalog-snapshot.mjs').read_text().split('export const SNAPSHOT=',1)[1].rstrip(';\n'))
registry=json.loads(Path('server/facilitator-registry.mjs').read_text().split('export const REGISTRY=',1)[1].rstrip(';\n'))
origins=sorted(set(urllib.parse.urlsplit(r['url']).scheme+'://'+urllib.parse.urlsplit(r['url']).netloc for r in snapshot['resources'])|set(urllib.parse.urlsplit(r.get('docs') or r['url']).scheme+'://'+urllib.parse.urlsplit(r.get('docs') or r['url']).netloc for r in registry))
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
  found=page(origin)
  if not found:return origin,[]
  url,html=found;parser=Icons();parser.feed(html);icons=[]
  for href in parser.links:
   icon=urllib.parse.urljoin(url,href);u=urllib.parse.urlsplit(icon)
   if u.scheme=='https' and not u.username and not u.password and not u.port and public(icon) and icon not in icons:icons.append(icon)
  return origin,icons[:4]
 except Exception:return origin,[]
manifest={};completed=0
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
 for origin,icons in pool.map(discover,origins):
  completed+=1
  if icons:manifest[origin]=icons
  if completed%100==0:print(f'Checked {completed}/{len(origins)} origins; {len(manifest)} declared icon sets',flush=True)
Path('public/logos.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n')
print(f'Complete: {len(manifest)} declared icon sets across {len(origins)} origins',flush=True)
