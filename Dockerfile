FROM node:10.16.2-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./yarn.lock package.json /usr/src/app/

RUN yarn install

COPY ./ /usr/src/app

# Build the Angular dashboard - Client
RUN yarn ng build --prod

# Babel JavaScript Transcompile - Server
RUN yarn server:build

ENV NODE_ENV production

ENV PORT 3000

EXPOSE 3000
EXPOSE 80
EXPOSE 443

CMD ["node", "dist/server/app.js"]