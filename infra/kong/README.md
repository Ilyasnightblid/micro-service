# Kong — API gateway (single entry point)

Kong OSS **3.9.x**, DB-less: the whole configuration is [`kong.yml`](kong.yml), versioned and mounted read-only.

## Responsibilities
| Concern | How |
|---|---|
| Routing | Path prefix → service (`strip_path: false`, services own the full `/api/v1/...` path) |
| Load balancing | One `upstream` per service; the target hostname resolves to every replica (Docker DNS), round-robin. `KONG_DNS_VALID_TTL=5` so new replicas join within seconds |
| Health / removal from traffic | Active check `GET /health/ready` every 5 s; 2 failures → replica removed, 1 success → back |
| Timeouts / retries | connect 2 s, read/write 5 s, `retries: 1` (POST are not safe to replay without `Idempotency-Key`) |
| Correlation | `correlation-id` plugin: `X-Request-ID` generated if absent, forwarded to services, echoed to the client |

Planned: TLS termination (mkcert), rate limiting, CORS, Prometheus plugin, Zitadel routing.
**Not** done here: JWT validation — the JWKS-capable OIDC plugin is Enterprise-only, so services validate tokens.

## Routes
| Path prefix | Upstream |
|---|---|
| `/api/v1/orders` | order-service |
| `/api/v1/catalog` | catalog-service |
| `/api/v1/payments` | payment-service |
| `/api/v1/deliveries` | delivery-service |

## Ports
- `8000` proxy (published) · `8001` Admin API (bound to `127.0.0.1` only).

## Useful commands
```bash
curl -s localhost:8001/upstreams/order-upstream/health | jq   # replica health as seen by Kong
docker compose logs -f kong                                   # access log (one line per request)
```

## Version note
3.9.x is the last open-source line (end of sunset support 2026-12-12). Accepted for this project; see ADR in the SAD.
