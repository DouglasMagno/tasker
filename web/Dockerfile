FROM node:22

WORKDIR /app

COPY package.json tsconfig.json jest.config.js ./
COPY public ./public
COPY src ./src

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
