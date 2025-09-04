// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offers/entities/offer.entity';
import { SeedingService } from './database/seeding.service';

@Module({
  imports: [
    // 1. Módulo de configuração para ler o .env
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente disponíveis globalmente
    }),

    // 2. Módulo de conexão com o banco de dados
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: +configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'admin'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'admin'),
        database: configService.get<string>('POSTGRES_DB', 'quero_challenge'),
        entities: [Offer],
        synchronize: true,
      }),
    }),

    // 3. Importa o repositório da entidade Offer para o SeedingService usar
    TypeOrmModule.forFeature([Offer]),
  ],
  controllers: [AppController],
  // 4. Registra o SeedingService para que ele seja executado na inicialização
  providers: [AppService, SeedingService],
})
export class AppModule {}
