FROM node:10.15.0-alpine

# Adding Node.JS 
RUN apk add --update nginx


ENV NODE_ENV development
ENV PORT 3000

EXPOSE 3000 80 443

CMD nginx; yarn server:dev; npx ng serve