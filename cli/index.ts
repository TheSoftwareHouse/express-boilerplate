import { parseConfiguration } from "./configuration/configuration.parser";
import { Bootstrapper } from "./bootstrapper";
import { Configuration } from "./configuration/types";

const run = (configuration: Configuration) => new Bootstrapper(configuration).execute();

run(parseConfiguration(process.argv) as unknown as Configuration);
