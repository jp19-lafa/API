# ===== BUILD ======
FROM node:current AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm i -g typescript

COPY . ./

RUN tsc --build

# ===== RUNTIME ======
FROM node:current AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build "/app/dist/" "/app/"
COPY --from=build "/app/package*.json" "/app/"

RUN npm install --production

CMD [ "node", "index" ]