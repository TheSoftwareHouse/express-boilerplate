import { ISwaggerExpressOptions } from "swagger-express-ts";
import { name, version, description } from "../../package.json";

const swaggerExpressOptions: ISwaggerExpressOptions = {
  definition: {
    info: {
      title: name,
      version,
      description,
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        in: "header",
        name: "X-Auth-Token",
      },
    },
  },
};

export default swaggerExpressOptions;
