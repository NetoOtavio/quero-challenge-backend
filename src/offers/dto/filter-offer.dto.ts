// src/offers/dto/filter-offer.dto.ts

import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

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

  @IsOptional()
  @IsString()
  courseName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['courseName', 'offeredPrice', 'rating']) // Valida os valores permitidos
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC']) // Valida os valores permitidos
  orderBy?: 'ASC' | 'DESC';
}
