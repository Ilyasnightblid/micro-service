# catalog-service

**Catalog & inventory**: garments, stock per boutique, temporary reservations.

## Responsibility
- Browse items (public), manage catalog (admin).
- Reserve stock synchronously for order-service (`POST /stock/reservations`, internal, timeout 2 s).
- Commit reservation on `OrderPaid`, release it on `OrderCancelled`; unpaid reservations expire after 15 min (safety net, order times out at 10 min).

## Data (target)
Schema `catalog`: items, stock, reservations.

## Events (target)
Consumes `OrderPaid`, `OrderCancelled`. Publishes nothing.

## Current status — iteration 1 (skeleton)
| Endpoint | Purpose |
|---|---|
| `GET /health/live`, `GET /health/ready` | health |
| `GET /api/v1/catalog/items` | placeholder `{ "items": [] }`, header `X-Instance` |

## Run
```bash
npm install && npm run dev
docker compose up -d --build catalog-service
```
