FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/party-server .
RUN npm install --production
# RUN npm install reflect-metadata tslib rxjs hbs
CMD node ./main.js