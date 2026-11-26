# Contributing to X402blockchains

Use this repository for public project metadata, documentation corrections, branding updates and the static showcase example. The production platform implementation is not part of this public repository.

For a listing, use the [registry](https://github.com/X402blockchains/x402-registry) or a listing issue form. Include public ownership and payment/delivery evidence and link any earlier application. Keep credentials, private contact details and signed payment authorizations out of GitHub.

For a correction, include the affected public page, expected result and reproducible evidence. Open a focused pull request for documentation or showcase changes. Maintainers review changes manually; a merged proposal does not automatically publish a website listing.

Do not invent transaction counts, activity, endorsements or approval status. Preserve third-party notices and licensing restrictions.

## Improve prepared listing records

Use the [publication queue](listings/prepared/2026-11-27/PUBLICATION_QUEUE.md) to find a concrete task: confirm an official logo, correct a documented URL, clarify a factual description or supply a reproducible unpaid route check. Link first-party evidence in the pull request. Work with other contributors and credit their actual contributions accurately.

Update both the individual project JSON file and its matching entry in the preparation manifest. Keep basic directory approval separate from broader route, network, security or facilitator verification. Preserve operator-test labels and publication checks. A metadata correction must not mark a project as published.

Before submitting, run these dependency-free checks with Python 3:

```sh
python3 scripts/check_listing_metadata.py
python3 -m unittest discover -s tests -v
```

The GitHub check runs on relevant pull requests and changes to main. It checks links and payment-evidence fields structurally, duplicate projects, batch membership and consistency between the manifest and individual files. Maintainers still review current service operation, branding and publication separately.

