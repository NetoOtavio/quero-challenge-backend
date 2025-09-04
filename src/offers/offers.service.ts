// src/offers/offers.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { OfferResponseDto } from './dto/offer.response.dto';
import { FilterOfferDto } from './dto/filter-offer.dto'; // Importe o DTO de filtros
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm'; // Importe o 'Between' do TypeORM

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async findAll(filters: FilterOfferDto): Promise<OfferResponseDto[]> {
    const { kind, level, minPrice, maxPrice, courseName, sortBy, orderBy } =
      filters;

    // 1. Crie a cláusula 'where' separadamente com o tipo correto
    const whereClause: FindOptionsWhere<Offer> = {};

    // 2. Adicione as condições a este objeto. Agora é seguro!
    if (kind) {
      whereClause.kind = kind;
    }

    if (level) {
      whereClause.level = level;
    }

    if (minPrice && maxPrice) {
      whereClause.offeredPrice = Between(Number(minPrice), Number(maxPrice));
    }

    if (courseName) {
      // Usa ILike para busca parcial (% wildcard) e case-insensitive
      whereClause.courseName = ILike(`%${courseName}%`);
    }

    // 3. Monte o objeto de opções final
    const queryOptions: FindManyOptions<Offer> = {
      where: whereClause,
    };

    if (sortBy) {
      queryOptions.order = { [sortBy]: orderBy || 'ASC' };
    }

    const offers = await this.offerRepository.find(queryOptions);
    return offers.map((offer) => this.formatOfferResponse(offer));
  }

  private formatOfferResponse(offer: Offer): OfferResponseDto {
    const fullPrice = Number(offer.fullPrice);
    const offeredPrice = Number(offer.offeredPrice);

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    // Lógica explícita para formatar o 'kind'
    let formattedKind: string;
    switch (offer.kind) {
      case 'presencial':
        formattedKind = 'Presencial 🏫';
        break;
      case 'ead':
        formattedKind = 'EaD 🏠';
        break;
      default:
        formattedKind = offer.kind; // Valor padrão caso não seja nenhum dos acima
    }

    // Lógica explícita para formatar o 'level'
    let formattedLevel: string;
    switch (offer.level) {
      case 'bacharelado':
        formattedLevel = 'Graduação (bacharelado) 🎓';
        break;
      case 'tecnologo':
        formattedLevel = 'Graduação (tecnólogo) 🎓';
        break;
      case 'licenciatura':
        formattedLevel = 'Graduação (licenciatura) 🎓';
        break;
      default:
        formattedLevel = offer.level;
    }

    const discountPercentage = Math.round(
      ((fullPrice - offeredPrice) / fullPrice) * 100,
    );

    return {
      courseName: offer.courseName,
      rating: offer.rating,
      fullPrice: formatCurrency(fullPrice),
      offeredPrice: formatCurrency(offeredPrice),
      discountPercentage: `${discountPercentage}% 📉`,
      kind: formattedKind, // Usa a variável formatada
      level: formattedLevel, // Usa a variável formatada
      iesLogo: offer.iesLogo,
      iesName: offer.iesName,
    };
  }
}
