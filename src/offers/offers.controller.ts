// src/offers/offers.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OfferResponseDto } from './dto/offer.response.dto';
import { FilterOfferDto } from './dto/filter-offer.dto'; // Importe o novo DTO

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  findAll(
    @Query() filters: FilterOfferDto, // Use o decorator @Query
  ): Promise<OfferResponseDto[]> {
    return this.offersService.findAll(filters); // Passe os filtros para o serviço
  }
}
