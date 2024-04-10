import { CommandHandler } from "@tshio/command-bus";
import { Logger } from "@tshio/logger";
import { StatusCodes } from "http-status-codes";
import {
  POST_USER_REGISTRATION_COMMAND_TYPE,
  PostUserRegistrationCommand,
} from "../commands/post-user-registration.command";

export interface PostUserRegistrationHandlerDependencies {
  logger: Logger;
}

export default class PostUserRegistrationHandler implements CommandHandler<PostUserRegistrationCommand> {
  public commandType: string = POST_USER_REGISTRATION_COMMAND_TYPE;

  constructor(private dependencies: PostUserRegistrationHandlerDependencies) {}

  async execute(command: PostUserRegistrationCommand) {
    this.dependencies.logger.info(`Post user ${command.payload.userId} registration action executed`);

    return {
      result: {
        status: StatusCodes.OK,
      },
    };
  }
}
