## Code style

### Naming convention

Files and directories names should follow **kebab-case** convention.

```
example-directory  // ok
exampleDirectory  // bad
exampledirectory // bad

some-file.ts // ok
someFile.ts // bad
SomeFile.ts // bad
```

Unit tests files should end with **.spec.ts** postfix.

```
some-file.spec.ts // ok
some-file-tests.ts // bad
```

### Architecture

- split functionalities into **features**
- a single **feature** is a set of functionalities bound by a single context, for example all endpoints related to users management or everything related to invoicing.
- we follow CQS approach with addittion of **command bus** and **query-bus** read more about it in **2-command-and-query-bus.md**.

### Tools

Use plop to autogenerate API (endpoints, validations), GraphQL (mutations, queries) and architecture (Command, Queries, Features) related code.