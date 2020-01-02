# ===== BUILD ======
FROM node:lts AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN tsc --build

# ===== RUNTIME ======
FROM node:lts AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build "/app/dist/" "/app/"
COPY --from=build "/app/package*.json" "/app/"

RUN npm ci --production

CMD [ "node", "index" ]