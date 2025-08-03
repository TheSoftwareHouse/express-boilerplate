# Coding Guidelines for Node.js/TypeScript Boilerplate

## Project Overview

This repository is a boilerplate for building Node.js applications using TypeScript, following best practices and architectural patterns. It is designed to be a starting point for new projects, providing a solid foundation with modern development tools and methodologies.

## Code Architecture

### Key Patterns
- **CQRS (Command Query Responsibility Segregation)**: Separates read and write operations for better scalability and maintainability.
- **Dependency Injection**: Uses Awilix for managing dependencies, promoting loose coupling and easier testing.
- **Event-driven architecture**: Utilizes an event dispatcher for handling domain events, enabling asynchronous processing and decoupling of components.
- **Feature-based structure**: Organizes code into features, each encapsulating related functionality, making it easier to navigate and maintain.
- **REST API**: Exposes a RESTful API for client interactions, following standard HTTP methods and status codes.

### Project Structure
```src/
├── app/
│   ├── features/          # Feature-based organization
│   │   ├── [feature-name]/ # Each feature has its own directory
│   │   │   ├── actions/          # REST endpoint handlers
│   │   │   ├── commands/         # State-changing DTOs
│   │   │   ├── queries/          # Data-retrieval DTOs
│   │   │   ├── handlers/         # Command/query business logic
│   │   │   ├── query-handlers/   # Query business logic
│   │   │   ├── events/           # Domain events
│   │   │   ├── subscribers/      # Event listeners
│   │   │   ├── graphql/          # GraphQL resolvers
│   │   │   ├── models/           # TypeORM entities
│   │   │   └── routing.ts        # Route definitions
│   ├── infrastructure/    # Infrastructure code (e.g., repositories implementations)
│   ├── config/            # Configuration files
│   ├── container/         # Dependency injection container setup
│   ├── errors/            # Custom error classes
│   ├── shared/            # Shared utilities and helpers
│   ├── tests/             # Integration tests files
│   │   └── bootstrap.ts   # Test bootstrap file
│   ├── migrations/      # TypeORM migrations
│   ├── router.ts        # Registering all feature routes
│   └── app.ts           # Express app setup and initialization, application routing setup
├── index.ts           # Application entry point
└── container.ts       # Dependency injection container setup
```

### Key Libraries and Functionalities
- **TypeScript**: For static typing and modern JavaScript features.
- **Express**: Web framework for building REST APIs.
- **TypeORM**: ORM for database interactions.
- **Awilix**: Dependency injection container.
- **@tshio/command-bus**: Command bus for handling commands.
- **@tshio/query-bus**: Query bus for handling queries.
- **@tshio/event-dispatcher**: Event dispatcher for handling domain events.
- `src/shared/pagination-utils`: Utility functions for request parameters to TypeORM options conversion and list endpoint responses.
- **UUID v4**: For unique identifiers in database entities.
- **Docker**: For containerization and consistent development environment.
- **Jest**: For unit and integration testing.
- **Celebrate**: For input validation in REST endpoints.

### Key Development Guidelines

#### Important commands
- **Linting**: Use `npm run lint` to check code style.
- **Fixing Lint Issues**: Use `npm run lint-fix` to automatically fix lint issues.
- **Formatting**: Use `npm run format` to format code according to the project's style guide.
- **Running Tests**: Use `npm run integration` for integration tests and `npm run units` for unit tests.
- **Generating Migrations**: Use `npm run generate-migration` to create new migrations. Do not run migrations manually, they are auto-executed at application start.
- **Running migrations**: Use `npm run migrations` to run all pending migrations.

#### General Guidelines
- Always use TypeScript for type safety and modern JavaScript features.
- Follow the project's coding conventions and architecture patterns.
- Use dependency injection for managing dependencies, avoiding direct instantiation of classes.
- All environment variables has to be extracted and validated using `dotenv` and `joi` packages. Store them in config files like `.env` or `.env.test` and process them in your application startup in `src/config/app.ts`.
- Never use `npm run plop` to generate code, use the provided boilerplate structure and manually create files as needed.
- Never run any commands with `docker-compose` command, use npm scripts instead (e.g., `npm run lint`, `npm run lint-fix`, `npm run forma`).

#### Naming Guidelines
- Always think in terms of features, not technical layers.
- Features names should be descriptive and reflect the bounded context (e.g., `planning`, `ordering`, `management`). Avoid naming features by connected entities (e.g., `user`, `product`).
- Use **kebab-case** for directories, filenames and imports (e.g., `user.controller.ts`).
- Use **camelCase** for variables and function names (e.g., `getUserById`).
- Use **PascalCase** for class names and interfaces (e.g., `UserService`).
- use **snake_case** for database columns and TypeORM entity properties (e.g., `first_name`, `last_name`) but use **camelCase** for variable names in TypeScript code.
- Use suffixes like `.handler.ts`, `.command.ts`, `.query.ts`, `.event.ts`, `.subscriber.ts`, `.resolver.ts` for files in features (e.g, `create-user.command.ts`, `user.query.ts`).
- Use suffixes like `Service`, `Repository`, `Controller` for class names (e.g., `UserService`, `UserRepository`, `UserController`).

#### Database Guidelines
- Use **TypeORM** for database interactions.
- Use **UUID v4** for unique identifiers, avoid auto-increment IDs.
- Use repositories for data access in handlers, not direct TypeORM queries.
- Always generate migrations using the provided npm script (`npm run generate-migration`), do not create them manually.
- Never add parameters to the `npm run generate-migration` command, as it will fail.
- All migrations are auto-executed at application start, do not run them manually.
- Migrations are stored in `src/migrations/`.

#### Testing Guidelines
- Every endpoint must have a corresponding integration test.
- Every utility function must have a corresponding unit test.

#### Security Guidelines
- Never expose sensitive information in error messages or responses.
- Use HTTPS for secure communication, especially in production environments.
