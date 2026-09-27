# Listing AI agents, projects and facilitators

The working local application is at http://127.0.0.1:4174/#apply. The full interactive documentation is at http://127.0.0.1:4174/#docs. Submissions currently stay on this computer.

## Listing types

- **AI agent:** describe capabilities, input/output schemas, examples, pricing, underlying paid endpoint and any A2A/MCP interface.
- **Project / API:** describe the service, paid resource URLs and HTTP methods, public documentation and supported payment networks.
- **Facilitator:** publish supported x402 versions/schemes, mainnet chain IDs, token contracts, signer/relayer/router addresses and successful settlement hashes.
- **Project and facilitator:** supply both sets of evidence. Project sales and facilitator settlements are measured separately.

## Required fields

Name, description (20+ characters), HTTPS website, working HTTPS logo URL, public endpoint, documentation, private contact email, listing type and at least one supported network (Base, BSC or Solana). XRP is deferred. Do not submit private keys, seed phrases, signed payment authorizations or API secrets.

The API rejects incomplete submissions. A supplied logo URL is not yet proof the image is available; the reviewer checks it before publication. The site hides missing-logo listings. No local listing fee is charged.

## Submission and review

1. Submit the website form, or call POST `/api/live/applications` from the same local origin.
2. Save the returned ID and secret receipt token. Only its hash is stored. Contact details are not returned in public listings.
3. Status is checked with GET `/api/live/applications?id=ID` and `Authorization: Bearer TOKEN`.
4. Operator reviews ownership, payment requirements, logos, endpoint documentation, supported mainnets and successful settlement evidence. Domain-hosted proof or a purpose-specific wallet signature can be requested manually. Automatic ownership verification is not implemented.
5. Operator records `approved`, `needs_information` or `rejected` with a review note using `scripts/review-local-listing.mjs`.
6. Approved listings appear in discovery. New facilitator indexing still requires a tested adapter or supported receipt pipeline. Approval never creates transaction volume or an audit badge.

## GitHub route

A listing issue template is prepared at `.github/ISSUE_TEMPLATE/listing.yml`. It becomes available only after the repository changes are published. Public issues may include public metadata and evidence; private contacts should use the website form. Issues and pull requests are reviewed manually and are not automatically imported or approved.

## Metadata updates and corrections

Submit a new application referencing the original listing URL and explain the change. Include public evidence, affected wallets and transaction hashes where applicable. A changed logo, recipient wallet or facilitator signer must be reviewed before attribution changes. Reports of inaccurate data should include chain, exact UTC time range and transaction hashes—not only rounded totals.

## API and operation

See `LOCAL-BACKEND.md` for routes, query filters, exact token units, local startup, review command and coverage limitations. See `SOURCE-AUDIT.md` for comparison findings and source provenance.

## Fork and pull-request listing route

Fork the public repository, create a branch, and add a public metadata proposal under `listings/proposals/`. Follow its README example. Open a pull request and link your listing issue. A maintainer checks the evidence, requests corrections and manually registers approved metadata. No GitHub automation currently imports applications. Facilitator ingestion is activated only after its address mapping or adapter is validated. There is no guaranteed review deadline or automatic verified badge.

Separate GitHub forms cover Project / AI agent listing, Facilitator listing and Data correction. For security vulnerabilities use the private reporting process in SECURITY.md, not these forms.
