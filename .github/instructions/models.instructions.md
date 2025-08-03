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
