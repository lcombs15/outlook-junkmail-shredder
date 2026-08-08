FROM node:24-alpine AS development-dependencies-env
WORKDIR /code
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci

FROM node:24-alpine AS production-dependencies-env
WORKDIR /code
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci --omit=dev

FROM node:24-alpine AS build-env
WORKDIR /code
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web ./apps/web
COPY --from=development-dependencies-env /code/node_modules ./node_modules
WORKDIR /code/apps/web
RUN npm run build

FROM node:24-alpine
WORKDIR /code
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web ./apps/web
COPY --from=production-dependencies-env /code/node_modules ./node_modules
COPY --from=build-env /code/apps/web/build /code/apps/web/build
WORKDIR /code/apps/web
CMD ["npm", "run", "start"]
