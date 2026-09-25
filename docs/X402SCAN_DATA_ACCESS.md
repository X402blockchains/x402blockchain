# Matching x402scan data

Checked 2026-09-25 against Merit-Systems/x402scan and the live merchant API.

The official merchant transaction endpoint is:

`GET https://www.x402scan.com/api/x402/merchants/{address}/transactions?chain=base&page_size=100&page=0&timeframe=30`

The endpoint returned HTTP 402 Payment Required. Its payment challenge specifies x402 v2, Base (`eip155:8453`), USDC, and 10,000 atomic units per request (0.01 USDC). The public handler sets `.paid('0.01')`. Merchant aggregate statistics are also priced at 0.01 per request. No payment has been made or authorized by this implementation.

The transaction API supports Base and Solana, zero-based page numbers, at most 100 items per page, and lookbacks of 1, 7, 14, or 30 days. Roughly 5,680 records need at least 57 pages, costing about 0.57 USDC before retries or other costs. This is an estimate, not an exact record count: the UI rounds 5.68K.

## Attribution and reconciliation

An upstream import must retain its source and exact transaction identity, deduplicate on network/transaction/event, and never replace independently indexed evidence without reconciliation. Matching totals requires the same window boundaries, asset coverage, address mappings, transaction-versus-event semantics, and buyer deduplication. New activity means two requests at different times may differ.

X Pay's screenshot reports merchant activity, not its facilitator processing volume: 5.68K transactions, $27.45, 52 buyer wallets, 16 resources over the selected past 30 days. This is a comparison snapshot, not a synthetic receipt dataset.

The official API currently advertises only Base and Solana. BSC and XRP continue to require independent adapters and cannot be obtained from this endpoint by changing labels.

## Current limitation

The website's free collector uses scoped on-chain evidence. Queued addresses are not completed histories. The official upstream API is not integrated or funded. Do not claim full x402scan parity until actual imported records and aggregates have been reconciled.

Sources:
- https://github.com/Merit-Systems/x402scan/blob/main/apps/scan/src/app/api/x402/merchants/%5Baddress%5D/transactions/route.ts
- https://github.com/Merit-Systems/x402scan/blob/main/apps/scan/src/app/api/x402/merchants/%5Baddress%5D/stats/route.ts
- https://github.com/Merit-Systems/x402scan/blob/main/apps/scan/src/app/api/x402/_lib/schemas.ts
