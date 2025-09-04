// src/offers/offers.controller.ts

import { Controller, Get } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OfferResponseDto } from './dto/offer.response.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  findAll(): Promise<OfferResponseDto[]> {
    return this.offersService.findAll();
  }
}
