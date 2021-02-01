## Command and Query Bus

At TSH we separat state changing operations (Commands) and data retriving operation (Queries).

This means that in terms of REST API all **POST, PUT, PATCH, DELETE** requests are **Commands** and every **GET, HEAD** is **Query**.

At th same, if we are thinking about GraphQL, then all **Mutations** are **Commands** and all **Queries** and **Query**.

Command or Query **does not perform any operation itself it is just a simple DTO**.

Example command:

```
import { Command } from "@tshio/command-bus";

export const LOGIN_COMMAND_TYPE = "users/LOGIN";

export interface LoginCommandPayload {
  authToken: string;
}

export class LoginCommand implements Command<LoginCommandPayload> {
  public type: string = LOGIN_COMMAND_TYPE;

  constructor(public payload: LoginCommandPayload) {}
}
```

Example query:

```
import { Query } from "@tshio/query-bus";

export const USERS_QUERY_TYPE = "users/USERS";

export interface UsersQueryPayload {}

export class UsersQuery implements Query<UsersQueryPayload> {
  public type: string = USERS_QUERY_TYPE;

  constructor(public payload: UsersQueryPayload) {}
}
```

In order to handle a single command/query we need to create a handler, that will be able perform some operation when a specific command is passed to it.

Example command handler: 

```
import { CommandHandler } from "@tshio/command-bus";
import { LOGIN_COMMAND_TYPE, LoginCommand } from "../commands/login.command";
import { EventDispatcher } from "@tshio/event-dispatcher";

export interface LoginHandlerDependencies {
  eventDispatcher: EventDispatcher;
}

export default class LoginCommandHandler implements CommandHandler<LoginCommand> {
  public commandType: string = LOGIN_COMMAND_TYPE;

  private eventDispatcher: EventDispatcher;

  constructor({ eventDispatcher }: LoginHandlerDependencies) {
    this.eventDispatcher = eventDispatcher;
  }

  async execute(command: LoginCommand) {
    await this.eventDispatcher.dispatch({
      name: "UserLoggedIn",
      payload: command,
    });

    return {
      ...command,
    };
  }
}
```

Example query handler

```
import { QueryHandler } from "@tshio/query-bus";
import { CacheQuery } from "../../../../shared/cache-decorator";
import { USERS_QUERY_TYPE, UsersQuery, UsersQueryResult } from "../queries/users";

export default class UsersQueryHandler implements QueryHandler<UsersQuery, UsersQueryResult> {
  public queryType: string = USERS_QUERY_TYPE;

  @CacheQuery({ duration: 10 })
  async execute(_query: UsersQuery): Promise<UsersQueryResult> {
    const fakeUsers = [{ firstName: "John", lastName: "Doe" }];
    return new UsersQueryResult(fakeUsers);
  }
}
```


In order to execute a single command we use a special abstraction called - **command bus**. 

At the same, for queries we have **query bus**.

Both of them works the same way - contains a dictionary of command/query:command/query-handler pair. So each command/query can be handled by a single handler.
