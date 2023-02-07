import { ObjectLiteral } from "typeorm";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { TypeormMapperDTO } from "../mapper/typeorm-mapper.dto";
import { lowerFirst, tableAliasName } from "../../utils/string.utils";

declare module "typeorm/query-builder/SelectQueryBuilder" {
  interface SelectQueryBuilder<Entity> {
    buildQueryByTypeOrmMapper(
      this: SelectQueryBuilder<Entity>,
      typeOrmMapper: TypeormMapperDTO,
    ): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.buildQueryByTypeOrmMapper = function buildQueryByTypeOrmMapper<
  Entity extends ObjectLiteral,
>(this: SelectQueryBuilder<Entity>, typeOrmMapper: TypeormMapperDTO): SelectQueryBuilder<Entity> {
  const whereObject: any = typeOrmMapper.where;

  if (typeOrmMapper.where) {
    this.where(whereObject.where, whereObject.operands);
  }

  if (typeOrmMapper.order) {
    let i = 0;
    Object.entries(typeOrmMapper.order).forEach(([field, direction]) => {
      if (i === 0) {
        this.orderBy(field, direction);
      } else {
        this.addOrderBy(field, direction);
      }
      i += 1;
    });
  }

  if (typeOrmMapper.relations) {
    typeOrmMapper.relations.forEach((relation) => {
      this.leftJoinAndSelect(lowerFirst(relation), tableAliasName(relation));
    });
  }

  if (typeOrmMapper.skip) {
    this.skip(typeOrmMapper.skip);
  }

  if (typeOrmMapper.take) {
    this.take(typeOrmMapper.take);
  }

  return this;
};
