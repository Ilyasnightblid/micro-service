# payment-service

**Payments (simulated provider)**: charge and refund, both idempotent (key = `orderId`).

## Responsibility
- Charge automatically on `OrderCreated`; bounded retries (3 attempts, 1 s / 2 s backoff, 5 s timeout) then `PaymentFailed`.
- Refund on `OrderCancelled` if charged; if the cancellation arrives first, record it and never charge (order-independent handling).
- Embedded provider simulator with configurable failure rate / outage for the failure experiment.

## Data (target)
Schema `payment`: transactions, refunds, idempotency keys.

## Events (target)
Consumes `OrderCreated`, `OrderCancelled`. Publishes `PaymentSucceeded`, `PaymentFailed`, `PaymentRefunded`.

## Current status — iteration 1 (skeleton)
| Endpoint | Purpose |
|---|---|
| `GET /health/live`, `GET /health/ready` | health |
| `GET /api/v1/payments` | placeholder `{ "items": [] }`, header `X-Instance` |

## Run
```bash
npm install && npm run dev
docker compose up -d --build payment-service
```
