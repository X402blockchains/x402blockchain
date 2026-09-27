# Namecheap production deployment

The public site is https://x402blockchains.com. Apache serves the compiled React assets under `/design/` and rewrites `/api/*` to the existing Passenger application at `/data/api/*`.

`app.cjs` imports `scripts/production-server.mjs`. The portal uses `.local/portal.sqlite`; the preserved legacy API uses `.local/indexer.sqlite`. Neither database belongs in the public document root or GitHub. The portal seed contains public collected records and catalog snapshots only; listing submissions and editorial drafts were removed.

Run the portal collector every five minutes through cron with an exclusive lock and a 240-second timeout:

```sh
cd /home/YOUR_CPANEL_USER/x402-indexer && /bin/flock -n .portal-collector.lock /bin/timeout 240s env PORTAL_DB=.local/portal.sqlite /opt/alt/alt-nodejs24/root/usr/bin/node scripts/local-live-collector.mjs --once >> .local/portal-collector.log 2>&1
```

The browser refreshes data every 30 seconds. Aggregates have a 15-minute cache; news has a one-hour cache. Provider limits and outages can delay new records. Historical coverage remains incomplete, and external aggregates are not counts of locally indexed receipts.

The article editor is disabled in production. X providers remain disabled unless the owner configures credentials and authorizes their costs. Public project applications enter manual review; they are not automatically published.

Before updating, back up application files, web assets, cron settings, and SQLite databases using SQLite's backup API. Preserve `.local` during upgrades. To roll back this release, restore the previous app entrypoint and web assets from the private `x402-pre-release-20260927.tgz` backup and restore the saved cron file. Keep the new database for investigation; do not delete it.

## Verified on 2026-09-27

- 64 automated tests passed before deployment.
- Public homepage and summary, transactions, projects, facilitators, news APIs returned HTTP 200.
- Mixed transaction response contains Base, Solana and BSC.
- Article editor returned HTTP 403; news reports `localEditor: false`.
- Private server backup and original cron backup created; previous indexer database backed up separately.
- New cron entry installed while preserving the existing collector job.
- First hosted collector pass inserted 4 Base and 9 BNB payments. The AEON authorization RPC adapter reported `Missing RPC result`; its separate provider-history adapter succeeded. Collection gaps remain visible in Coverage.

The production server and news source adapters are included in this repository.

The scheduled 07:30 UTC run was independently verified through the public coverage endpoint. BNB authorization recovered successfully; Base history encountered a public RPC rate limit. Other scheduled jobs completed. Retry checkpoints remain persisted.
