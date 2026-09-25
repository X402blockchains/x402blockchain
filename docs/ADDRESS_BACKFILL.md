# Base address backfill

The collector uses the public Base Blockscout API to discover transaction hashes for documented Base facilitators and the X Pay merchant address. Explorer amounts and aggregate counts are never imported as authoritative payments.

Each candidate is checked against Base RPC: chain ID 8453, finalized block height, transaction hash, transaction and receipt block identities, successful status, USDC contract and transfer log identity. Direct USDC transactions must use the observed transferWithAuthorization selector; ordinary wallet transfers are excluded by this adapter. Router calls still use documented-sender association, which is inferred x402 evidence rather than proof of the purchased resource.

Receipts deduplicate by network, transaction and event ID, using the same receipt and evidence tables as the sequential collector. Merchant recipient activity remains separate from facilitator sender attribution.

`address_backfills` stores the next discovery page and pending hashes before RPC validation. Errors preserve the queue for retry. Each scheduled collector iteration processes up to 50 candidates in groups of five, with a 25-second processing budget from one address. The three-minute cycle prioritizes X Pay merchant history, X Pay facilitator history, then other documented facilitator addresses. Completed histories restart daily. Catalog Base merchant addresses are added automatically; the sequential reader also collects new activity.

`GET /api/indexers` includes `addressHistory` with completion, checks, errors and verified-event counters. These counters measure processed evidence and may include overlap with existing receipts; use the transaction API for distinct totals.

Base address history and live block reads run sequentially to avoid competing for the same public RPC quota. The broad Base block-history task is paused in the scheduled collector while address histories run.

The scheduled Base block reader also batches block and receipt requests when `BASE_USE_BATCH_RPC=true`, avoiding the earlier per-request serial throttle.

Optional `BASE_BATCH_RPC_URL` selects a provider for batch verification. The default is `BASE_RPC_URL` or the public Base endpoint. Public provider rate limits and archive availability still constrain completeness. This is not an import of x402scan's private database and does not promise identical counts.

Every verified group is saved before requesting the next group. A later provider failure retains the remaining queue and does not discard saved receipts.

Research: x402scan's public sync implementation supports CDP, Bitquery, and BigQuery. It queries indexed Transfer events by facilitator sender and token, rather than relying solely on a public RPC block-by-block scan. We continue using free Blockscout candidate discovery plus Base RPC receipt verification. PublicNode was tested but refused a historical receipt without a personal archive token; it is not configured as an archive fallback.
