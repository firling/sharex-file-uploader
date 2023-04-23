FROM node:alpine

WORKDIR /app 
COPY . . 
RUN yarn 

WORKDIR /app/mediaManager
RUN yarn build

WORKDIR /app
CMD ["node", "index.js"]