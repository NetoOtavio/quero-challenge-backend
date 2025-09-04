import { ApiProperty } from '@nestjs/swagger';

export class OfferResponseDto {
  @ApiProperty({
    description: 'Nome do curso.',
    example: 'Engenharia Civil',
  })
  courseName: string;

  @ApiProperty({
    description: 'Avaliação média do curso.',
    example: 4.9,
  })
  rating: number;

  @ApiProperty({
    description: 'Preço cheio da mensalidade, formatado como moeda brasileira.',
    example: 'R$ 800,00',
  })
  fullPrice: string;

  @ApiProperty({
    description:
      'Preço da mensalidade com o desconto da bolsa, formatado como moeda brasileira.',
    example: 'R$ 500,00',
  })
  offeredPrice: string;

  @ApiProperty({
    description: 'Porcentagem de desconto da bolsa.',
    example: '37%',
  })
  discountPercentage: string;

  @ApiProperty({
    description: 'Modalidade do curso (Presencial ou EaD).',
    example: 'EaD 🏠',
  })
  kind: string;

  @ApiProperty({
    description: 'Nível de ensino do curso.',
    example: 'Graduação (bacharelado) 🎓',
  })
  level: string;

  @ApiProperty({
    description: 'URL do logo da Instituição de Ensino Superior (IES).',
    example: 'https://www.tryimg.com/u/2019/04/16/unicsul.png',
  })
  iesLogo: string;

  @ApiProperty({
    description: 'Nome da Instituição de Ensino Superior (IES).',
    example: 'UNICSUL',
  })
  iesName: string;
}
