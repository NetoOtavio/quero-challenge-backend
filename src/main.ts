import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Quero Educação - Desafio Back-End')
    .setDescription(
      `
## Bem-vindo(a) à API de Ofertas de Bolsas de Estudo!

Esta API permite buscar, filtrar e ordenar ofertas de bolsas de estudo de diferentes cursos e universidades.

### Como usar esta documentação:

1. Navegue pelos endpoints disponíveis na seção abaixo
2. Clique em qualquer endpoint para ver detalhes
3. Experimente fazer requisições usando o botão "Try it out"
4. Veja exemplos de respostas para entender o formato dos dados

### Recursos principais:

- **Filtros**: por nome de curso, tipo (presencial/EaD), nível acadêmico e faixa de preço
- **Ordenação**: por nome, preço ou avaliação
- **Paginação**: controle o número de resultados por página
- **Seleção de campos**: escolha apenas os campos que deseja receber
      `,
    )
    .setVersion('1.0')
    .setExternalDoc('Documentação adicional', 'http://localhost:3000/api-json')
    .addTag(
      'offers',
      'Busque e filtre ofertas de bolsas de estudo com múltiplas opções',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API Quero Educação',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
