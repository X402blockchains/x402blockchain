<p align="center"><img src="public/brand/x402-mark.svg" width="72" alt="X402blockchains logo"></p>
<h1 align="center">X402blockchains</h1>
<p align="center">Explore payment activity, projects and facilitators across Base, Solana and BNB Chain.</p>
<p align="center"><a href="https://x402blockchains.com">Website</a> · <a href="docs/LISTING-GUIDE.md">Request a listing</a> · <a href="CONTRIBUTING.md">Contribute</a> · <a href="LOCAL-BACKEND.md">API & local setup</a></p>

## Project status

The current development version is a React frontend with a Node.js local API, SQLite database and background collectors. The repository also contains an earlier hosted Worker implementation. Local changes are not automatically deployed to the public website.

Base, Solana and BNB collection is implemented with **partial historical coverage**. XRP is planned. Public aggregate statistics and individually collected transaction records are separate datasets. Matching a transfer on-chain does not by itself prove an HTTP x402 exchange. Source evidence and collection status are available through the Coverage page and API.

## Features

- Mixed-chain transaction browsing, per-chain filters, wallet links and pagination.
- Project/API and facilitator directories, logos and detail pages.
- Transactions and volume charts with separate network scales.
- Provider aggregate feeds refreshed independently from receipt indexing.
- Project, AI agent and facilitator applications with manual review.
- Exact token amounts, deduplication, evidence records and resumable collection.

X Pay can appear as both a seller and facilitator. These roles are attributed separately. The mixed homepage features X Pay-attributed settlements; individual chain tabs use latest-first ordering.

## Run locally

Use Node.js 24+ and pnpm. From the repository root:

```sh
pnpm install
pnpm --dir design install
node scripts/start-local.mjs
```

Open http://127.0.0.1:4174/#home. This command builds the React app and starts the local server and collector. Keep it running for automatic updates. Stop with Ctrl+C. SQLite data lives in `.local/development.sqlite`; never commit it. Public RPC limits can slow or stop historical collection. The collector records errors instead of inventing missing data.

```sh
node design/build.mjs
node --test tests/*.test.mjs
```

## List your project or facilitator

Open a **Project / AI agent listing** or **Facilitator listing** issue in this repository, or use the website application form when the corresponding deployment supports it. The current local form stores applications on the operator's computer only.

Provide public metadata, a logo, documentation, chain identifiers and payment evidence. A facilitator must also provide supported versions/schemes and public settlement addresses. Never post secrets or private contact information in an issue. GitHub issues and pull requests are manually reviewed; they do not automatically publish a listing or start indexing.

See the [listing guide](docs/LISTING-GUIDE.md) for the complete process and [contribution guide](CONTRIBUTING.md) for forking and pull requests.

## Documentation

| Guide | Contents |
|---|---|
| [Documentation index](docs/README.md) | Navigation and current implementation status |
| [Listing guide](docs/LISTING-GUIDE.md) | Eligibility, fields, review and corrections |
| [Local backend](LOCAL-BACKEND.md) | Endpoints, filters, applications and operation |
| [Architecture](docs/ARCHITECTURE.md) | Frontend, API, persistence and collectors |
| [Data methodology](docs/DATA-METHODOLOGY.md) | Attribution, units, source coverage and limitations |
| [Source audit](docs/SOURCE-AUDIT.md) | Research and verification findings |
| [Contributing](CONTRIBUTING.md) | Fork, run, test and submit changes |
| [Security](SECURITY.md) | Sensitive reports and secret handling |
| [Release checklist](docs/PUBLIC-RELEASE.md) | Public repository and deployment preparation |

## Licensing

See existing license files, if present, and dependency licenses. No new open-source license is granted by this README. Public visibility and GitHub's fork feature are not a substitute for a license granting redistribution rights. Maintainers must choose a license before advertising unrestricted reuse.
