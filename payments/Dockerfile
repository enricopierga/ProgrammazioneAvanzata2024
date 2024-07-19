FROM node:20

WORKDIR /src/app

COPY package*.json ./

RUN npm install --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]
