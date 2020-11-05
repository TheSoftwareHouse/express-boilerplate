export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    Meta:
 *      type: object
 *      properties:
 *        page:
 *          type: integer
 *        size:
 *          type: integer
 *        total:
 *          type: integer
 *        totalPages:
 *          type: integer
 *
 */
export function makePaginationMeta(size: number, page: number, total: number): PaginationMeta {
  return {
    page: page || 1,
    size,
    total,
    totalPages: Math.ceil(total / Math.max(size, 1)),
  };
}

export function normalizePage(page: number) {
  return Math.max(page - 1, 0);
}
