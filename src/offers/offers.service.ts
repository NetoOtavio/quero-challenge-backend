// src/offers/offers.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { OfferResponseDto } from './dto/offer.response.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async findAll(): Promise<OfferResponseDto[]> {
    const offers = await this.offerRepository.find();
    // Mapeia cada oferta para o formato de resposta desejado
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
