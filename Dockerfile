# Shared image for every Node.js service: docker build --build-arg SERVICE=order-service .
ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS build
ARG SERVICE
WORKDIR /app
COPY services/${SERVICE}/package.json services/${SERVICE}/package-lock.json ./
RUN npm ci
COPY services/${SERVICE}/tsconfig.json ./
COPY services/${SERVICE}/src ./src
RUN npm run build && npm prune --omit=dev

FROM ${NODE_IMAGE}
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
