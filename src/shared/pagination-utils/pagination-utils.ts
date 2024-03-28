import { FindManyOptions, FindOperator, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
import { SortOrder } from "../constants/sort-order.enum";

export interface PaginationResult<T> {
  meta: {
    pagination: {
      page?: number;
      limit?: number;
      total: number;
      totalPages: number | null;
    };
    filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    sort?: FindOptionsOrder<T> | FindOptionsOrder<T>[];
    search?: string;
  };
  data: T[];
}

export interface PaginationParamsDto {
  page?: number;
  limit?: number;
  sort?: { [key: string]: SortOrder };
  filter?: { [key: string]: string | string[] };
  search?: string;
}

type QueryFilters = { [key: string]: SortOrder } | { [key: string]: string | string[] };

export function calculateSkipFindOption(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function getAvailableFilters<T extends ObjectLiteral>(
  filter: QueryFilters,
  repository: Repository<T>,
): QueryFilters {
  const availableFilters = repository.metadata.columns.map((column) => column.propertyName);
  const currentFilters = filter;

  Object.keys(currentFilters).forEach((key) => {
    if (!availableFilters.includes(key)) {
      delete currentFilters[key];
    }
  });

  return currentFilters;
}

export function createFindManyOptions<T extends ObjectLiteral>(
  repository: Repository<T>,
  payload: PaginationParamsDto,
): FindManyOptions<T> {
  const { page, limit, sort, filter } = payload;
  const findOptions: FindManyOptions = {};

  if (limit && page) {
    findOptions.take = limit;
    findOptions.skip = calculateSkipFindOption(page, limit);
  }

  if (sort) {
    findOptions.order = getAvailableFilters(sort, repository);
  }

  if (filter) {
    findOptions.where = getAvailableFilters(filter, repository);
  }

  return findOptions;
}

export function makePaginationResult<T>(
  data: T[],
  total: number,
  findOptions: FindManyOptions,
  search?: string,
): PaginationResult<T> {
  const { skip: page, take: limit, order: sort, where: filter } = findOptions;

  if (search && filter && !Array.isArray(filter)) {
    Object.keys(filter).forEach((key) => {
      if (filter[key] instanceof FindOperator) {
        delete filter[key];
      }
    });
  }

  return {
    meta: {
      pagination: {
        page: page || 1,
        limit,
        total,
        totalPages: limit ? Math.ceil(total / Math.max(limit, 1)) : null,
      },
      filter,
      sort,
      search,
    },
    data,
  };
}

export function normalizePage(page: number) {
  return Math.max(page - 1, 0);
}
