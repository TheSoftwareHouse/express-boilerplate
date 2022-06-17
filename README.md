<p align="center">
 <img src="data/logo.svg" alt="" />
</p>

<p align="center">
   Current travis build:
  <a href="https://travis-ci.com/TheSoftwareHouse/express-boilerplate"><img src="https://travis-ci.com/TheSoftwareHouse/express-boilerplate.svg?branch=master" alt="build status" height="18"></a>
  &emsp;
</p>

##

A highly scalable and a focus on performance and best practices boilerplate code for Nodejs and TypeScript based web applications.

Start a new application in seconds!

##

### Features

- Quick scaffolding

  Create actions, routes, and models - right from the CLI using Plop micro-generator framework.

- TypeScript

  The best way to write modern applications. Code is easier to understand. It is now way more difficult to write invalid code as was the case in dynamically typed languages

- Dependency injection

  DI is a central part of any nontrivial application today and is the core of this project.

- Static code analysis

  Focus on writing code, not formatting! Code formatter and linter keeps the code clean which makes work and communication with other developers more effective!

**Note**
If you have discovered a bug or have a feature suggestion, feel free to create an issue on [Github](https://github.com/TheSoftwareHouse/express-boilerplate/issues).

Don't forget to star or fork this if you liked it.

##

### Configuration

After checkout of a repository, please perform the following steps in exact sequence:

1. Copy docker-compose.override
    ```
    $ cp docker-compose.override.yml.dist docker-compose.override.yml
    ```

2. Create `.env` file from `.env.dist`
    ```
    $ cp .env.dist .env
    ```

    Remember to fill up required values in `.env`

3. Run `npm i`

4. Run `npm run docker-build`

5. Run watch - `npm run watch`

##

### Dev setup

This app is fully dockerized, so in order to use it you have to have docker and docker-compose installed. What's more you need to have npm in order to run npm scripts.

1. In order to run the whole app type:

    ```
    npm run start
    ```

2. In order to watch files for dev purpose type:

    ```
    npm run watch
    ```

3. If you need to close all containers run:

    ```
    npm run down
    ```

4. To get into Docker container's shell:

    ```
    npm run shell
    ```

##

### Code generation

We're using Plop for routes, models, actions, graphql (queries and mutations), commands and handlers generation.

```
npm run plop
```

##

### Code style

We're using Prettier and ESLint to keep code clean. In order to reformat/check code run:

```
npm run lint
npm run format
```

##

### Database migrations

Migrations should be stored inside migrations directory.

Easiest way to create a migration is to generate it from entity/ies:

```
npm run generate-migration
```

This should generate a migration for all connected entities.

##

#### Adminer setup

Adminer is configured in `docker-compose.override.yml` and should work out of the box on port 8080. To login to adminer use the following values:
```
Database type: postgres
Server: postgres
User: postgres
Password: password
Database: app
```

Of course, if any of this is changed via configuration or otherwise, then these changes must be reflected here as well.

##

### GraphQL
Boilerplate has GraphQL support. Apollo server runs as a middleware and should be available locally under:
```
http://localhost:1337/graphql
```

To add new query/mutation run relevant `plop` commands and then:

1. Modify `schema.gql` under `graphql/schema.gql`
2. Run codegen: `npm run generate-schema`
3. Restart watcher / API

##

### Debugging

#### VS Code

There is `launch.json` configuration inside `editors/vsc` directory. Just copy it and create new debugger to make it work with vsc :) 

##

### Tests

There are two types of tests:

- integration: `npm run integration`
- units: `npm run units`

##

### **Issues:**

If you notice any issues while using, let as know on **[github](https://github.com/TheSoftwareHouse/express-boilerplate/issues)**.
Security issues, please sent on <a href="mailto:security.opensource@tsh.io"><b>email</b></a>

### **You may also like our other projects:**

- **[RAD Modules](https://github.com/TheSoftwareHouse/rad-modules)**
- **[RAD Modules Tools](https://github.com/TheSoftwareHouse/rad-modules-tools)**
- **[Serverless Boilerplate](https://github.com/TheSoftwareHouse/serverless-boilerplate)**
- **[Kakunin](https://github.com/TheSoftwareHouse/Kakunin)**
- **[Babelsheet-js](https://github.com/TheSoftwareHouse/babelsheet-js)**
- **[Fogger](https://github.com/TheSoftwareHouse/fogger)**

### **About us:**

<p align="center">
  <a href="https://tsh.io/pl"><b>The Software House</b></a>
  &emsp;
  <img src="data/tsh.png" alt="tsh.png" width="50" />
</p>

### License

[![license](https://img.shields.io/badge/license-MIT-4dc71f.svg)](https://raw.githubusercontent.com/TheSoftwareHouse/express-boilerplate/main/LICENSE)

This project is licensed under the terms of the [MIT license](/LICENSE).
