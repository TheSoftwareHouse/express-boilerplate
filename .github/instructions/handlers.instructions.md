---
applyTo: "**/*.handler.ts"
---

- All handlers must have a `.handler.ts` suffix.
- Always use single parameter in constructor for dependencies. For example:
```typescript
import { UserService } from "../services/user.service";

interface UserHandlerDependencies {
  userService: UserService;
}

export class UserHandler {
  constructor(private dependencies: UserHandlerDependencies) {}

  async handle(request: Request, response: Response): Promise<void> {
    const user = await this.dependencies.userService.getUserById(request.params.id);
    response.json(user);
  }
}
```
- Never use Command Bus or Query Bus directly in handlers. Instead, dispatch events using the provider `@tshio/event-dispatcher`
- Always inject repositories and not data sources directly into handlers:
```typescript
import { UserEntity } from "../models/user.entity";
import { Repository } from "typeorm";

interface UserHandlerDependencies {
  userRepository: Repository<UserEntity>;
}

export class UserHandler {
  constructor(private dependencies: UserHandlerDependencies) {}

  async handle(request: Request, response: Response): Promise<void> {
    const user = await this.dependencies.userRepository.findOneBy({ id: request.params.id });
    response.json(user);
  }
}
```
- Never create tests for handlers.
- Don't use `@CacheQuery` decorator in any handlers unless explicitly stated otherwise.
- Erorrs should be thrown as exceptions, not returned as responses. They will be handled by the global error handler.
- There are built-in error classes in `src/shared/errors` that you can use to throw errors with appropriate HTTP status codes and messages.
- Use HttpError classes from `src/shared/errors` for throwing HTTP errors.
- The AppError shouldn't be used in handlers, as it is a generic error class for internal errors.
- The NotFoundError should be used for 404 errors.
- The Validation Errors are handled by `celebrate` in `src/middleware/error-handler.ts`, so you don't need to handle them in handlers.
- In case you need to handle specific errors, you can create custom error classes in `src/shared/errors` and throw them in handlers, but remember for them to extend the `AppError` class.
- Add logging for important events and errors using injected logger in handlers and actions.