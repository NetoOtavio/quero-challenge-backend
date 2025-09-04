import { ApiProperty } from '@nestjs/swagger';
import { OfferResponseDto } from './offer.response.dto';

export class PaginationMetadata {
  @ApiProperty({
    description: 'O número total de itens que correspondem à consulta.',
    example: 127,
  })
  totalItems: number;

  @ApiProperty({
    description: 'O número total de páginas disponíveis.',
    example: 13,
  })
  totalPages: number;

  @ApiProperty({
    description: 'A página atual que está sendo retornada.',
    example: 2,
  })
  currentPage: number;

  @ApiProperty({
    description: 'O número de itens por página.',
    example: 10,
  })
  itemsPerPage: number;
}

export class PaginatedOffersResponseDto {
  @ApiProperty({
    description:
      'Um array de ofertas de bolsa. Pode conter objetos parciais se o parâmetro "fields" for usado.',
    type: [OfferResponseDto],
  })
  data: Partial<OfferResponseDto>[];

  @ApiProperty({
    description: 'Metadados relacionados à paginação.',
    type: PaginationMetadata,
  })
  metadata: PaginationMetadata;
}
