# Add a project

## Prepare public metadata

Provide the project name, HTTPS website, short description, official logo URL, supported networks, endpoint URLs and HTTP methods. Include the payment asset, amount, recipient and facilitator documentation. An unsigned endpoint request should return its documented HTTP 402 payment requirements where applicable.

Provide an OpenAPI document or public discovery catalog when available. A logo should be a reachable HTTPS image owned or authorized by the project. Never submit private credentials, signed payment payloads or customer information.

## Request a listing

Open the **Project listing** issue template or submit a pull request if you have repository access. While this repository is private, GitHub contributions require access. The production read-only collector does not currently accept public form submissions; the hosted authenticated review flow is documented separately in [LISTING.md](LISTING.md).

Maintainers check the source, network identifiers, public metadata and payment requirements. Discovery listings are grouped by exact origin; subdomains can appear separately. A listing is not an endorsement, security audit or ownership verification.

## Contributor files

- `server/sources.mjs`: upstream discovery providers.
- `server/direct-resources.mjs`: directly checked merchant resources with provenance.
- `public/logos.json`: official logo candidates keyed by website origin.
- `scripts/discover-logos.py`: refresh and validate reachable logo candidates.
- `scripts/search-pages.py`: generate crawlable project pages.

Retain the evidence URL and check date. Do not invent transaction counts or mark a merchant as a facilitator without separate evidence. Test relevant directory behavior before opening a pull request.
