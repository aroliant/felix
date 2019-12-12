FROM nginx:alpine

# Adding Node.JS 
RUN apk add --update nodejs yarn

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./yarn.lock package.json /usr/src/app/

RUN yarn install

COPY ./ /usr/src/app

# Build the Angular dashboard - Client
RUN yarn ng build --prod

# Babel JavaScript Transcompile - Server
RUN yarn server:build

COPY ./configs/nginx.conf /etc/nginx/nginx.conf

ENV NODE_ENV production

ENV PORT 3000

EXPOSE 3000
EXPOSE 80
EXPOSE 443

CMD nginx; node dist/server/app.js