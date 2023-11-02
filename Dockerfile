FROM node:19

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./

RUN yarn install

COPY . .

RUN yarn build

CMD [ "yarn", "start:dev" ]