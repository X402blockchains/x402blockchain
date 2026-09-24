# Search discovery

The public robots.txt allows crawling and advertises /sitemap.xml. The sitemap includes the homepage, /directory/, and individual HTML pages for catalog-listed project origins. Each page has a canonical URL, description, and a link to the interactive explorer. Hash routes are not separate sitemap URLs.

Regenerate with `python3 scripts/search-pages.py public` before deployment. It reads only the public ecosystem API. Deploy the resulting public/directory, public/robots.txt, public/sitemap.xml and updated public/index.html. These catalog snapshots do not update automatically.

In Google Search Console and Bing Webmaster Tools, verify ownership of https://x402blockchains.com and submit https://x402blockchains.com/sitemap.xml. Search-engine acceptance and ranking are not guaranteed. No verified account submission has been performed.

X Pay verification (2026-09-25): the official OpenAPI describes 16 paid utility APIs on Base, with no facilitator verify/settle routes. GET /supported, /facilitator/supported and /x402/supported returned 404. This does not prove no facilitator exists; its role remains unverified pending official documentation and capability evidence.

Update: PR #1218 identified the separate facilitator domain https://facilitator-xpay.llc. Its /supported endpoint responds with x402Version 2, exact and eip155:8453. A published transaction independently matches signer 0x589a2314a2e05f45e40c4823da3ba58d421db3d8 calling Base USDC. X Pay is now independently listed; the upstream PR remains open.
