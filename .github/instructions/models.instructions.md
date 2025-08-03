---
applyTo: "**/+(*.entity.ts|*.repository.ts)"
---

- All entities must have a `.entity.ts` suffix.
- Always register repository for each entity in `src/container/database.ts`.
- When registering a repository, use this approach:
```typescript
userRepository: asValue(dbDataSource.getRepository(UserEntity)),
```
- Use **UUID v4** for unique identifiers, avoid auto-increment IDs.
- Use `@PrimaryColumn()` for UUID columns, not `@PrimaryGeneratedColumn()`.
- Always generate migrations using the provided npm script (`npm run generate-migration`), do not create them manually.
- Never add parameters to the `npm run generate-migration` command, as it will fail.
- Never create tests for entities.
- Always validate and sanitize user input to prevent SQL injection and other attacks.
- Every model should have a factory method for creating instances from raw data, e.g.:
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Entity({
  name: "user",
})
export class UserEntity {
  public static create(data: Partial<UserProps>): UserEntity {
    const object = new UserEntity();
    Object.assign(object, data);
    return object;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;
}
```
- Use factory methods for creating instances from raw data.
- For CRUD method you can use models props interface in commands as a type