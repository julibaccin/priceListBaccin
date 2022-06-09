FROM node:18.1.0-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

RUN mkdir /home/node/app/dist/upload/

EXPOSE 4000

CMD [ "node", "./dist/index.js" ]