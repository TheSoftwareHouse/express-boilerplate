---
applyTo: "**/tests/*.spec.ts"
---

- All tests must have a `.spec.ts` suffix.
- Unit tests should be placed next to the file they test
- Integration tests must be placed in `src/tests` directory
- Tests for each feature must be placed in a separate file, named after the feature (e.g., `users.spec.ts`, `warehouses.spec.ts`).
- Tests for each feature must be placed in a separate directory, named after the feature (e.g., `src/tests/users`, `src/tests/warehouses`).
- Use following pattern for integration tests:
```typescript
import { expect } from "chai";
import "mocha";
import request from "supertest";

describe("/api/{{kebabCase name}} integration", () => {
  it("test example", async () => {
    return request(await global.container.cradle.app)
      .get("/health")
      .expect(200)
  });
});
```
- Test bootstrap is in `src/tests/bootstrap.ts`, which sets up the container, database connection, and clears the database before each test.
- Use `clearDb()` function in `src/tests/bootstrap.ts` to clear the database before each test.
- Every repository must be added to `clearDb()` function and cleared with `.delete({})` to avoid TypeORM issues.
- Use `global.container` and `global.dbConnection` in tests for accessing the container and database connection.
- The tests use separate `.env.test` file for environment variables. All environment variables has to be added there too.