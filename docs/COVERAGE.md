# Data coverage

| Data | Implemented scope | Limit |
| --- | --- | --- |
| Services and projects | Public catalog snapshot plus paginated refresh | Provider-reported metadata, not every project globally |
| Facilitators | 44 attributed profiles and capability checks | Registry metadata does not grant private payment feeds |
| Base payments | Finalized USDC Transfer events in transactions submitted by documented facilitators, including router calls | Inferred x402 association; bounded live/history scans; resource may be unknown |
| BSC payments | Finalized Settled events at the documented x402-exec router | Only this router and the displayed scanned range |
| Solana and XRP payments | Facilitator-signed Solana SPL transfers and T54-tagged validated XRP payments | Partial account/ledger history; attribution is inferred |
| Buyers and sellers | Addresses in retained settled receipts | Not unique people; not entire wallet history |
| USD volume | Unavailable | No invented conversion or stablecoin parity assumption |

The custom domain runs a persistent read API and a minute-based collector on cPanel. Public RPC limits and historical backfill throughput can leave the collector behind the chain tip. Dedicated RPC access, scheduling, larger validated ingestion budgets, backfills and additional protocol adapters are needed before claiming comprehensive coverage. Source errors and checkpoints must remain visible.

Successful direct transaction lookup does not prove an x402 payment and never adds ordinary transfers to receipt totals. Read-only indexing never executes payments.

Project icons: 469 website-declared icon sets were discovered across 1,338 checked catalog/provider origins. Other pages try favicon.ico and retain initials when unavailable. This is not complete logo coverage.
