# delivery-service

**Delivery & logistics**: automatic courier assignment and delivery tracking.

## Responsibility
- On `OrderReady`, assign one free courier atomically (`UPDATE couriers … WHERE status = 'FREE'` + `UNIQUE(order_id)`): no double assignment.
- No free courier → retry every 30 s (max 10), then alert admin.
- Courier actions on their own deliveries: start, problem, end.
- On `OrderCancelled`, cancel the assignment and free the courier; remember cancelled orders so a late `OrderReady` is ignored.

## Data (target)
Schema `delivery`: couriers, assignments, cancelled orders.

## Events (target)
Consumes `OrderReady`, `OrderCancelled`. Publishes `CourierAssigned`, `DeliveryStarted`, `DeliveryCompleted`, `DeliveryFailed`.

## Current status — iteration 1 (skeleton)
| Endpoint | Purpose |
|---|---|
| `GET /health/live`, `GET /health/ready` | health |
| `GET /api/v1/deliveries` | placeholder `{ "items": [] }`, header `X-Instance` |

## Run
```bash
npm install && npm run dev
docker compose up -d --build delivery-service
```
