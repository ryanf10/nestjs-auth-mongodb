# Use Node.js 18 base image on Alpine Linux
FROM node:18-alpine

RUN apk update
RUN apk add python3 make g++
RUN rm -rf /var/cache/apk/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# BUild
RUN yarn build

# Start the application in development mode
CMD [ "yarn", "start:prod" ]

