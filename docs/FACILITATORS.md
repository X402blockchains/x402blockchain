# Add a facilitator

A facilitator verifies and/or settles payments for resource servers. Publishing a paid API alone does not establish that role.

## Required information

1. Name, official website and logo URL.
2. Facilitator base URL and documentation for supported, verify and settle operations.
3. Networks, payment schemes, protocol versions and supported assets.
4. Public settlement signer addresses, with historical/deprecated addresses marked separately.
5. Example successful settlement transaction hashes and the first known activity date.
6. Public source references and any authentication requirements; never include credentials.

Use the **Facilitator listing** issue template or open a pull request. The contributor workflow is available to accounts with repository access while the repository remains private.

## Implementation checklist

- Add reviewed source metadata to `server/sources.mjs`, or update the attributed registry in `server/facilitator-registry.mjs` when importing upstream metadata.
- Use the correct chain identifiers and preserve the upstream reference.
- Add official logo candidates to `public/logos.json` for the profile's website/docs origin.
- Verify the capability response and match public signer evidence against chain data.
- Ensure the adapter actually supports the payment path. Metadata alone does not add a new chain adapter or backfill old blocks.
- Run relevant tests and `pnpm build`; document the validation performed.

Existing Base and Solana adapters derive known signer sets from source metadata. Restart the deployed collector after changing this configuration. Existing cursors will not automatically rewind to collect older activity for a newly added signer; historical ingestion needs a deliberate, deduplicated backfill.

## What verification means

A reachable capabilities endpoint confirms advertised support at the check time. A matched transaction provides settlement evidence. Neither is a security audit or proof that every transfer is an x402 payment. A pending upstream pull request must be described as pending, not as upstream approval.

Featured placement is editorial and is not a transaction-volume ranking. Only indexed evidence contributes to live totals.
