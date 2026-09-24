# Search discovery

The public robots.txt allows crawling and advertises /sitemap.xml. The sitemap includes the homepage, /directory/, and individual HTML pages for catalog-listed project origins. Each page has a canonical URL, description, and a link to the interactive explorer. Hash routes are not separate sitemap URLs.

Regenerate with `python3 scripts/search-pages.py public` before deployment. It reads only the public ecosystem API. Deploy the resulting public/directory, public/robots.txt, public/sitemap.xml and updated public/index.html. These catalog snapshots do not update automatically.

In Google Search Console and Bing Webmaster Tools, verify ownership of https://x402blockchains.com and submit https://x402blockchains.com/sitemap.xml. Search-engine acceptance and ranking are not guaranteed. No verified account submission has been performed.

X Pay verification (2026-09-25): the official OpenAPI describes 16 paid utility APIs on Base, with no facilitator verify/settle routes. GET /supported, /facilitator/supported and /x402/supported returned 404. This does not prove no facilitator exists; its role remains unverified pending official documentation and capability evidence.
