# Listing proposals

Add a JSON file named after your project. Include public information only. Maintainers review proposals manually; these files are not automatically ingested.

```json
{
  "name": "Your project",
  "role": "Project / API",
  "website": "https://your-domain.example",
  "logo": "https://your-domain.example/logo.png",
  "description": "Describe the service and its payment use case.",
  "docs": "https://your-domain.example/docs",
  "endpoint": "https://your-domain.example/api",
  "networks": ["Base"],
  "paymentAddresses": [],
  "settlementExamples": [],
  "supportedVersions": [],
  "supportedSchemes": []
}
```

Use Base, BSC or Solana network identifiers. Facilitators must populate supported versions/schemes, published signer/router addresses and settlement evidence. Never include private contacts or keys.
