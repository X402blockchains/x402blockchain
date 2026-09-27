# Architecture

`design/src` contains the React UI. `design/build.mjs` builds assets into `public/design`. `scripts/start-local.mjs` builds and starts the preview and collector. `scripts/design-preview.mjs` serves the local app. `server/portal.mjs` exposes the `/api/live/` routes. `scripts/local-db.mjs` applies the versioned SQL migrations and opens SQLite.

The local collector schedules independent catalog, aggregate and chain-indexing jobs. Jobs record success/error status in `collector_runs`. Chain adapters maintain checkpoints; external snapshots retain their source and time. Public provider requests and RPC calls can fail or be rate-limited. A successful aggregate refresh does not imply a completed receipt backfill.

The website polls its local API. It does not execute payments or require a wallet seed. Applications store a hashed status token; public directory responses exclude applicant contact details. Manual review is distinct from ownership verification and security auditing.

The earlier Worker/D1 implementation and `dist` outputs are separate from the local React runtime. Production needs a deliberate deployment plan, persistent storage, scheduled/continuous collection, backups, authentication, rate limits and monitoring. Do not upload a local database to a public repository.
