import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { FilterOfferDto } from './dto/filter-offer.dto';

describe('OffersService', () => {
  let service: OffersService;

  const mockOffers: Partial<Offer>[] = [
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

  const mockRepository = {
    findAndCount: jest.fn(),
    metadata: {
      columns: [
        { propertyName: 'id' },
        { propertyName: 'courseName' },
        { propertyName: 'rating' },
        { propertyName: 'fullPrice' },
        { propertyName: 'offeredPrice' },
        { propertyName: 'kind' },
        { propertyName: 'level' },
        { propertyName: 'iesLogo' },
        { propertyName: 'iesName' },
      ],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated offers with default values', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockOffers, 2]);

      const filters: FilterOfferDto = {};
      const result = await service.findAll(filters);

      expect(result.data).toHaveLength(2);
      expect(result.metadata.totalItems).toBe(2);
      expect(result.metadata.currentPage).toBe(1);
      expect(result.metadata.itemsPerPage).toBe(10);
      expect(result.metadata.totalPages).toBe(1);
    });

    it('should apply pagination correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockOffers[0]], 2]);

      const filters: FilterOfferDto = {
        page: 1,
        limit: 1,
      };
      const result = await service.findAll(filters);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        take: 1,
        skip: 0,
      });
      expect(result.metadata.itemsPerPage).toBe(1);
      expect(result.metadata.totalPages).toBe(2);
    });

    it('should filter by courseName (case-insensitive)', async () => {
      const filteredOffers = [mockOffers[0]];
      mockRepository.findAndCount.mockResolvedValue([filteredOffers, 1]);

      const filters: FilterOfferDto = {
        courseName: 'medicina',
      };
      await service.findAll(filters);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining<Record<string, unknown>>({
          where: expect.objectContaining<Record<string, unknown>>({
            courseName: expect.anything(),
          }),
        }),
      );
    });

    it('should filter by kind', async () => {
      const filteredOffers = [mockOffers[0]];
      mockRepository.findAndCount.mockResolvedValue([filteredOffers, 1]);

      const filters: FilterOfferDto = {
        kind: 'presencial',
      };
      await service.findAll(filters);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining<Record<string, unknown>>({
          where: { kind: 'presencial' },
        }),
      );
    });

    it('should apply sorting correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockOffers, 2]);

      const filters: FilterOfferDto = {
        sortBy: 'rating',
        orderBy: 'DESC',
      };
      await service.findAll(filters);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining<Record<string, unknown>>({
          order: { rating: 'DESC' },
        }),
      );
    });

    it('should select specific fields', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockOffers[0]], 1]);

      const filters: FilterOfferDto = {
        fields: 'courseName,offeredPrice',
      };
      await service.findAll(filters);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining<Record<string, unknown>>({
          select: expect.arrayContaining(['courseName', 'offeredPrice']),
        }),
      );
    });
  });

  describe('formatOfferResponse', () => {
    it('should format prices correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockOffers[0]], 1]);

      const result = await service.findAll({});
      const formattedOffer = result.data[0];

      expect(formattedOffer.fullPrice).toMatch(/R\$\s*1\.200,00/);
      expect(formattedOffer.offeredPrice).toMatch(/R\$\s*876,00/);
    });

    it('should format kinds correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockOffers[0]], 1]);
      const result1 = await service.findAll({});
      expect(result1.data[0].kind).toBe('Presencial 🏫');

      mockRepository.findAndCount.mockResolvedValue([[mockOffers[1]], 1]);
      const result2 = await service.findAll({});
      expect(result2.data[0].kind).toBe('EaD 🏠');
    });

    it('should format levels correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockOffers[0]], 1]);
      const result1 = await service.findAll({});
      expect(result1.data[0].level).toBe('Graduação (bacharelado) 🎓');

      mockRepository.findAndCount.mockResolvedValue([[mockOffers[1]], 1]);
      const result2 = await service.findAll({});
      expect(result2.data[0].level).toBe('Graduação (tecnólogo) 🎓');
    });

    it('should calculate discount percentage correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockOffers[0]], 1]);

      const result = await service.findAll({});
      const formattedOffer = result.data[0];

      expect(formattedOffer.discountPercentage).toBe('27%');
    });
  });

  it('should handle empty results', async () => {
    mockRepository.findAndCount.mockResolvedValue([[], 0]);

    const result = await service.findAll({ courseName: 'nonexistent' });

    expect(result.data).toHaveLength(0);
    expect(result.metadata.totalItems).toBe(0);
    expect(result.metadata.totalPages).toBe(0);
  });
});
