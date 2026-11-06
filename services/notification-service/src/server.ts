import Fastify from 'fastify';
import { hostname } from 'node:os';

const SERVICE = 'notification-service';
const PORT = Number(process.env.PORT ?? 3000);

const app = Fastify({
  logger: { base: { service: SERVICE, instance: hostname() } },
  requestIdHeader: 'x-request-id', // set by Kong's correlation-id plugin
  requestIdLogLabel: 'correlationId',
});

// Liveness: the process answers. Readiness: dependencies OK (DB/broker checks added later).
app.get('/health/live', { logLevel: 'silent' }, async () => ({ status: 'up' }));
app.get('/health/ready', { logLevel: 'silent' }, async () => ({ status: 'ready' }));

const shutdown = async () => {
  await app.close();
  process.exit(0);
};
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);

await app.listen({ host: '0.0.0.0', port: PORT });
