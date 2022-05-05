import { execSync } from "child_process";

export const removeDependencies = (dirname: string, names: string[]) => {
  const command = `npm uninstall ${names.join(" ")}`;

  // eslint-disable-next-line no-console
  console.info(`Running command: ${command}`);

  execSync(`npm --prefix ${dirname} uninstall ${names.join(" ")}`, {
    stdio: [0, 1, 2], // we need this so node will print the command output
  });
};
