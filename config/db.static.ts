const dotenv = require("dotenv-safe");
const dbConfig = require("./db");

dotenv.config({
  example: ".env.dist",
});

const config = dbConfig(process.env);

module.exports = config;
