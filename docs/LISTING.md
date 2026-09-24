# List a project

1. Sign in to the hosted explorer and open **List your project**.
2. Supply a project name, HTTPS website, description, supported networks and requested contact details. Describe actual x402 support, including the facilitator and payment scheme where relevant.
3. Submit for review. Track the submission in your account; submission does not automatically publish or verify a project.
4. An administrator reviews the information and approves or rejects it. Approved listings receive a shareable project page. Contact email is not exposed in the public directory.

The current site is owner-private. Outside applicants can use this flow only after the owner enables suitable audience access. A discovered catalog entry is separate from a reviewed project listing. Catalog records are grouped by URL origin; one origin does not necessarily equal one company.

## Include payments

Listing a project does not automatically import its transactions. Operators can agree a signed receipt feed with the administrator. Use the example client in `examples/send-receipts.mjs`, with a source-specific HMAC secret held only on your server. The administrator must configure that source before ingestion. Never send wallet private keys. Source reports remain labeled as reports; chain observations have separate evidence labels.

## Add a facilitator

Submit documented mainnet support, public capability/discovery URLs and published settlement addresses for review. Registry entries live in `server/sources.mjs` and `server/facilitator-registry.mjs`; include source links and timestamps when proposing changes. Declared network support and successfully checked support are displayed separately.
