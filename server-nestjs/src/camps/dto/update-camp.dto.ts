// server-nestjs/src/camps/dto/update-camp.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCampDto } from './create-camp.dto';

// CreateCampDto의 모든 필드를 선택적(optional)으로 만듦
export class UpdateCampDto extends PartialType(CreateCampDto) {}