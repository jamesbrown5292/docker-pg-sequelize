FROM node:14

EXPOSE 3001

WORKDIR /src

COPY package.json package-lock*.json ./

RUN npm install

COPY . .

CMD ["node", "app/index.js"]