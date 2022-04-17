FROM node:14

EXPOSE 3001

RUN npm install i npm@latest -g

WORKDIR /src

COPY package.json package-lock*.json ./

RUN npm install

COPY . .

CMD ["node", "app/index.js"]