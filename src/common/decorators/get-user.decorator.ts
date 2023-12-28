import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((_data, ctx): Record<string, unknown> => {
  return ctx.switchToHttp().getRequest().user;
});
