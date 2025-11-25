// server-nestjs/src/inquiries/dto/update-status.dto.ts
import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['pending', 'inProgress', 'completed'])
  status: string;
}