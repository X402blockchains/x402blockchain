# X402blockchains React design preview

Local-only visual prototype based on the supplied multi-page reference. No deployment changes or production API calls.

## Preview

From the repository root:

```sh
node design/build.mjs
node scripts/design-preview.mjs
```

Open http://127.0.0.1:4174/ . The existing backend preview on port 4173 is separate.

## Pages

Home, transaction explorer, facilitator directory and profile, servers/projects and project profiles, networks and chain details, analytics, four-step listing application, documentation and API overview.

## Working interactions

Search and chain filters, facilitator sorting, additional transaction filters, pagination, payment-detail dialogs, chart period controls, profile tabs, responsive navigation, validated application steps, local logo preview and draft download. Motion respects prefers-reduced-motion.

## Design data

All displayed transactions, figures, statuses, verification badges, provider roles and relationships are illustrative. Sample transaction IDs deliberately use preview-* and never link to fabricated onchain receipts. The header labels this consistently. Listing drafts are held in React memory until explicitly downloaded; nothing is submitted to a server. Chain icons are vector drawings and project marks are design placeholders, not verified official brand assets.

## Next stage

After visual approval, connect the reusable React components to verified API data, replace placeholder project marks with vetted assets, and implement production ownership verification and submission review. No live wallet connection is included in this visual prototype.
