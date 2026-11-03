import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { MedicalHistoryCategory } from '@prisma/client';

export class CreateMedicalHistoryDto {
  @IsEnum(MedicalHistoryCategory)
  category: MedicalHistoryCategory;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  details?: string;
}
