import { FindManyOptions } from "typeorm";

export class TypeormMapperDTO implements FindManyOptions {
  skip?: number;

  take?: number;

  where?: {};

  order?: { [x: string]: "ASC" | "DESC" };

  relations?: string[];
}
