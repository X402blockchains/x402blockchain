# Read API

Production base URL: `https://x402blockchains.com`. Machine-readable reference: [`/api/openapi.json`](https://x402blockchains.com/api/openapi.json).

| Endpoint | Purpose |
| --- | --- |
| `/api/v1/overview` | Summary and network coverage |
| `/api/v1/transactions` | Paginated indexed receipts |
| `/api/v1/analytics` | Time buckets, token amounts and participants |
| `/api/v1/ecosystem` | Projects grouped by website origin |
| `/api/v1/services` | Published payment endpoints |
| `/api/v1/facilitators` | Provider profiles and capabilities |
| `/api/v1/indexers` | Durable progress and current errors |
| `/api/v1/participants?role=buyers` | Indexed buyer addresses |
| `/api/v1/address?network=Base&address=...` | Indexed address history |
| `/api/v1/transaction?network=Base&hash=...` | Read-only transaction lookup |

## Common filters

Applicable directory and transaction endpoints accept `network=All|Base|Solana|BSC|XRP`, `page` starting at 1, `limit` from 1 to 100 and `q` for search. Activity endpoints accept `days=1|7|30|0`; zero selects all retained data. Transaction filters also include `status=all|settled|pending|failed`, `origin` and `facilitator`.

```sh
curl 'https://x402blockchains.com/api/v1/facilitators?network=Base&limit=100'
curl 'https://x402blockchains.com/api/v1/transactions?facilitator=xpay&days=0&limit=100'
curl 'https://x402blockchains.com/api/v1/indexers'
```

Inspect each response's `total`, `page`, coverage and evidence fields. Token amounts may be integer strings plus decimals; do not cast large raw amounts to floating-point numbers. Multiple receipt events may belong to one chain transaction.

The custom-domain collector is read-only: write requests return 405. Hosted authenticated submissions and receipt ingestion are separate capabilities, not public write endpoints on this deployment. Do not send wallet keys or RPC secrets to the read API.
