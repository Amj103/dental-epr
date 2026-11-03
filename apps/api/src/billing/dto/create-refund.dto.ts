import {
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateRefundDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @MaxLength(500)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
