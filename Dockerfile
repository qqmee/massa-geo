## Build
FROM docker.io/library/node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build && npm prune --production

## Production
FROM gcr.io/distroless/nodejs20-debian11:nonroot

ENV NODE_ENV="production"
WORKDIR /app

COPY --from=build --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/dist

CMD ["dist/main.js"]
