"""Build crawlable catalog pages from the site's public API. No private data."""
import json, urllib.request, hashlib, html, pathlib, sys
from urllib.parse import quote
root=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'public')
base='https://x402blockchains.com'
projects=[]
for page in range(1,101):
 with urllib.request.urlopen(base+'/api/ecosystem?limit=100&page='+str(page),timeout=60) as r: data=json.load(r)
 projects.extend(data['items'])
 if len(projects)>=data['total']:break
 if not data['items']:raise RuntimeError('Incomplete catalog response')
else:raise RuntimeError('Catalog pagination exceeded safety limit')
e=html.escape
style='body{font:16px/1.65 system-ui,sans-serif;color:#172033;background:#fff;max-width:1100px;margin:40px auto;padding:0 24px}a{color:#245ce7}header,footer{padding:20px 0;border-bottom:1px solid #e5e7eb}h1{line-height:1.2}li{margin:14px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;list-style:none;padding:0}.grid li{border:1px solid #e5e7eb;border-radius:12px;padding:20px}small{color:#596579}'
def document(title,desc,path,body):
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+e(title)+' | x402blockchain</title><meta name="description" content="'+e(desc,quote=True)+'"><meta name="robots" content="index,follow"><link rel="canonical" href="'+base+path+'"><meta property="og:title" content="'+e(title,quote=True)+'"><meta property="og:description" content="'+e(desc,quote=True)+'"><meta property="og:url" content="'+base+path+'"><meta property="og:type" content="website"><style>'+style+'</style></head><body><header><a href="/">x402blockchain</a> · <a href="/directory/">Project directory</a></header><main>'+body+'</main><footer>Catalog-reported project information. Payment history is partially indexed. <a href="/#docs">Coverage and methodology</a></footer></body></html>'
paths=['/','/directory/'];cards=[]
for p in projects:
 origin=p['website'];name=p['name'];path='/directory/'+hashlib.sha256(origin.encode()).hexdigest()[:20]+'/'
 desc=(p.get('description') or 'Explore published x402 payment endpoints.')[:500]
 networks=', '.join(p.get('networks',[]));count=p['serviceCount']
 body='<h1>'+e(name)+'</h1><p>'+e(desc)+'</p><p><b>Networks:</b> '+e(networks)+'</p><p><b>Published endpoints:</b> '+str(count)+'</p><p><a href="'+e(origin,quote=True)+'" rel="nofollow noopener">Official website</a> · <a href="/#origin/'+quote(origin,safe='')+'">Open activity, endpoints and payment details</a></p>'
 if origin=='https://www.api-xpay.com':body+='<p>X Pay publishes pay-per-request utility APIs using USDC on Base. Its role as a payment facilitator has not been verified. A paid API listing does not establish facilitator status.</p>'
 target=root/path.lstrip('/');target.mkdir(parents=True,exist_ok=True);(target/'index.html').write_text(document(name,desc,path,body))
 cards.append('<li><h2><a href="'+path+'">'+e(name)+'</a></h2><p>'+e(networks)+' · '+str(count)+' endpoints</p><small>'+e(origin)+'</small></li>');paths.append(path)
(root/'directory/index.html').write_text(document('x402 project directory','Browse catalog-listed x402 projects and payment APIs across Base, Solana, XRP and BSC.','/directory/','<h1>x402 project directory</h1><p>Explore '+str(len(projects))+' catalog-listed project origins. Listings reflect published provider catalogs; they are not endorsements or proof of ownership.</p><ul class="grid">'+''.join(cards)+'</ul>'))
(root/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /data/\nSitemap: '+base+'/sitemap.xml\n')
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+e(base+p)+'</loc></url>' for p in paths)+'</urlset>')
p=root/'index.html';s=p.read_text()
if 'rel="canonical"' not in s:s=s.replace('</head>','<link rel="canonical" href="'+base+'/"><meta name="robots" content="index,follow"></head>')
if 'href="/directory/"' not in s:s=s.replace('Coverage &amp; methodology','Coverage &amp; methodology').replace('</footer>','<a href="/directory/">Browse project directory</a></footer>')
p.write_text(s)
print('Generated',len(projects),'project pages and',len(paths),'sitemap URLs')
