import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Offer } from './entities/offer.entity';
import { FilterOfferDto } from './dto/filter-offer.dto';

import { OfferResponseDto } from './dto/offer.response.dto';
import { PaginatedOffersResponseDto } from './dto/paginated-offers.respons.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async findAll(filters: FilterOfferDto): Promise<PaginatedOffersResponseDto> {
    const {
      page = 1,
      limit = 10,
      kind,
      level,
      minPrice,
      maxPrice,
      courseName,
      sortBy,
      orderBy,
      fields,
    } = filters;

    const skip = (page - 1) * limit;

    const whereClause: FindOptionsWhere<Offer> = {};
    if (kind) whereClause.kind = kind;
    if (level) whereClause.level = level;
    if (courseName) whereClause.courseName = ILike(`%${courseName}%`);
    if (minPrice && maxPrice) {
      whereClause.offeredPrice = Between(Number(minPrice), Number(maxPrice));
    } else if (minPrice) {
      whereClause.offeredPrice = MoreThanOrEqual(Number(minPrice));
    } else if (maxPrice) {
      whereClause.offeredPrice = LessThanOrEqual(Number(maxPrice));
    }

    const queryOptions: FindManyOptions<Offer> = {
      where: whereClause,
      take: limit,
      skip: skip,
    };

    if (sortBy) {
      queryOptions.order = { [sortBy]: orderBy || 'ASC' };
    }

    const requestedFields = fields?.split(',').map((field) => field.trim());

    if (requestedFields) {
      const dbSelectFields = new Set<keyof Offer>();
      const offerKeys = this.offerRepository.metadata.columns.map(
        (col) => col.propertyName as keyof Offer,
      );

      requestedFields.forEach((field) => {
        if (offerKeys.includes(field as keyof Offer)) {
          dbSelectFields.add(field as keyof Offer);
        }
      });

      if (requestedFields.includes('discountPercentage')) {
        dbSelectFields.add('fullPrice');
        dbSelectFields.add('offeredPrice');
      }

      if (dbSelectFields.size > 0) {
        queryOptions.select = Array.from(dbSelectFields);
      }
    }

    const [offers, totalItems] =
      await this.offerRepository.findAndCount(queryOptions);

    // O método 'findAll' agora está mais simples. Ele apenas delega a formatação.
    const formattedData = offers.map((offer) =>
      this.formatOfferResponse(offer, requestedFields),
    );

    const totalPages = Math.ceil(totalItems / limit);

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

  /**
   * Função auxiliar para converter o objeto da entidade (Offer)
   * no DTO de resposta, aplicando formatações.
   * Ela é resiliente e só formata/calcula os campos cujos dados brutos existirem.
   */
  private formatOfferResponse(
    offer: Partial<Offer>,
    requestedFields?: string[],
  ): Partial<OfferResponseDto> {
    const response: Partial<OfferResponseDto> = {};

    // Se nenhum campo foi solicitado, retornamos o DTO completo.
    const fieldsToProcess =
      requestedFields || Object.keys(new OfferResponseDto());

    for (const field of fieldsToProcess) {
      const key = field as keyof OfferResponseDto;

      // Usamos 'switch' para lidar com cada campo solicitado.
      // Isso é explícito e 100% type-safe.
      switch (key) {
        case 'courseName':
          if (offer.courseName !== undefined)
            response.courseName = offer.courseName;
          break;
        case 'rating':
          if (offer.rating !== undefined) response.rating = offer.rating;
          break;
        case 'iesLogo':
          if (offer.iesLogo !== undefined) response.iesLogo = offer.iesLogo;
          break;
        case 'iesName':
          if (offer.iesName !== undefined) response.iesName = offer.iesName;
          break;
        case 'fullPrice':
          if (offer.fullPrice !== undefined) {
            response.fullPrice = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(offer.fullPrice));
          }
          break;
        case 'offeredPrice':
          if (offer.offeredPrice !== undefined) {
            response.offeredPrice = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(offer.offeredPrice));
          }
          break;
        case 'kind':
          if (offer.kind) {
            response.kind =
              offer.kind === 'presencial' ? 'Presencial 🏫' : 'EaD 🏠';
          }
          break;
        case 'level':
          if (offer.level) {
            switch (offer.level) {
              case 'bacharelado':
                response.level = 'Graduação (bacharelado) 🎓';
                break;
              case 'tecnologo':
                response.level = 'Graduação (tecnólogo) 🎓';
                break;
              case 'licenciatura':
                response.level = 'Graduação (licenciatura) 🎓';
                break;
            }
          }
          break;
        case 'discountPercentage':
          if (
            offer.fullPrice !== undefined &&
            offer.offeredPrice !== undefined
          ) {
            const full = Number(offer.fullPrice);
            const offered = Number(offer.offeredPrice);
            const discount = Math.round(((full - offered) / full) * 100);
            response.discountPercentage = `${discount}%`;
          }
          break;
      }
    }
    return response;
  }
}
