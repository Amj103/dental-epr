import { IsOptional, Matches } from 'class-validator';

export class ToothNumberDto {
  @IsOptional()
  @Matches(/^(1[1-8]|2[1-8]|3[1-8]|4[1-8]|5[1-5]|6[1-5]|7[1-5]|8[1-5])$/, {
    message: 'Invalid FDI tooth number',
  })
  toothNumber?: string;
}
