import { Reflector } from '@nestjs/core';

export const AllowedRole = Reflector.createDecorator<string[]>();
