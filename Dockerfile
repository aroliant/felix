FROM node:10.15.0-alpine as builder

RUN mkdir -p /app/
COPY ./yarn.lock package.json ./app/

WORKDIR /app

RUN yarn install

COPY ./ /app

# Client
RUN yarn ng build --prod

# Server
RUN yarn server:build


FROM nginx:alpine

# Adding Node.JS 
RUN apk add --update nodejs yarn

RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app/dist/
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/

RUN yarn install --production=true

COPY --from=builder  /app/dist /usr/src/app/dist/

COPY ./configs/nginx.conf /etc/nginx/nginx.conf

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000 80 443

CMD nginx; node dist/server/app.js