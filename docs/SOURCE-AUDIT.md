# Source audit — 27 September 2026 (Malaysia time)

## Concrete XPay discrepancy

The x402scan X Pay **server** page was read in the browser with **Past 30 Days** selected. It showed approximately **8.34K transactions, $40.76 volume, 60 buyers, 21 resources**. These are rounded external measurements, not imported transaction records.

Source: https://www.x402scan.com/server/766676c5-56f8-4b05-ba3d-95a8ce6a3561

The local static direct catalog had only 16 resources. This was a real stale-data defect. It is corrected by a periodic adapter reading https://www.api-xpay.com/x402 and checking unsigned HTTP 402 challenges for every advertised endpoint. The first full refresh validated and stored 21 resources. No payment was signed or sent.

The local historical transaction count is still much lower. Ten published **facilitator** settlement hashes were verified; they are not a replacement for the server's 8.34K total. Additional chain-derived history is still being collected. The external number is deliberately not inserted as synthetic receipts.

## Other directories

- Agora402: https://agora402.io/docs documents public paginated `/api/v1/discover`. The first import read 53 AgentCards, preserving public payment requirements on supported networks. Records group by serving origin; shared platform endpoints are not falsely counted as 53 independent companies. Its voluntary activity pings are explicitly unverified in its docs and are **not** ingested as blockchain transactions.
- x402 Bazaar: https://github.com/x402-foundation/x402/blob/main/docs/extensions/bazaar.mdx documents resource metadata and payment requirements, including provider-specified icons. Catalog data describes endpoints; it is not historical transaction data.
- x402.new: https://x402.new/services?category=onchain displays service call counts. No documented transaction-hash export was established during this audit; those displayed counts are not imported as chain receipts.
- x402scan: https://github.com/Merit-Systems/x402scan provides implementation and registry metadata. Its database is not included just because its code is open source. Source and address coverage must be reconciled before claiming equal totals.

## Logo rule

Public project listings must have a provider logo candidate. Generic hosting-platform favicons are excluded. Missing-logo projects remain available internally as discovery data but are held out of the public project directory. If all candidate images fail in the browser, the card is hidden rather than shown without a logo. The source audit found 718 origin icon sets in a universe of 1,414 origins; 696 still had no usable discovered icon set. Those numbers describe the audit manifest, not the current filtered catalog.

The internal transaction history is never deleted merely because the recipient project lacks a logo. An unattributed wallet remains visible as an address, not a fabricated branded listing.

## Coverage acceptance criteria

A complete-coverage claim requires: historical start points for every supported signer/router, uninterrupted finalized checkpoints, gap detection, reorg handling, deduplicated events, consistent aggregation semantics, and a period-by-period reconciliation against a reference export. These conditions have not yet been met. Public BNB archive limitations are a major remaining gap.

No paid APIs, account creation, deployment or GitHub publication occurred in this work.

## Agent402.tools integration

Added after the user identified https://agent402.tools. Public documentation: https://agent402.tools/llms.txt and https://agent402.tools/leaderboard .

The `/api/index` connector follows `Link: rel=next` and persists each page. It completed an initial sweep with 3,056 supported-network seller rows (Base, BSC and/or Solana). This is not 3,056 newly verified businesses; it is source-reported origin metadata, deduplicated against existing catalog origins. Endpoint counts remain explicitly reported counts when individual resource schemas are unavailable. The public logo requirement still applies.

`/api/leaderboard?include=external&top=50` and `/api/revenue` are cached separately through our `/api/live/external` route. Leaderboard response said `windowRequested:24h` but `windowServed:7d`, so the UI displays the served period. Its top-50 limit is not a complete list of transactions or sellers. It applies per-call value filters and groups origins/wallets differently from the local explorer. Its revenue feed describes payments through Agent402's own rails, including internal traffic and MPP; it is not the entire x402 ecosystem. These aggregates are never turned into synthetic receipts or added to local totals.

Known valid Base recipient wallets from the new directory enter the existing independent blockchain backfill queue. Invalid placeholders, zero EVM wallets and unsupported/test networks are excluded. Actual receipt ingestion still requires on-chain verification and attribution; new catalog entries do not create payment volume.

## Agent402 X Pay comparison, 2026-09-27 local review
Public `/api/leaderboard?include=external&top=50` snapshot at 2026-09-26T23:16:14.970Z reports X Pay: 8,507 calls, USD 41.6308, 54 buyers, rolling 7d. This matches the supplied screenshot's rounded values. Its leaderboard endpoints field is 9, whereas the independently fetched X Pay catalog has 21 resources; these fields are not interchangeable.
Project detail pages now show matched Agent402 aggregates in a separate sourced panel. They are not inserted as receipts or added to local totals. The local date selector does not change the external source window. Hourly collection and 30-second UI refresh preserve source timestamps. Historical blockchain indexing remains incomplete.

## User-opened Chrome page inspected, 2026-09-27
URL: https://agent402.tools/base?seller=www.api-xpay.com#detail
The rendered page shows three distinct measurements:
- Rolling 7d settled calls: 8,507; USD 41.63; 54 buyers; 21 tools.
- 30d wallet activity: 8,758 inbound USDC transfers; USD 131.39; 67 buyers. Explicitly may include non-x402 transfers and includes one internal canary buy. The page now says scan complete.
- Coinbase Bazaar's own last-30-day measurement: 8,073 calls; 50 distinct payers; latest call 2026-09-26.
These must not be merged, substituted, or relabeled as identical x402 totals. Page also reports discovery through /openapi.json and no /.well-known/x402 endpoint for X Pay. This is an external project's discovery configuration, not permission to modify their server.

## Dashboard reconciliation and presentation update
The latest checked Agent402 snapshot (2026-09-27T05:16:09.905Z) reports X Pay rolling 7d: 9,170 settled calls, USD 74.684712, 57 buyers. Saved to the separate external snapshot store. These are not receipt rows.
Dashboard statistics, daily chart and chain-volume cards redesigned. Transaction table has explicit All/Base/Solana/BNB filters; all-network rows remain ordered by time, not artificially balanced. Pagination no longer resets on each timestamp refresh. Missing BNB history remains explicitly unindexed. Local historical import still encounters Base RPC rate limits; no completeness or cross-explorer parity claim.

## BNB explorer discovery — 2026-09-27
- Public frontend https://bnbscan.ai/ calls https://x402-scan-api.aeon.xyz/api/home/transaction/transactionOverallStats and /pages using read-only POST requests.
- New local collector `bnb-explorer` refreshes rolling 30-day provider aggregates every 15 minutes, preserving last successful snapshot on error. Stored separately under `bnb-explorer-30d`; does not create receipts or inflate headline totals.
- Initial calendar-date query returned 80,720 payments / 1,793,034.89 reported volume. The production adapter uses exact rolling UTC timestamps, so totals can differ.
- Sample hash 0x3270c1f7b118ebe384fbc52bdd44e68d88df7aeb517d67522807e7950b94286f independently returned successful BSC receipt with USDT transfer to 0xf2b013591b02f51a6454abdf6c1a7da6288575ff. This verifies settlement existence, not the full feed’s x402 classification. API sender is transaction origin; token sender is a contract, so do not map those interchangeably.
- BNB aggregate card is provider-reported and remains separate from indexed transaction rows. Full historical receipt import and protocol attribution remain outstanding.

BNB individual payment import added: `server/bnb-payment-history.mjs`. Reads fixed-window, paginated AEON public history, then independently checks successful receipt, USDT contract, destination and amount. Uses on-chain token sender as payer, not provider transaction-origin field. Stores receipt log index for deduplication; mismatches stop progress. Provider supplies x402 classification. Ten records per collector cycle; checkpoint stored as bnb-payment-history. Initial window contains 79,332 provider rows; only successfully imported rows appear in the local table. Full history remains in progress, not complete. Nine relevant tests passed.
