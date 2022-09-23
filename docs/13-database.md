## Database

We are using **TypeORM** as our base ORM library.

### Custom repositories

Custom repositories should be created to separate some database specific logic (so you can reuse this logic in many code places).
It is good practice to create them even if at the beginning of the project there is no such need.

To create custom repository you should create repository file (like `example.respository.ts`) in app directory `/src/app/features/{your feature}`:

```
export class ExampleRepository extends Repository<ExampleEntity> {}
```

Then you must register it in `/src/container/database.ts`:
```
container.register({
    exampleRepository: asValue(new ExampleRepository(ExampleEntity, dbDataSource.createEntityManager())),
});
```

That's all. Now you can use repositories in you code (through DI)!

```
await this.dependencies.exampleRepository.find();
```

From DDD perspective it is good practice to name repository as `ExampleRepository` and class as concrete implementation - `PostgreExampleRepository`.