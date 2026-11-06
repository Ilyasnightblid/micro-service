# notification-service

**Notifications (simulated)**: consumes business events and logs the email/SMS that would be sent.

## Responsibility
- Stateless, no database, no public API (not routed by Kong).
- Duplicate events are filtered with a bounded in-memory set of `eventId`; a duplicate after a restart may produce a second log line (accepted, documented).

## Events (target)
Consumes all business events. Publishes nothing.

## Current status — iteration 1 (skeleton)
`GET /health/live`, `GET /health/ready` only.

## Run
```bash
npm install && npm run dev
docker compose up -d --build notification-service
```
