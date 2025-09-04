// src/offers/offers.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { FilterOfferDto } from './dto/filter-offer.dto'; // Importe o novo DTO
import { PaginatedOffersResponseDto } from './dto/paginated-offers.respons.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  findAll(
    @Query() filters: FilterOfferDto, // Use o decorator @Query
  ): Promise<PaginatedOffersResponseDto> {
    return this.offersService.findAll(filters); // Passe os filtros para o serviço
  }
}
