FROM node:14-alpine AS develop

WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:14-alpine As production

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=develop /app/dist ./dist

CMD [ "npm", "run", "start:prod" ]