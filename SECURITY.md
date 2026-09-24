# Security

Report vulnerabilities privately to the repository owner through GitHub's private vulnerability reporting when enabled, or an established private owner contact. Do not put secrets or exploitable customer data in public issues.

The production API trusts identity headers supplied by Sites. Do not deploy behind an ingress that allows clients to forge those headers. The local preview strips platform identity headers. Keep administrator settings, dedicated RPC credentials and receipt HMAC secrets server-side. Rotate a compromised source key and review its imported receipts.

This explorer does not hold wallet keys or execute payments. Catalog listings and facilitator associations are not security endorsements.
