FROM node:18-alpine

# 1. Habilita Corepack para usar la versión de Yarn especificada en package.json
RUN corepack enable

WORKDIR /app
COPY package.json yarn.lock ./

# 2. Instala dependencias usando la versión correcta de Yarn
RUN yarn install

COPY . .
EXPOSE 3000
CMD ["yarn", "dev"]