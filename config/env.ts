const dotenv = require("dotenv-safe");

export const loadEnvs = () => {
  dotenv.config({
    example: ".env.dist",
  });
};
