# News and article studio

Open `http://127.0.0.1:4174/#news`. Choose Write an article, fill title, introduction and body, then save as Draft or Published locally. Choose an existing article to edit or return it to draft. Body text is rendered as plain text; HTML is not executed. Articles persist in SQLite, not the source repository. Back up the database privately.

The editor is enabled only by the loopback development server and requires same-origin POSTs. Do not expose it through a tunnel or enable LOCAL_EDITOR in public hosting. Production authoring needs authenticated administrator access before deployment.

Public feeds: DEV Community articles tagged x402 and coinbase/x402 GitHub releases. Headlines link to originals; articles are not scraped in full. Each feed is cached for an hour; failures retain its previous snapshot. Feeds are community/protocol updates, not verified reporting or endorsements.

Optional X recent search uses `X_BEARER_TOKEN` and `X_NEWS_ENABLED=true` in the collector environment. It is disabled by default. Set up your developer account and spending limits before enabling; requests may incur X API charges. It fetches up to ten posts per successful hourly refresh, querying `x402 -is:retweet`. It does not post to X. Never put the token in the browser, repository or chat. Failure retries follow collector cycles; do not enable without an account-level spend cap. X content lifecycle/compliance and authenticated publishing must be reviewed before a public launch.

Public routes: GET /api/live/news. Local authoring: GET/POST /api/live/editor. Article fields: id (omit for new), title, summary, body, status (draft/published).

## Third-party X provider

TwitterAPI.io advanced search is supported as an alternative: https://docs.twitterapi.io/api-reference/endpoint/tweet_advanced_search
Set `TWITTERAPI_IO_KEY` and `TWITTERAPI_IO_ENABLED=true` only after configuring an account and approving its spend. Keep the official X connector disabled when using this provider to avoid duplicate billing. One request maximum per provider per hour, including failed attempts; no automatic pagination. Returns at most one page of recent x402 matches, not all X activity. Credentials remain server-side. No paid call has been made during setup. Review provider pricing and usage rights before activation: https://twitterapi.io/pricing
