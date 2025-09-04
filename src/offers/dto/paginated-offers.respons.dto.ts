// src/offers/dto/paginated-offers.response.dto.ts

import { OfferResponseDto } from './offer.response.dto';

// Classe para os metadados da paginação
export class PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// DTO principal para a resposta
export class PaginatedOffersResponseDto {
  data: OfferResponseDto[];
  metadata: PaginationMetadata;
}
