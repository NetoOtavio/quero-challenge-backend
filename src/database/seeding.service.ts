// src/database/seeding.service.ts

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../offers/entities/offer.entity';
import * as fs from 'fs';
import * as path from 'path';

// 1. DEFINIÇÃO DA INTERFACE
// Esta interface descreve a estrutura do nosso arquivo data.json.
// Ele tem uma chave "offers" que é um array de objetos do tipo Offer.
interface DataStructure {
  offers: Offer[];
}

@Injectable()
export class SeedingService implements OnModuleInit {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    this.logger.log('Iniciando seeding do banco de dados...');
    const count = await this.offerRepository.count();

    if (count > 0) {
      this.logger.log('Banco de dados já populado. Seeding ignorado.');
      return;
    }

    try {
      const filePath = path.join(process.cwd(), 'data.json');
      const file = fs.readFileSync(filePath, 'utf8');

      // 2. ASSERÇÃO DE TIPO
      // Usamos "as DataStructure" para dizer ao TypeScript:
      // "Confie em mim, o resultado de JSON.parse terá este formato."
      // A variável 'data' agora é fortemente tipada.
      const data = JSON.parse(file) as DataStructure;

      // Agora o TypeScript sabe que data.offers é um Offer[],
      // então a linha abaixo é segura.
      const offers = data.offers;
      await this.offerRepository.save(offers);
      this.logger.log('Seeding concluído com sucesso!');
    } catch (error) {
      // 3. VERIFICAÇÃO DE TIPO NO CATCH
      // Verificamos se o 'error' é uma instância da classe Error
      // antes de tentar acessar a propriedade '.stack'.
      if (error instanceof Error) {
        this.logger.error('Falha no processo de seeding.', error.stack);
      } else {
        this.logger.error('Ocorreu um erro desconhecido no seeding.', error);
      }
    }
  }
}
