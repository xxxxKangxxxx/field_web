// server-nestjs/src/auth/guards/admin.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  
  @Injectable()
  export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        throw new ForbiddenException('인증이 필요합니다.');
      }
  
      // 최상위 관리자 또는 일반 관리자 허용
      if (!user.isSuperAdmin && !user.isAdmin) {
        throw new ForbiddenException('관리자 권한이 필요합니다.');
      }
  
      return true;
    }
  }