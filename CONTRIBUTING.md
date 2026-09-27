# Contributing

## Fork and run

1. Fork the repository using GitHub's **Fork** button.
2. Clone your fork, create a descriptive branch, and follow the README local setup.
3. Make a focused change. Keep private data, `.env`, `.local`, database backups and credentials out of commits.
4. Run `node design/build.mjs` for frontend changes and `node --test tests/*.test.mjs` for relevant backend changes.
5. Open a pull request against the upstream repository. Explain the problem, implementation, verification and any limitations. Include screenshots for visual changes and public transaction hashes for attribution changes.

Maintainers review before merging. A PR does not grant production access or automatically deploy the site.

## Listings

Use the listing issue forms for a project, AI agent or facilitator. To propose metadata in a PR, add `listings/proposals/<slug>.json` using the example in that directory. This is a review artifact, not an automatic import format. Do not edit generated catalog snapshots to manufacture a listing or volume.

## Data changes

Record the source URL, UTC period, network, token contract/mint, decimals and attribution method. Keep provider-reported aggregates separate from verified receipt rows. Never turn an unavailable observation into zero or a seller address into a facilitator without evidence. Preserve token amounts as integer strings. Include tests for duplicate events, wrong chains, failed receipts and mismatched transfers where applicable.

## Review expectations

Use public evidence and respectful discussion. Maintainers may request ownership proof or additional settlement samples. Do not publish private keys, access tokens, private contacts or signed payment authorizations. Licensing must be resolved before contributions are accepted under a project-wide license; do not assume one from repository visibility.
