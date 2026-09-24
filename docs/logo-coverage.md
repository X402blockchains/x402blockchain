# Project logo coverage

Run `python3 scripts/discover-logos.py` from the project root to check live directory origins and bundled provider references. The job looks for site-declared icons, validates HTTPS image responses, and checks the main website for conventional api. subdomains. It pins resolved public IP addresses during checks and excludes private networks.

Outputs: public/logos.json and public/logo-coverage.json. These are public metadata only. Sites that do not expose reachable images retain a readable initials fallback; a fallback is not presented as an official logo. Logos may still be blocked by a provider in individual browsers.

Run `python3 scripts/search-pages.py public` afterwards to refresh logos on the static directory pages. Deploy the generated directory and logo manifest alongside frontend changes.
