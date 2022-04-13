import { Request } from "express";
import { TypeormMapperDTO } from "./typeorm-mapper.dto";
import { lowerFirst } from "../../utils/string.utils";

export enum FilterOperators {
  "eq" = "eq",
  "eqOr" = "eqOr",
  "neq" = "neq",
  "neqOr" = "neqOr",
  "lt" = "lt",
  "ltOr" = "ltOr",
  "lte" = "lte",
  "lteOr" = "lteOr",
  "gt" = "gt",
  "gtOr" = "gtOr",
  "gte" = "gte",
  "gteOr" = "gteOr",
  "include" = "include",
  "includeOr" = "includeOr",
  "in" = "in",
  "inOr" = "inOr",
}

export const OPERATORS: any = {
  [FilterOperators.eq]: (value: any) => ({ operator: "=", orAnd: "AND", value }),
  [FilterOperators.eqOr]: (value: any) => ({ operator: "=", orAnd: "OR", value }),
  [FilterOperators.neq]: (value: any) => ({ operator: "<>", orAnd: "AND", value }),
  [FilterOperators.neqOr]: (value: any) => ({ operator: "<>", orAnd: "OR", value }),
  [FilterOperators.lt]: (value: any) => ({ operator: "<", orAnd: "AND", value }),
  [FilterOperators.ltOr]: (value: any) => ({ operator: "<", orAnd: "Or", value }),
  [FilterOperators.lte]: (value: any) => ({ operator: "<=", orAnd: "AND", value }),
  [FilterOperators.lteOr]: (value: any) => ({ operator: "<=", orAnd: "OR", value }),
  [FilterOperators.gt]: (value: any) => ({ operator: ">", orAnd: "AND", value }),
  [FilterOperators.gtOr]: (value: any) => ({ operator: ">", orAnd: "OR", value }),
  [FilterOperators.gte]: (value: any) => ({ operator: ">=", orAnd: "AND", value }),
  [FilterOperators.gteOr]: (value: any) => ({ operator: ">=", orAnd: "OR", value }),
  [FilterOperators.include]: (pattern: string) => ({ operator: "like", orAnd: "AND", value: `%${pattern}%` }),
  [FilterOperators.includeOr]: (pattern: string) => ({ operator: "like", orAnd: "OR", value: `%${pattern}%` }),
  [FilterOperators.in]: (array: string) => ({ operator: "IN", orAnd: "AND", value: array.split(",") }),
  [FilterOperators.inOr]: (array: string) => ({ operator: "IN", orAnd: "OR", value: array.split(",") }),
};

const createTypeORMFilter = (request: Request, prefix = "", operators = OPERATORS) => {
  const filterObject: any = {
    where: "",
    operands: {},
  };

  const query = request.query as any;

  let id = 0;
  Object.entries(query.filter).forEach((filter) => {
    const column = lowerFirst(filter[0]);
    const formula = filter[1];

    Object.entries(formula as object).forEach((type) => {
      const [operator, operand] = type;
      const operatorFn = operators[operator];
      if (typeof operatorFn === "function") {
        const _filter = operatorFn(operand);
        const _prefix = column.indexOf(".") > -1 ? "" : prefix;
        if (operator === FilterOperators.include || operator === FilterOperators.includeOr) {
          filterObject.where +=
            filterObject.where === ""
              ? `LOWER(${_prefix}${column}) ${_filter.operator} LOWER(:${id})`
              : ` ${_filter.orAnd} LOWER(${_prefix}${column}) ${_filter.operator} LOWER(:${id})`;
        } else if (operator === FilterOperators.in || operator === FilterOperators.inOr) {
          filterObject.where +=
            filterObject.where === ""
              ? `${_prefix}${column} ${_filter.operator} (:...${id})`
              : ` ${_filter.orAnd} ${_prefix}${column} ${_filter.operator} (:...${id})`;
          filterObject.operands[`${id}`] = _filter.value;
        } else {
          filterObject.where +=
            filterObject.where === ""
              ? `${_prefix}${column} ${_filter.operator} :${id}`
              : ` ${_filter.orAnd} ${_prefix}${column} ${_filter.operator} :${id}`;
          filterObject.operands[`${id}`] = _filter.value;
        }

        filterObject.operands[`${id}`] = _filter.value;

        id += 1;
      }
    });
  });

  return filterObject;
};

export const dtoToTypeormMapper = (request: Request): TypeormMapperDTO => {
  const dto = new TypeormMapperDTO();
  if (request.query.page && request.query.limit) {
    dto.take = Number(request.query.limit as string);
    dto.skip = (Number(request.query.page as string) - 1) * dto.take;
  }

  if (request.query.sort) {
    const order: { [key: string]: any } = {};
    Object.entries(request.query.sort).forEach(([field, direction]) => {
      const directionUpper = (direction as string).toUpperCase();
      if (["ASC", "DESC"].includes(directionUpper)) {
        order[field] = directionUpper;
      }
    });
    dto.order = order;
  }

  if (request.query.relations && Array.isArray(request.query.relations)) {
    dto.relations = request.query.relations as string[];
  }

  if (request.query.filter) {
    dto.where = createTypeORMFilter(request);
  }

  return dto;
};
