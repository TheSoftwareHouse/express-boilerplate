## GraphQL

#### GraphQL headers
In order to use headers in GraphQl query, once you created GraphQL handler, you can use context param:

for example 
```
export const meQuery = async (parent: any, args: any, context: QueryContext) => {
  const token = ((context as any).req as Request).get("authorization")?.split(" ").at(1); // express Request

  const { result } = await context.queryBus.execute(new MeQuery({ token }));
  return result;
};
```

REMEMBER: req param must be added in ApolloServer context setup