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