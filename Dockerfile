FROM node:18

WORKDIR /app

ADD . .

RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]