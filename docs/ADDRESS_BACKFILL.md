# Base address backfill

The collector uses the public Base Blockscout API to discover transaction hashes for documented Base facilitators and the X Pay merchant address. Explorer amounts and aggregate counts are never imported as authoritative payments.

Each candidate is checked against Base RPC: chain ID 8453, finalized block height, transaction hash, transaction and receipt block identities, successful status, USDC contract and transfer log identity. Direct USDC transactions must use the observed transferWithAuthorization selector; ordinary wallet transfers are excluded by this adapter. Router calls still use documented-sender association, which is inferred x402 evidence rather than proof of the purchased resource.

Receipts deduplicate by network, transaction and event ID, using the same receipt and evidence tables as the sequential collector. Merchant recipient activity remains separate from facilitator sender attribution.

`address_backfills` stores the next discovery page and pending hashes before RPC validation. Errors preserve the queue for retry. Each scheduled collector iteration processes up to 25 candidates from one address. The three-minute cycle prioritizes X Pay merchant history, X Pay facilitator history, then other documented facilitator addresses. Completed histories stop; the sequential reader remains responsible for new activity.

`GET /api/indexers` includes `addressHistory` with completion, checks, errors and verified-event counters. These counters measure processed evidence and may include overlap with existing receipts; use the transaction API for distinct totals.

The scheduled Base block reader also batches block and receipt requests when `BASE_USE_BATCH_RPC=true`, avoiding the earlier per-request serial throttle.

Optional `BASE_BATCH_RPC_URL` selects a provider for batch verification. The default is `BASE_RPC_URL` or the public Base endpoint. Public provider rate limits and archive availability still constrain completeness. This is not an import of x402scan's private database and does not promise identical counts.
