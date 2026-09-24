# Own data API and collector

This application reads chain nodes directly, keeps its own database and serves `/api/v1/*`. It does not buy or proxy x402scan transaction APIs. The existing facilitator metadata retains its source attribution.

## Run on your server

Use Node 24+, install the package dependencies, then:

```sh
pnpm install --frozen-lockfile
pnpm build
node --env-file=.env scripts/collector.mjs
```

Create `.env` from `.env.example` and configure dedicated mainnet RPC URLs for sustained collection. No wallet keys are needed. The default listener is `127.0.0.1:4174`; put it behind your HTTPS reverse proxy. It serves both the website and read-only APIs against `.local/indexer.sqlite`. Keep this database on persistent storage, back it up, and run only one collector process per SQLite database. `--once` performs one cycle for operations checks. SIGTERM/SIGINT stops between bounded batches.

Use your server's process supervisor to restart the process after reboot. This repository does not provision a server or register an always-on service on your computer. `INDEXER_INTERVAL_MS` controls the pause between cycles; public RPC limits apply. Avoid aggressive retries after provider errors.

## Hosted Site versus self-hosted server

The hosted Site uses its own D1 database. The self-hosted collector uses SQLite; these databases are **not automatically synchronized**. To use the continuously collected data, run the complete frontend/API on the same server and direct your domain to it. Do not assume a local collector populates the hosted Site.

The hosted Site runs bounded batches on overview visits or authenticated administrator requests. Its `scheduled` handler can be connected by a supporting platform, but no permanent schedule is provisioned. The Our API page reports this limitation. Public pages refresh once a minute while visible.

## Chain adapters

| Chain | Detection | Startup and history |
| --- | --- | --- |
| Base | Documented facilitator submits a USDC authorization call and matching successful Transfer logs | Starts 24 finalized blocks back by default; BASE_START_BLOCK sets an initial historical start; BASE_BATCH_BLOCKS up to 100 per batch |
| BSC | Finalized Settled events from published x402-exec router | Starts 2,000 blocks back; BSC_START_BLOCK changes the initial start |
| Solana | Documented facilitator signs a successful finalized SPL Token transfer | Rotates accounts, alternates paginated historical and recent scans; unavailable transactions block advancement |
| XRP | Validated successful Payments with T54 SourceTag 804681468 | Starts 10 validated ledgers back; XRPL_START_LEDGER changes initial start; uses actual delivered amounts |

Start settings apply only before the first successful checkpoint. Changing them does not erase or rewind an existing cursor. Backfill requires archival node retention. A changed finalized checkpoint/ledger chain or incomplete RPC response stops the affected batch rather than skipping data.

Solana currently supports parsed transfers in the original SPL Token program, not Token-2022 or unparsed/version-unsupported transactions. Base excludes other tokens and routing paths. BSC is router-specific. XRP tags are publicly spoofable. Base/Solana facilitator associations and XRP tags are **inferred protocol evidence**, not a guarantee that an HTTP service was purchased or that the stated facilitator operated the transaction. Solana evidence stores its finalized slot; block_hash is empty because this reader does not retrieve a block hash.

The collector is an initial bounded implementation. Measure lag and provider errors before calling it production-scale. It has not completed full historical backfills, and its defaults may fall behind busy chains. Larger workloads need queued workers, suitable archive nodes and operational capacity.

## Your API

- `GET /api/openapi.json`: machine-readable API reference.
- `GET /api/v1/transactions?network=Base&days=0&page=1&limit=100`: retained receipts, project attribution and evidence labels.
- `GET /api/v1/analytics?network=All&days=1`: settled statistics and top servers/facilitators.
- `GET /api/v1/participants?role=buyers&network=Solana&days=7`: address rankings.
- `GET /api/v1/address?network=XRP&address=...&days=0`: retained address activity.
- `GET /api/v1/transaction?network=BSC&hash=...`: direct read-only chain lookup.
- `GET /api/v1/ecosystem`, `/services`, `/facilitators`: discovery directories.
- `GET /api/v1/indexers`: checkpoints, errors and coverage.

`days=0` means all **retained** history, not every transaction ever made. Unknown USD valuations remain unavailable. Hosted access is still restricted by the existing Site audience. The self-hosted collector rejects writes and strips Sites identity headers; do not trust client-supplied identity if you add write access later.

## Protocol references

- https://solana.com/docs/rpc/http/getsignaturesforaddress
- https://solana.com/docs/rpc/json-structures
- https://github.com/t54-labs/x402-xrpl/blob/main/packages/xrpl-x402-standard.md
- https://xrpl.org/docs/references/protocol/transactions/metadata
- https://github.com/nuwa-protocol/x402-exec
