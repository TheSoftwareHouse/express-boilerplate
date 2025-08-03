---
applyTo: "**/actions/*.action.ts"
---

- Every action must have a corresponding integration test
- Always use `@tshio/command-bus` for command handlers and `@tshio/query-bus` for query handlers.
- GET methods should be used for queries, and POST, PUT, DELETE methods for commands.
- When naming actions files always use names descriptive of the action being performed, for example:
  - `create-user.action.ts` for creating a user
  - `delete-user.action.ts` for deleting a user
  - `get-users.action.ts` for retrieving users
- Use appropriate HTTP status codes for different actions (e.g., 200 for success, 201 for created, 204 for no content).
- For errors use appropriate HTTP status codes (e.g., 400 for bad request, 404 for not found, 500 for internal server error).
- Validation errors are handled by `celebrate` in `src/middleware/error-handler.ts` don't change that
- Add logging for important events and errors using injected logger in handlers and actions.

- Use `GET` method for list endpoints.
- Use `src/shared/pagination-utils.ts` for creating TypeORM options for list endpoints.
- Always return a JSON response with `meta` and `data` fields.
- The `meta` field should contain pagination, filter, sort, and search information.
- Example request for list endpoint with pagination, sorting, filtering, and search - `GET /users?page=1&limit=10&sort[firstName]=ASC&filter[lastName]=Nowak&search=test`
- Example response for a list endpoint:
```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "total": 0,
      "limit": 10,
      "totalPages": 0
    },
    "filter": {
      "firstName": ["Ewa", "Adam"],
      "lastName": "Nowak"
    },
    "sort": {
      "firstName": "ASC"
    },
    "search": "test"
  },
  "data": [{ ... }]
}
```
- Use `filter[field]=value` for filtering by field with specific value.
  - Filters on the same field are interpreted as OR: `filter[field1]=value1&filter[field1]=value2`
  - Filters on different fields are interpreted as AND: `filter[field1]=value1&filter[field2]=value2`
  - Using `%` at the end of value will be interpreted as LIKE query: `filter[field]=value%`
- Use `sort[field]=ASC|DESC` for sorting by field in specified order.
- Use `search=term` for general text search.
- Use `page=1&limit=10` for pagination. 
- Use `GET` method for single item endpoints.
- Use singular nouns for single item endpoint paths (e.g., `/users/123e4567-e89b-12d3-a456-426614174000`).
- Always return a JSON response with the item data.
- Example request for single item endpoint - `GET /users/123e4567-e89b-12d3-a456-426614174000`
- Example response for a single item endpoint:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "Ewa",
  "lastName": "Nowak",
  "email": "ewa.nowak@example.com"
}
```
