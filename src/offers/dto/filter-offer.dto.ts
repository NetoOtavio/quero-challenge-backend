import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumberString,
  IsIn,
  Min,
} from 'class-validator';

export class FilterOfferDto {
  @ApiPropertyOptional({
    description:
      'Filtro por modalidade de ensino. Use "presencial" para cursos presenciais ou "ead" para cursos à distância. Na resposta, serão apresentados como "Presencial 🏫" ou "EaD 🏠".',
    example: 'presencial',
    enum: ['presencial', 'ead'],
  })
  @IsOptional()
  @IsString()
  kind?: string;

  @ApiPropertyOptional({
    description:
      'Filtro por nível do curso. Opções disponíveis:\n\n- bacharelado: Cursos de graduação bacharelado (4-5 anos)\n- tecnologo: Cursos tecnólogos (2-3 anos)\n- licenciatura: Cursos para formação de professores\n\nNa resposta, serão apresentados com o prefixo "Graduação" e emojis.',
    example: 'bacharelado',
    enum: ['bacharelado', 'tecnologo', 'licenciatura'],
  })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({
    description:
      'Preço mínimo da mensalidade COM desconto. Informe apenas números, sem R$ ou outros símbolos. Exemplo: para filtrar cursos acima de R$ 250, digite "250" ou "250.00".',
    example: '250.00',
  })
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiPropertyOptional({
    description:
      'Preço máximo da mensalidade COM desconto. Informe apenas números, sem R$ ou outros símbolos. Exemplo: para filtrar cursos até R$ 600,50, digite "600.50".',
    example: '600.50',
  })
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @ApiPropertyOptional({
    description:
      'Busca por nome do curso. A busca não diferencia maiúsculas/minúsculas e encontra cursos que contém o termo digitado em qualquer parte do nome. Exemplos: "medicina", "direito", "engenharia civil".',
    example: 'engenharia',
  })
  @IsOptional()
  @IsString()
  courseName?: string;

  @ApiPropertyOptional({
    description:
      'Define qual informação será usada para ordenar os resultados:\n\n- courseName: Ordenar por nome do curso (alfabeticamente)\n- offeredPrice: Ordenar por preço com desconto\n- rating: Ordenar por avaliação do curso (0-5 estrelas)',
    enum: ['courseName', 'offeredPrice', 'rating'],
    default: 'courseName',
  })
  @IsOptional()
  @IsString()
  @IsIn(['courseName', 'offeredPrice', 'rating'])
  sortBy?: string;

  @ApiPropertyOptional({
    description:
      'Direção da ordenação:\n\n- ASC: Ascendente (A-Z, menor para maior preço, menor para maior avaliação)\n- DESC: Descendente (Z-A, maior para menor preço, maior para menor avaliação)',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderBy?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description:
      'Número da página para resultados paginados. A primeira página é 1. Se não informado, exibe a primeira página. Use junto com o parâmetro "limit" para controlar a navegação entre páginas de resultados.',
    default: 1,
    minimum: 1,
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description:
      'Quantidade de ofertas mostradas por página. Se não informado, exibe 10 resultados por página. Valores maiores trazem mais resultados por vez, mas podem deixar a resposta mais lenta.',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Selecione apenas os campos desejados na resposta, separados por vírgula (sem espaços). Útil para economizar dados ou obter apenas informações específicas. Campos disponíveis: id, courseName, kind, level, fullPrice, offeredPrice, discountPercentage, rating, iesName, iesLogo.\n\nExemplo: para obter apenas o nome do curso e o preço com desconto, use "courseName,offeredPrice".',
    example: 'courseName,offeredPrice,discountPercentage',
  })
  @IsOptional()
  @IsString()
  fields?: string;
}
