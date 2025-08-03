---
applyTo: "**/features/**/routing.ts"
---

- Register routing in `src/app/router.ts` 
- When registering routing in `src/app/router.ts`, always register it with specific path, for example:
```typescript
router.use("/example", usersRouting);
```
- For list endpoints, use `GET` method and `/` format for path
- For single item endpoints, use `GET` method and `/:id` format for path
- For creating items, use `POST` method and `/` format for path
- For updating items, use `PUT` method and `/:id` format for path
- For deleting items, use `DELETE` method and `/:id` format for path
- A good example of routing:
```typescript
export const exampleRouting = (actions: ExampleRoutingDependencies) => {
  const router = express.Router();

  router.post(
    "/",
    [createExampleActionValidation],
    actions.createExampleAction.invoke.bind(actions.createExampleAction),
  );
  router.get(
    "/",
    [examplesActionValidation],
    actions.examplesAction.invoke.bind(actions.examplesAction),
  );
  router.get(
    "/:id",
    [exampleActionValidation],
    actions.exampleAction.invoke.bind(actions.exampleAction),
  );
  router.delete(
    "/:id",
    [deleteExampleActionValidation],
    actions.deleteExampleAction.invoke.bind(actions.deleteExampleAction),
  );
  // ACTIONS_SETUP

  return router;
};
```
