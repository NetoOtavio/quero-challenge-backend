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
import { PaginatedOffersResponseDto } from './dto/paginated-offers.respons.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async findAll(filters: FilterOfferDto): Promise<PaginatedOffersResponseDto> {
    // 1. Extrai page e limit, definindo valores padrão
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit; // Calcula o offset

    // ... (lógica do whereClause permanece a mesma)
    const { kind, level, minPrice, maxPrice, courseName, sortBy, orderBy } =
      filters;
    const whereClause: FindOptionsWhere<Offer> = {};
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
      whereClause.courseName = ILike(`%${courseName}%`);
    }

    const queryOptions: FindManyOptions<Offer> = {
      where: whereClause,
      take: limit, // 2. 'take' é o limite de itens por página
      skip: skip, // 3. 'skip' é quantos itens pular
    };

    if (sortBy) {
      queryOptions.order = { [sortBy]: orderBy || 'ASC' };
    }

    // 4. Usa 'findAndCount' em vez de 'find'
    const [offers, totalItems] =
      await this.offerRepository.findAndCount(queryOptions);

    // 5. Formata os dados da página atual
    const formattedData = offers.map((offer) =>
      this.formatOfferResponse(offer),
    );

    // 6. Calcula os metadados
    const totalPages = Math.ceil(totalItems / limit);

    // 7. Retorna o objeto de resposta paginada completo
    return {
      data: formattedData,
      metadata: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
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
