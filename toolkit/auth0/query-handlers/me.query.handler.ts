import { QueryHandler } from "@tshio/query-bus";
import { Repository } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { Logger } from "winston";
import { ME_QUERY_TYPE, MeQuery, MeQueryResult } from "../queries/me";
import { UserEntity } from "../models/user.entity";
import { HttpError } from "../../../../errors/http.error";

export interface MeQueryDependencies {
  logger: Logger;
  userRepository: Repository<UserEntity>;
}

export default class MeQueryHandler implements QueryHandler<MeQuery, MeQueryResult> {
  public queryType: string = ME_QUERY_TYPE;

  constructor(private dependencies: MeQueryDependencies) {}

  async execute(query: MeQuery): Promise<MeQueryResult> {
    const { email } = query.payload;
    const profile = await this.dependencies.userRepository.findOne({ where: { email } });

    if (!profile) {
      this.dependencies.logger.error(`User with email "${email}" does not exist`);
      throw new HttpError(StatusCodes.NOT_FOUND, `User with email "${email}" does not exist`);
    }

    return new MeQueryResult(profile);
  }
}
