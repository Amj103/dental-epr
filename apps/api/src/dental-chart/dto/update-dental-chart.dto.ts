import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToothCondition, ToothSurface, SurfaceCondition } from '@prisma/client';

class UpdateDentalSurfaceDto {
  @IsEnum(ToothSurface)
  surface: ToothSurface;

  @IsEnum(SurfaceCondition)
  condition: SurfaceCondition;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateDentalChartDto {
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
  @Type(() => UpdateDentalSurfaceDto)
  surfaces?: UpdateDentalSurfaceDto[];
}
