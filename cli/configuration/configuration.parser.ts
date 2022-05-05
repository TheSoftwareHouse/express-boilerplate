import { Configuration } from "./types";

export const parseConfiguration = (argv: string[]) => {
  const config = argv.find((arg) => arg.startsWith("--config="));
  if (!config) {
    throw new Error("Missing --config flag");
  }

  const configString = config.split("=")[1];

  try {
    return JSON.parse(configString) as Configuration;
  } catch (err) {
    throw new Error("Cannot parse configuration");
  }
};
