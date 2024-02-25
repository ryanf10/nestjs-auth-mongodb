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
- 📃 Pagination — Built-in pagination builder
- 📡 Socket.io — Websocket with authentication and realtime notifications
- ☁️ Chat — Implement a robust real-time chat feature using Socket.io, allowing seamless communication between users.
- 🔍 Cache — Redis
- 📄 Api Documentation — Swagger
- ⛵ Docker — Alpine, Redis, MongoDB
- 📕 Logger — Winston
- 🔚 End to End Testing — Perform end to end testing with different environment

## Installation

```bash
yarn install
```

## Installation

```bash
yarn husky install
chmod ug+x .husky/*
```

## Running the app

### development

```bash
yarn run start
```

### watch mode

```bash
yarn run start:dev
```

### production mode

```bash
yarn run start:prod
```

## Running the app with Docker

### Local Development

```
docker build --no-cache -f Dockerfile.local .
docker-compose -f docker-compose.local.yml up --build -d
```

### Production

```
docker-compose build --no-cache
docker-compose up --build -d
```

### Accessing container shell

```
docker exec -it myapp sh
```

```
docker exec -it redis sh
redis-cli
```

```
docker exec -it mongodb sh
mongosh
```

## Seed role to MongoDB

```bash
yarn nestjs-command seed:role
```

## File Storage

- Local (Set Storage to 'local' in .env)

```
STORAGE=local
S3_ENDPOINT_URL=https://sgp1.digitaloceanspaces.com/
S3_DOWNLOAD_URL=https://<your-bucket>.sgp1.digitaloceanspaces.com/
S3_BUCKET=<your-bucket>
S3_ACCESS_KEY_ID=<your-access-key>
S3_SECRET_KEY=<your-secret-key>
```

- S3 (Set Storage to 's3' in .env)

```
STORAGE=s3
```

## API Documentation

http://localhost:3000/swagger

## Simple Live Chat with WebSocket Demo

http://localhost:3000

## Test

### unit tests

```bash
yarn run test
```

### e2e tests

```bash
yarn run test:e2e
```

### test coverage

```bash
yarn run test:cov
```

## Frontend Support

You can use this [Project](https://github.com/ryanf10/ts-nextjs-tailwind-hoc-starter) as your frontend. It created with Next.js, Tailwind CSS, and Typescript.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
