# Independent live collection

The website can read its payment APIs from a separate collector through the server-only `COLLECTOR_API_URL` setting. Catalog discovery, reviewed listings and administrator controls remain on the Site. Payment records are stored in the collector's own SQLite database; requests do not proxy x402scan's transaction API.

## cPanel / Node.js 24

Upload the application outside the public document root. Install Node.js 24, set the application startup file to `app.cjs` (copy `scripts/passenger.cjs` to the application root), and mount the application at `/data`. Passenger serves read-only requests. It is not relied on to keep background work alive.

Run the collector separately from cron, every minute. Use an exclusive `flock` and a bounded `timeout` to prevent overlapping collection processes:

```sh
cd /absolute/path/to/application && flock -n .collector.lock timeout 55s env BASE_BATCH_BLOCKS=100 INDEXER_BUDGET_MS=45000 INDEXER_INTERVAL_MS=1000 /path/to/node24 scripts/collector.mjs --collect-only >> .local/collector.log 2>&1
```

Create `.local` before the first scheduled run. Run `node scripts/collector.mjs --once` once to initialize the database and check RPC connectivity. The four networks are collected concurrently. Receipt writes and checkpoints remain atomic. Restarted runs resume from stored checkpoints. SQLite WAL and a busy timeout allow readers alongside the collector.

## API endpoints

- `/data/api/v1/transactions?network=Base&days=1&page=1&limit=20`
- `/data/api/v1/analytics?network=All&days=1`
- `/data/api/v1/analytics?origin=https%3A%2F%2Fexample.com&days=30`
- `/data/api/v1/analytics?facilitator=payai&days=30`
- `/data/api/v1/indexers`
- `/data/api/v1/bsc/status`
- `/data/api/openapi.json`

Analytics returns zero-filled time buckets, distinct transaction/buyer/seller counts, top sellers, facilitator histories and token-specific volumes. Volumes are approximate display sums in each token's units, not USD. Keep raw integer amounts for accounting. Project activity excludes shared seller addresses where catalog origin attribution is ambiguous.

## Check progress

Confirm the cron entry exists, its log gains new timestamps, checkpoints advance, and API counts grow. `continuous` describes deployment mode; freshness and errors determine actual progress. Public RPCs may rate limit requests. Dedicated Base, Solana, BSC and XRPL RPC URLs can be configured server-side without changing the browser application.

## Scope and history

This is not a complete copy of x402scan's database. Initial Base and BSC collection begins near the finalized tip unless starting blocks are supplied before database initialization. Solana scans known active facilitator accounts and alternates recent collection with older signature pages. XRP scans validated ledgers from its configured start. All adapters retain their documented attribution limits. The BSC router may have no matching events in a scanned range; zero records is not evidence that the entire BSC x402 ecosystem has no activity.

A separate Base historical cursor scans the preceding 24 hours without moving the live cursor. Set BASE_HISTORY_START_BLOCK before its first run for an older start. For full historical coverage, provision archival RPC capacity, choose documented starting points and run a separate backfill database before merging validated records. Never rewind a live cursor or label ordinary token transfers as x402 purchases merely to inflate counts.

## Operations

Back up the SQLite database using SQLite's backup operation, rotate collector logs, monitor storage and lag, and retain secrets outside the document root. Do not expose databases, deployment metadata, cron backups or server environment files. The cPanel API is read-only and strips trusted Sites identity headers. The original Site retains its authenticated listing workflow.
