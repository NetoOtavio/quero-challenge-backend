import { Controller, Get, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { FilterOfferDto } from './dto/filter-offer.dto';
import { PaginatedOffersResponseDto } from './dto/paginated-offers.respons.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar e filtrar ofertas de bolsas de estudo',
    description:
      'Endpoint principal para consultar ofertas de bolsas de estudo disponíveis.\n\nEste endpoint oferece diversas opções de filtro e personalização:\n\n### ✅ Funcionalidades disponíveis\n- **Filtragem**: por modalidade, nível, preço, nome do curso\n- **Ordenação**: por nome, preço ou avaliação (⭐)\n- **Paginação**: controle o número de resultados por página\n- **Seleção de campos**: escolha apenas os dados que precisa ver\n\n### 💡 Exemplos de uso\n- Ver todas as ofertas: GET /offers\n- Cursos EAD até R$ 300: GET /offers?kind=ead&maxPrice=300\n- Buscar "engenharia" ordenando por preço: GET /offers?courseName=engenharia&sortBy=offeredPrice\n- Exibir apenas nome e preço: GET /offers?fields=courseName,offeredPrice,discountPercentage\n\n### 📝 Formatação de dados\n- Preços são exibidos no formato brasileiro (R$ 1.234,56)\n- Descontos são calculados e mostrados como porcentagem\n- Modalidades e níveis são traduzidos e formatados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ofertas retornada com sucesso',
    type: PaginatedOffersResponseDto,
    schema: {
      example: {
        data: [
          {
            id: 1,
            courseName: 'Engenharia Civil',
            kind: 'Presencial 🏫',
            level: 'Graduação (Bacharelado) 🎓',
            fullPrice: 'R$ 1.200,00',
            offeredPrice: 'R$ 840,00',
            discountPercentage: '30%',
            rating: 4.5,
            iesName: 'Universidade Exemplo',
            iesLogo: 'https://example.com/logo.png',
          },
        ],
        meta: {
          total: 25,
          page: 1,
          lastPage: 3,
          perPage: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de consulta inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'minPrice must be a number string',
          'page must not be less than 1',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    schema: {
      example: {
        statusCode: 500,
        message: 'Erro interno do servidor',
        error: 'Internal Server Error',
      },
    },
  })
  findAll(
    @Query() filters: FilterOfferDto,
  ): Promise<PaginatedOffersResponseDto> {
    return this.offersService.findAll(filters);
  }
}
