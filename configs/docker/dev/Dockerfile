FROM nginx:alpine

# Adding Node.JS 
RUN apk add --update nodejs yarn


ENV NODE_ENV development
ENV PORT 3000

EXPOSE 3000 80 443

CMD nginx; yarn start:docker