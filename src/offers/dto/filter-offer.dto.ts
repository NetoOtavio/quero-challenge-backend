// src/offers/dto/filter-offer.dto.ts

import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FilterOfferDto {
  @IsOptional()
  @IsString()
  kind?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsNumberString() // Valida se a string contém apenas números
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;
}
