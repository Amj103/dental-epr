import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { MedicalHistoryCategory } from '@prisma/client';

export class UpdateMedicalHistoryDto {
  @IsOptional()
  @IsEnum(MedicalHistoryCategory)
  category?: MedicalHistoryCategory;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  details?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
