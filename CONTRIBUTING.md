# Contributing

Use Node 24+ and the pnpm version pinned in package.json. Run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm build`. Run `pnpm dev` for the local preview.

Keep source attribution, coverage limits and empty states accurate. New chain adapters need tests for identity, failure handling and cursor safety. Include documented protocol evidence; do not classify generic transfers as x402 payments. Preserve third-party notices.

Do not commit credentials, local databases or customer contact details. Schema changes need a new migration, never a rewrite of an applied migration. Deployment is through Sites; a GitHub push alone does not deploy this application.
