# Local backend review

This version is local only. Nothing was deployed or pushed.

## Run

Requires Node 24 (built-in SQLite), and the existing design dependencies.

```sh
node design/build.mjs
node scripts/design-preview.mjs
# In a separate terminal:
node scripts/local-live-collector.mjs
```

Open http://127.0.0.1:4174/. The frontend refreshes every 30 seconds. The collector continues while its process and this computer remain running; visiting the website is not required. It is not installed as a reboot-persistent service. SQLite is stored in `.local/development.sqlite`; keep databases and secrets out of GitHub. The original illustrative design is retained at `/?design=1` and clearly labeled as sample data.

## Available functions

- Catalog project search, chain filtering and pagination; project resources and recipient addresses.
- Facilitator directory, XPay profile and separately attributed seller activity.
- Real indexed payment events with chain, hash, buyer, seller, facilitator, token amount, time and explorer link.
- Daily charts and exact token-volume totals. No invented USD prices or growth rates.
- Independent public-source collector, durable checkpoints, deduplicated payment events and reported errors.
- Private local listing submissions and receipt-token status lookup.
- Provider-declared logo manifest with alternative-image fallback; public listings withheld when no usable logo is known.
- Animated beveled logo and connected-economy map. The map is an illustration, not geographic telemetry.

## API

`GET /api/live/summary`, `/transactions`, `/projects`, `/facilitators`, `/project?origin=...`, `/coverage`.

Common parameters: `network=All|Base|BSC|Solana`, `days=1|7|30|0`, `page=1`, `limit=20` (maximum 100), `q=...`.
Transactions and summary also support `facilitator=...`, `origin=...`, `wallet=...` (wallet requires a network). Transaction lists count payment events; summary counts distinct chain/hash pairs. One transaction can contain more than one event. Buyer and seller counts are addresses, not identified people. Token totals are not USD valuations.

`POST /api/live/applications` accepts name, website, description, endpoint, docs, email, role, chains and required logo URL. HTTPS public URL syntax, same-origin requests, body size and hourly submission limit are enforced. Returns private id/token. Status lookup: `GET /api/live/applications?id=...` with `Authorization: Bearer TOKEN`.

## Listing review

1. Project submits a public HTTPS website, endpoint, docs, supported chains, logo and private contact.
2. Submission remains private and pending. Save the downloadable receipt token.
3. Operator verifies domain/wallet ownership and documentation, checks advertised mainnet support and examines successful settlement receipts. This is a manual review; automatic ownership challenge verification is not implemented.
4. Record the evidence and decision locally:

```sh
node scripts/review-local-listing.mjs APPLICATION_ID approved "Reviewed domain ownership and linked settlement evidence..."
```

Use `needs_information` or `rejected` instead when appropriate. Approved listings appear in the catalog; approval does not automatically configure a collector or assign a security-audit badge. New facilitator settlement indexing requires a documented signer/router adapter and tests.

## Sources and evidence

- x402scan MIT registry: https://github.com/Merit-Systems/x402scan — facilitator metadata, not access to its private historical database.
- Base JSON-RPC: successful receipts and known facilitator signers. Broad signer-associated transfers do not by themselves prove an HTTP x402 request; records state that limitation.
- Base Blockscout address history: discovery of candidate hashes, followed by on-chain verification. Failed requests preserve retry queues.
- Solana public RPC: known facilitator accounts, signatures, finalized transactions and token changes. Public quotas limit backfill.
- BNB x402-exec router settlement events: https://github.com/nuwa-protocol/x402-exec .
- AEON BNB router and authorization events: https://github.com/AEON-Project/bnb-x402/blob/V2.0/facilitator.md . The event decoder was checked against transaction `0x09e289173079ba3dcee54d9ff23f4b27d45f34100c7dda93daa29e1d53bd9d92`.
- AEON capabilities: https://facilitator.aeon.xyz/supported .
- Dexter capabilities / published EVM signer: https://x402.dexter.cash/supported . BNB signer-associated transfers are labeled accordingly.
- Public BNB log RPC: https://bsc.api.pocket.network . Recent logs worked in testing, older archive ranges failed. Official BNB public endpoints restrict log access: https://docs.bnbchain.org/bnb-smart-chain/developers/json_rpc/json-rpc-endpoint/ .
- XPay: https://facilitator-xpay.llc/supported and https://github.com/Merit-Systems/x402scan/pull/1218 . The PR was open at audit time. Ten published settlement hashes were independently verified and imported. This is not an endorsement or security audit.
- Project catalogs: public facilitator discovery feeds and the bundled public snapshot, with source status and pagination progress in coverage. Listing counts can change as fresh completed sweeps replace older entries.
- Logos: provider-declared icons from project sites, recorded in `public/logos.json`. Some providers publish no usable image; generic hosting-provider icons should not be treated as a project's own brand. Coverage is in `public/logo-coverage.json`.

## Remaining limitations — not production complete

This system does NOT contain every x402 transaction and does NOT match x402scan's historical coverage. Current local counts are available through `/api/live/summary?days=0`. Most BNB history is still missing. Ordinary BNB chain transactions are not automatically x402 payments. XRP is deferred in this interface.

Public RPC rate limits and archive restrictions remain material blockers. Matching an explorer requires the same signer/router set, full historical ingestion, attribution rules and time boundaries—or an authorized export/API from that explorer. Public source code is not its indexed database. No paid API calls or purchases were made.

XPay's API-server buyer activity is a different measure from its facilitator settlements. The user's screenshot reports approximately 5.68K server transactions in the earlier screenshot; the current browser audit showed 8.34K over its selected 30-day period. This backend does not copy that aggregate into unrelated facilitator totals.

Before production: persistent hosted worker, monitored archive-capable RPC capacity, complete backfills, retention and backups, scalable aggregate storage, stronger abuse controls, ownership-verification automation and operational alerts. The local API uses an exact integer SQLite aggregate for token totals, but is not benchmarked for millions of records. Coverage indicators must remain visible until completeness is established.
