// server-nestjs/src/users/users.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller(['users', ''])
export class UsersController {
  @Get('departments')
  getDepartments() {
    return ['대외협력부', '총기획단', '기획부', '컴페티션부', '홍보부'];
  }
}