FROM node:alpine

WORKDIR /app
COPY . .
RUN npm install

WORKDIR /app/mediaManager
RUN npm run build

WORKDIR /app
CMD ["node", "index.js"]