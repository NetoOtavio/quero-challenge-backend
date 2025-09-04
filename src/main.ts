import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adicione esta linha para habilitar a validação global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma os tipos (ex: string de número para número)
      whitelist: true, // Ignora propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Lança um erro se propriedades extras forem enviadas
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
