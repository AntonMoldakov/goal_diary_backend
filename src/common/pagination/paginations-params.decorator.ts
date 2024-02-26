import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  offset: number;
}

export const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const PaginationParams = createParamDecorator((_data, ctx: ExecutionContext): Pagination => {
  const req: Request = ctx.switchToHttp().getRequest();
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);

  if (isNaN(page) || page < 0) {
    throw new BadRequestException('Invalid page param. Must be either 0 or greater');
  }

  if (isNaN(limit) || limit < 1) {
    throw new BadRequestException('Invalid limit param. Must be a number greater than 0');
  }

  if (limit > MAX_LIMIT) {
    throw new BadRequestException(`Invalid pagination params: Max limit is ${MAX_LIMIT}`);
  }

  const offset = page * limit;
  return { page, limit, offset };
});
