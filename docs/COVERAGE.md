# Coverage and methodology

Our index is incomplete and must not be described as a global x402 database.

| Data | Current scope |
| --- | --- |
| Services/projects | Public provider catalogs, grouped by endpoint and URL origin |
| Facilitators | Attributed registry metadata and capability checks |
| Base | Finalized USDC authorization transfers from documented facilitator senders |
| Solana | Finalized facilitator-signed original SPL Token transfers |
| BSC | Finalized events from the documented x402-exec router |
| XRP | Validated Payments with the published T54 SourceTag, using delivered amounts |
| Buyers/sellers | Addresses in retained settled records, not unique people |
| USD volume | Unavailable without verified valuation |

Base and Solana facilitator association is inferred. XRP tags can be set by others. These signals do not prove delivery of an HTTP resource or ownership of a project. Catalog names are reported metadata; shared recipient addresses can be ambiguous.

The independent collector runs scheduled batches on our hosting, and the Site reads its payment APIs through COLLECTOR_API_URL. Base has separate live and 24-hour historical cursors. Neither full historical coverage nor all BSC payment paths are complete. Public Solana RPC rate limits affect throughput. See OPERATIONS.md.

See [Self-hosting](SELF_HOSTING.md) for exact filters, unsupported transaction paths, starting cursors and operating instructions. Individual transaction lookup does not automatically classify ordinary transfers as x402 payments.
