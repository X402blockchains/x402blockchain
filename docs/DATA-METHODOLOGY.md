# Data methodology

## Datasets

Catalog records describe endpoints and services. Provider aggregates describe a provider's measured activity. Receipt records describe individually collected on-chain events. These datasets have different coverage and must not be presented as interchangeable.

Base/Solana 30-day aggregate charts use the public statistics feed documented in SOURCE-AUDIT.md. BNB aggregates use AEON's public explorer feed and remain outside that provider's Base/Solana headline total. Refresh intervals are approximately 15 minutes while the collector runs. BNB daily intervals and Base/Solana source intervals are not identical.

## Attribution

A seller receives payment; a facilitator submits or arranges settlement. One organization can fill both roles. Facilitator attribution uses adapter evidence and known published addresses. It is not inferred from a seller's name or the chain. X Pay purchases processed by Coinbase remain Coinbase-attributed. X Pay-attributed settlements are separate records.

BNB explorer imports check successful USDT receipts, destination, amount and event index. AEON supplies the payment/x402 classification. Matching a token transfer proves settlement, not independently that an HTTP 402 exchange took place. Import mismatches stop progress for review.

## Counts and amounts

Receipt lists paginate events; summaries may count distinct transaction hashes. A single hash may include multiple transfers. Do not compare these without matching definitions. Buyer addresses are not verified individual people. Provider counts may use different deduplication rules.

Raw amounts are integer strings with asset-specific decimals. Local USDC/USDT equivalents use $1 face value, not an oracle price. Unsupported assets are excluded from that equivalent. Chart gaps are not silently filled with zero. Independent chart scales are labelled; bar heights across panels are not directly comparable.

## Limitations

Historical indexing is incomplete. Public RPC limits, unknown facilitator addresses, missing catalogs and provider definitions can cause differences from other explorers. No guarantee of every x402 payment across all networks is made. Review `/api/live/coverage` and source timestamps before interpreting totals. XRP indexing is planned, not active.
