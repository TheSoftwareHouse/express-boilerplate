import { name, version, description } from "../../package.json";

const jsdoc = require("swagger-jsdoc");

export default jsdoc({
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: name,
      version,
      description,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          in: "header",
          name: "X-Auth-Token",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/app/read-models/**/*.js", "src/**/actions/*.js", "src/shared/**/*.js"],
});
