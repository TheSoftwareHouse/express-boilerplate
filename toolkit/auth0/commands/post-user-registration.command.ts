import { Command } from "@tshio/command-bus";

export const POST_USER_REGISTRATION_COMMAND_TYPE = "example/POST_USER_REGISTRATION";

export interface PostUserRegistrationCommandPayload {
  userId: string;
}

export class PostUserRegistrationCommand implements Command<PostUserRegistrationCommandPayload> {
  public type: string = POST_USER_REGISTRATION_COMMAND_TYPE;

  constructor(public payload: PostUserRegistrationCommandPayload) {}
}
