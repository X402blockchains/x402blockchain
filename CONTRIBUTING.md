# Contributing to x402blockchain

Thank you for helping improve project discovery and payment transparency.

## Choose a contribution

- [Add a project or service](docs/DISCOVERY.md).
- [Add a facilitator or update its addresses](docs/FACILITATORS.md).
- Report a reproducible bug, missing logo or missing indexed transaction using the issue templates.
- Improve documentation, adapters or tests through a pull request.

Repository access is required while the repository is private. Do not assume a public website means its source repository is publicly accessible.

## Development

Use Node 24+ and the pnpm version pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

Describe the problem, the resulting behavior and the validation in your pull request. Keep changes focused. New chain adapters need meaningful identity, failure-handling, duplicate and cursor-safety tests. Schema changes require a new migration rather than editing an applied migration.

## Data and branding

Preserve source attribution and coverage limits. Do not label generic transfers as verified x402 payments, manufacture activity, or include demo data in live totals. Supply the official source for logos and provider metadata; preserve third-party notices.

Do not commit secrets, local databases, wallet keys or customer contact information. Report sensitive vulnerabilities using [SECURITY.md](SECURITY.md).

## Deployment

GitHub pushes do not automatically publish the website. The current custom-domain deployment uses a Node/SQLite collector and static frontend on external hosting. Sites deployment is an optional separate runtime. Follow [operations](docs/OPERATIONS.md) for validation and release checks.
