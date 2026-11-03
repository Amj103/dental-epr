import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

enum TreatmentHistoryEntity {
  PLAN = 'PLAN',
  PROCEDURE = 'PROCEDURE',
  APPOINTMENT = 'APPOINTMENT',
}

export class TreatmentHistoryQueryDto {
  @IsOptional()
  @IsEnum(TreatmentHistoryEntity)
  entityType?: TreatmentHistoryEntity;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
