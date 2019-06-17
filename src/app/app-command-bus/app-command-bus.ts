import { CommandBus, Handler } from "../../shared/command-bus";

const appCommandBus = ({ handlers }: { handlers: Handler[] }) => {
  return new CommandBus(handlers);
};

export default appCommandBus;
