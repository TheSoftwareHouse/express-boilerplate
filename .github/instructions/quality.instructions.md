---
applyTo: "**"
---

- Run `npm run lint` to check for linting errors after making changes.
- Run `npm run format` to format the code according to the project's style guide.
- Run `npm run integration` to execute integration tests after making changes.
- Run `npm run units` to execute unit tests after making changes.
- Always ensure that your code passes all tests before finishing.
- Always ensure that code is well-documented, especially public methods and classes.
- Always ensure that your code is formated according to the project's style guide.
- Application supports `/health` endpoint for health checks, which returns 200 OK status if the application is running correctly.
- All errors are handled by `src/middleware/error-handler.ts`, which returns a structured JSON response with an error message and code.
- In case of changing errors, always update the error handler to handle new error types.
