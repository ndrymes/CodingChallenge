
# Vending Machine

The task is to Build a REST API for a vending machine.

## Development

Prerequisite

-   Installed Docker

### Start development environment

-   Create `.env` file or run `cp .env.example .env`

You can look for the example in the `.env.example` 

Next up you can choose to run your development environment entirely inside Docker or to run the app server directly on your local machine.

**Running app server inside Docker**

-   Start the development cluster

```bash
docker-compose up -d
```

-   View consolidated logs via Docker Compose

```bash
docker-compose logs -f
```
-   Shutdown development cluster

```bash
docker-compose down
```

**Running app server directly on your local machine's environment**

-   Start the db service in Docker

```bash
docker-compose up -d mongodb
```

- Run `npm i` or `npm install` to install all app dependencies
- Start the app at the root directory using

-   Start your app server

```bash
npm run start:dev

For Production Purpose
- Run `npm run build` 
  - `npm run start` 

-   Shutdown development cluster

```bash
docker-compose down
```

## Testing

Prerequisite

-   Installed Docker
-   Node LTS

**Run the test**

```bash
# Start the test postgres container
docker-compose -f docker-compose.test.yml up -d

# Run the test
npm run test
```

## API

There are multiple endpoints that can be used to create an order. Please find below a POSTMAN documentation for easy guide <a href="https://documenter.getpostman.com/view/7667873/2s93XtzjgW">https://documenter.getpostman.com/view/7667873/2s93XtzjgW</a>.

# Todo

I had a lot of fun building this but there are some improvements I can still make:

- Add an application Monitoring tool like sentry
- Add cache system like Redis to matain session
- Add more test cases
- Have a standard response helper
- Include a makefile to ease the execution of some common tasks
