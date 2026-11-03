import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToothCondition, ToothSurface, SurfaceCondition } from '@prisma/client';

class DentalSurfaceDto {
  @IsEnum(ToothSurface)
  surface: ToothSurface;

  @IsEnum(SurfaceCondition)
  condition: SurfaceCondition;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class CreateDentalChartDto {
  @IsString()
  @Matches(/^(1[1-8]|2[1-8]|3[1-8]|4[1-8]|5[1-5]|6[1-5]|7[1-5]|8[1-5])$/, {
    message: 'Invalid FDI tooth number',
  })
  toothNumber: string;

  @IsOptional()
  @IsEnum(ToothCondition)
  condition?: ToothCondition;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DentalSurfaceDto)
  surfaces?: DentalSurfaceDto[];
}
