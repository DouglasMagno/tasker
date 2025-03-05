FROM node:22

WORKDIR /app

COPY package.json tsconfig.json jest.config.js ./
COPY src ./src
RUN npm install

EXPOSE 5000

CMD ["npm", "run", "dev"]
