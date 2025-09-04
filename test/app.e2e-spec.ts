import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

const typedRequest = request as unknown as (
  app: ReturnType<INestApplication['getHttpServer']>,
) => request.SuperTest<request.Test>;

import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../src/offers/entities/offer.entity';

interface ApiMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface FormattedOffer {
  id: string;
  courseName: string;
  rating: number;
  fullPrice: string;
  offeredPrice: string;
  discountPercentage: string;
  kind: string;
  level: string;
  iesLogo: string;
  iesName: string;
}

interface ApiResponse {
  data: FormattedOffer[];
  metadata: ApiMetadata;
}

describe('Offers API (e2e)', () => {
  let app: INestApplication;
  let offerRepository: Repository<Offer>;

  const mockOffers = [
    {
      id: '1',
      courseName: 'Medicina',
      rating: 4.8,
      fullPrice: 1200,
      offeredPrice: 876,
      kind: 'presencial',
      level: 'bacharelado',
      iesLogo: 'https://example.com/logo1.png',
      iesName: 'Universidade Federal',
    },
    {
      id: '2',
      courseName: 'Engenharia Civil',
      rating: 4.5,
      fullPrice: 800,
      offeredPrice: 600,
      kind: 'ead',
      level: 'tecnologo',
      iesLogo: 'https://example.com/logo2.png',
      iesName: 'Universidade Tecnológica',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    offerRepository = moduleFixture.get<Repository<Offer>>(
      getRepositoryToken(Offer),
    );

    await offerRepository.clear();
    await offerRepository.save(mockOffers);
  });

  afterAll(async () => {
    await offerRepository.clear();
    await app.close();
  });

  describe('GET /offers', () => {
    it('should return all offers with basic pagination', async () => {
      const response = await typedRequest(app).get('/offers').expect(200);

      const responseBody = response.body as ApiResponse;
      expect(responseBody.data).toHaveLength(2);
      expect(responseBody.metadata).toEqual({
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
      });

      const firstOffer = responseBody.data[0];
      expect(firstOffer).toHaveProperty('courseName');
      expect(firstOffer).toHaveProperty('fullPrice');
      expect(firstOffer).toHaveProperty('offeredPrice');
      expect(firstOffer).toHaveProperty('discountPercentage');
    });

    it('should format data correctly', async () => {
      const response = await typedRequest(app).get('/offers').expect(200);

      const responseBody = response.body as ApiResponse;
      const medicinaOffer = responseBody.data.find(
        (offer: FormattedOffer) => offer.courseName === 'Medicina',
      );

      expect(medicinaOffer?.fullPrice).toBe('R$ 1.200,00');
      expect(medicinaOffer?.offeredPrice).toBe('R$ 876,00');
      expect(medicinaOffer?.discountPercentage).toBe('27%');

      expect(medicinaOffer?.kind).toBe('Presencial 🏫');

      expect(medicinaOffer?.level).toBe('Graduação (bacharelado) 🎓');
    });

    it('should filter by query parameters', async () => {
      const responseByName = await typedRequest(app)
        .get('/offers?courseName=medicina')
        .expect(200);

      const responseByNameBody = responseByName.body as ApiResponse;
      expect(responseByNameBody.data).toHaveLength(1);
      expect(responseByNameBody.data[0].courseName).toBe('Medicina');

      const responseByKind = await typedRequest(app)
        .get('/offers?kind=ead')
        .expect(200);

      const responseByKindBody = responseByKind.body as ApiResponse;
      expect(responseByKindBody.data).toHaveLength(1);
      expect(responseByKindBody.data[0].kind).toBe('EaD 🏠');

      const responseByLevel = await typedRequest(app)
        .get('/offers?level=tecnologo')
        .expect(200);

      const responseByLevelBody = responseByLevel.body as ApiResponse;
      expect(responseByLevelBody.data).toHaveLength(1);
      expect(responseByLevelBody.data[0].level).toBe(
        'Graduação (tecnólogo) 🎓',
      );
    });

    it('should sort and paginate results', async () => {
      const responseSorted = await typedRequest(app)
        .get('/offers?sortBy=rating&orderBy=DESC')
        .expect(200);

      const responseSortedBody = responseSorted.body as ApiResponse;
      const ratings = responseSortedBody.data.map(
        (offer: FormattedOffer) => offer.rating,
      );
      expect(ratings[0]).toBeGreaterThanOrEqual(ratings[1]);

      const responsePage = await typedRequest(app)
        .get('/offers?page=1&perPage=1')
        .expect(200);

      const responsePageBody = responsePage.body as ApiResponse;
      expect(responsePageBody.data).toHaveLength(1);
      expect(responsePageBody.metadata).toEqual({
        totalItems: 2,
        totalPages: 2,
        currentPage: 1,
        itemsPerPage: 1,
      });
    });

    it('should select specific fields', async () => {
      const responseFields = await typedRequest(app)
        .get('/offers?fields=courseName,offeredPrice')
        .expect(200);

      const responseFieldsBody = responseFields.body as ApiResponse;
      const offer = responseFieldsBody.data[0];
      expect(offer).toHaveProperty('courseName');
      expect(offer).toHaveProperty('offeredPrice');
      expect(offer).not.toHaveProperty('rating');
      expect(offer).not.toHaveProperty('fullPrice');
    });
  });

  describe('API Error Handling', () => {
    it('should handle errors appropriately', async () => {
      await typedRequest(app).get('/nonexistent').expect(404);

      await typedRequest(app).get('/offers?page=0').expect(400);
      await typedRequest(app).get('/offers?sortBy=invalidField').expect(400);
    });
  });
});
