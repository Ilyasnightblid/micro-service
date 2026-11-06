# order-service

**Authority for the order lifecycle** and saga orchestrator.

## Responsibility
- Create orders, accept/reject (staff), mark ready, cancel (customer), expose order status.
- Owns the order state machine and its invariants; drives compensations through events.
- Not responsible for: stock (catalog), money (payment), couriers (delivery).

## State machine (target)
`PENDING_PAYMENT → PAID → ACCEPTED → READY_FOR_PICKUP → ASSIGNED → IN_DELIVERY → DELIVERED`,
plus `REJECTED`, `CANCELLED`, `DELIVERY_FAILED`. Customer cancellation allowed up to `READY_FOR_PICKUP`, then `409`.
Transitions use optimistic locking (`WHERE state = ? AND version = ?`).

## Data (target)
Schema `orders`: orders, order lines, state history, outbox, processed events, staff ↔ boutique mapping.

## Events (target)
Publishes `OrderCreated`, `OrderPaid`, `OrderReady`, `OrderCancelled{reason}`.
Consumes `Payment*`, `CourierAssigned`, `Delivery*`.

## Current status — iteration 1 (skeleton)
| Endpoint | Purpose |
|---|---|
| `GET /health/live` | process is up |
| `GET /health/ready` | ready to serve (DB/broker checks added later) |
| `GET /api/v1/orders` | placeholder `{ "items": [] }`, header `X-Instance` |

Runs with 2 replicas in the target deployment.

## Run
```bash
npm install && npm run dev        # local, port 3000
docker compose up -d --build order-service
```
