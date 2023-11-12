<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. This repository consists of:

- 🔼 NestJS 10
- ✨ TypeScript
- 📏 ESLint — Find and fix problems in your code
- 💖 Prettier — Format your code consistently
- 🐶 Husky — Run scripts before they are committed
- 🔑 RBAC — Authentication and Role Authorization starter kit
- :satellite: Socket.io — Websocket with authentication, simple live chat demo, and realtime notifications
- :mag: Cache — Redis
- :notebook: Api Documentation — Swagger

## Installation

```bash
$ yarn install
```

## Installation

```bash
$ yarn husky install
$ chmod ug+x .husky/*
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Seed role to MongoDB

```bash
yarn nestjs-command seed:role
```

## API Documentation

http://localhost:3000/swagger

## Simple Live Chat with WebSocket Demo

http://localhost:3000

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Frontend Support

You can use this [Project](https://github.com/ryanf10/ts-nextjs-tailwind-hoc-starter) as your frontend. It created with Next.js, Tailwind CSS, and Typescript.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
