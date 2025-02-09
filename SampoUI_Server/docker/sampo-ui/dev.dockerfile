FROM node:16.13.0-alpine

RUN apk update && apk add bash

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./sampo-ui/package*.json ./
COPY ./sampo-ui/webpack*.js ./

# Babel 7 presets and plugins
COPY ./sampo-ui/babel.config.js ./

# Bundle app source
COPY ./sampo-ui/src ./src

# Run the scripts defined in package.json using build arguments
RUN npm install

# Install nodemon
RUN npm install -g nodemon 

EXPOSE 8080 3001

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
USER node

# Run dev server
CMD ["npm", "run", "dev"]
