// src/offers/dto/filter-offer.dto.ts

import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumberString,
  IsIn,
  Min,
} from 'class-validator';

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

  @IsOptional()
  @Type(() => Number) // 2. Transforma a string da URL em número
  @Min(1) // 3. Garante que a página seja no mínimo 1
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  fields?: string;
}
