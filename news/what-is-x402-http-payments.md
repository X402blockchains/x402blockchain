# What is x402? A practical guide to HTTP payments

Published: 2026-10-18

Learn how x402 connects HTTP 402 payment requests with wallet-authorized payments for APIs, apps and software agents.

![Abstract HTTP payment gateway](https://x402blockchains.com/articles/assets/article-1.png)

## A payment conversation inside an HTTP request
An API normally decides whether a request is allowed before it returns useful data. x402 adds a standard way to explain that a resource requires payment. A client can receive an HTTP 402 response, inspect the payment requirements and decide whether to pay. The goal is to make paid access understandable to software, rather than requiring a person to buy a subscription before every integration.

## How the request moves forward
The client selects a supported payment option and prepares the required payment payload. The resource server checks that payload, either directly or with a compatible facilitator. Verification and settlement follow the chosen payment scheme. The server can then return the requested resource and payment information. Implementations must agree on protocol version, scheme, network and asset; a familiar token name alone is not enough.

## What builders still need to provide
Payment transport does not replace a useful product. Builders must define prices, validate inputs, handle retries and explain what happens if payment succeeds but delivery fails. Buyers should check the intended recipient, amount and network before authorizing a payment. A successful transaction is evidence of settlement, not proof that a response was useful.

## Where x402 fits
Per-request data, metered tools and agent-accessible services are natural places to evaluate this model. Start with a narrow paid endpoint, a supported test environment and an explicit spending limit. Move to production only after testing settlement, delivery and reconciliation together. X402blockchains helps readers explore projects and compare the activity coverage reported for different networks.

Read on X402blockchains: https://x402blockchains.com/articles/?article=what-is-x402-http-payments

Further reading: https://github.com/x402-foundation/x402
