import { name, version, description } from "../../package.json";

const jsdoc = require("swagger-jsdoc");

export default jsdoc({
  swaggerDefinition: {
    info: {
      title: name,
      version,
      description,
    },
  },
  apis: ["src/**/actions/*.ts"],
});
