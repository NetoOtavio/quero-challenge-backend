// src/offers/dto/offer.response.dto.ts

export class OfferResponseDto {
  courseName: string;
  rating: number;
  fullPrice: string; // Será uma string formatada (ex: "R$ 550,00")
  offeredPrice: string; // Será uma string formatada
  discountPercentage: string; // Novo campo calculado (ex: "45%")
  kind: string; // Será formatado (ex: "Presencial 🏫")
  level: string; // Será formatado (ex: "Graduação (bacharelado) 🎓")
  iesLogo: string;
  iesName: string;
}
