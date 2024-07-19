FROM node:20

WORKDIR /src/app

COPY package*.json ./

RUN npm install --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/app.js"]
