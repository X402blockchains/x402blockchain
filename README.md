<p align="center"><img src="branding/logo.png" width="96" alt="x402blockchain logo"></p>
<h1 align="center">x402blockchain</h1>
<p align="center">Multichain payment discovery and independent x402 data APIs.</p>
<p align="center"><a href="https://x402blockchains.com">Website</a> · <a href="docs/SELF_HOSTING.md">Self-hosting & API</a> · <a href="docs/LISTING.md">List a project</a> · <a href="docs/COVERAGE.md">Data coverage</a></p>

## About

x402blockchain explores payment activity, projects, services and facilitators across **Base, Solana, BSC and XRP Ledger**. The frontend uses a white-and-blue dashboard with chain filters, buyer/seller views, transaction details and source attribution. Our read-only chain collectors write to our database; the application does not purchase or proxy x402scan transaction data.

**Status: active development.** Indexing is scoped and historical coverage is incomplete. The hosted preview runs batches on visits; an always-on collector requires separate hosting. Do not interpret an empty view as no chain activity. The website domain above is the project address; this repository does not configure its DNS.

## Features

- Transactions with buyer, seller, chain, token amount, timestamp and evidence labels.
- Buyer/seller directories and indexed address activity.
- Public-catalog project and service discovery; reviewed community submissions.
- Facilitator profiles, declared capabilities and connectivity status.
- Independent chain readers with durable progress and duplicate prevention.
- Versioned JSON APIs, OpenAPI reference and source health dashboard.
- Administrator review and signed receipt ingestion on the hosted platform.

## Chain coverage

| Network | Implemented reader | Scope |
| --- | --- | --- |
| Base | Finalized USDC authorization transfers submitted by documented facilitators | Inferred protocol association; other assets and payment paths excluded |
| Solana | Finalized SPL Token transfers signed by documented facilitator accounts | Account-scoped historical/recent scans; original Token program only |
| BSC | Published x402-exec router settlement events | Only this router and the scanned block range |
| XRP | Validated successful Payments with the published T54 SourceTag | Tag-based association; actual delivered amounts; not proof of facilitator identity |

USD valuation is unavailable. Catalog metadata is provider-reported. Addresses are not unique people, and an origin is not necessarily a company. See [coverage](docs/COVERAGE.md) and [reader details](docs/SELF_HOSTING.md).

## Quick start

Requires Node.js 24+ and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

Development runs at `http://127.0.0.1:4173`. Its local database lives in `.local/development.sqlite`. The local preview strips hosted identity headers; it does not impersonate an administrator.

## Run your own collector and API

```sh
cp .env.example .env
# Configure mainnet RPC providers and optional initial backfill positions.
node --env-file=.env scripts/collector.mjs
```

The collector serves the frontend and read-only API at `http://127.0.0.1:4174`, with persistent SQLite storage and a collection loop. It performs no wallet transactions and needs no private keys. Use a process supervisor, persistent storage, backups and an HTTPS reverse proxy on your server. Dedicated/archive RPC capacity is needed for sustained backfill.

The hosted D1 database and self-hosted SQLite database are **separate**. Running the collector locally does not populate the hosted website automatically. Full setup: [SELF_HOSTING.md](docs/SELF_HOSTING.md).

## API examples

```text
GET /api/openapi.json
GET /api/v1/overview?network=Base&days=1
GET /api/v1/transactions?network=All&days=0&page=1&limit=100
GET /api/v1/analytics?network=Solana&days=7
GET /api/v1/participants?role=buyers&network=BSC&days=30
GET /api/v1/ecosystem
GET /api/v1/services
GET /api/v1/facilitators
GET /api/v1/indexers
```

`days=0` returns all retained history, not complete chain history. Hosted access follows the site's audience. Self-hosted collector endpoints are read-only. [OpenAPI source](server/openapi.mjs).

## List your project

Use **List your project** on the website, submit your HTTPS project and endpoint information, supported chains and payment terms, then follow the review status. Approved submissions appear in the reviewed directory. Discovery listings and reviewed submissions are distinct. External submissions require the hosted site to allow external users. [Full listing instructions](docs/LISTING.md).

## Repository structure

```text
public/       Dashboard and frontend
server/       APIs, source adapters and chain indexers
scripts/      Build, local server, catalog refresh and collector
db/          Database schema
drizzle/     Versioned migrations
tests/       Validation, access, indexing and API tests
docs/        Listing, API, hosting and coverage guides
examples/    Signed receipt client
branding/    SVG and PNG logo assets
```

## Configuration and security

Start from `.env.example`. Keep RPC credentials, administrator settings and receipt secrets server-side. Never commit `.env`, local databases, wallet keys or customer contact details. The hosted API relies on trusted Sites identity headers; do not expose it through an ingress that permits header spoofing. See [SECURITY.md](SECURITY.md).

## Validation and roadmap

The current source passed 31 automated tests. A bounded live collection check read all four chains and stored Base/Solana records; that is not a completed historical backfill. Remaining work includes always-on production hosting, archive backfills, throughput/lag monitoring, broader payment adapters and validated valuation.

Contributions should preserve evidence labels and accurate coverage statements. See [CONTRIBUTING.md](CONTRIBUTING.md). Third-party registry metadata retains its attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). No new license grant for project-owned code is implied.

## Sites deployment

The portable hosting manifest contains only the logical database binding. Register a new Site and set its project identity before publishing through Sites. No existing deployment credentials or project identity are included.
