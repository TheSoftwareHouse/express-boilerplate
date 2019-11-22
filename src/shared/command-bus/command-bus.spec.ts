import "mocha";
import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { Command, CommandBus, CommandHandler } from "./index";

use(chaiAsPromised);

export default class TestHandler implements CommandHandler<Command<string>> {
  public commandType: string = "test-type";

  async execute(command: Command<string>) {
    return `handler-message ${command.payload}`;
  }
}

describe("command bus", () => {
  it("throws error if no handler found", async () => {
    const bus = new CommandBus([]);
    const testCommand: Command<string> = {
      payload: "payload-data",
      type: "test-type",
    };

    await expect(bus.execute(testCommand)).to.be.rejectedWith("Command: test-type is not supported.");
  });

  it("executes matched handler if found", async () => {
    const bus = new CommandBus([new TestHandler()]);
    const testCommand: Command<string> = {
      payload: "payload-data",
      type: "test-type",
    };

    expect(await bus.execute(testCommand)).to.be.equal("handler-message payload-data");
  });
});
