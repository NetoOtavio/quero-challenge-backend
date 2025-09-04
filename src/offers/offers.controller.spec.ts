import { Test, TestingModule } from '@nestjs/testing';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { FilterOfferDto } from './dto/filter-offer.dto';
import { PaginatedOffersResponseDto } from './dto/paginated-offers.respons.dto';

describe('OffersController', () => {
  let controller: OffersController;

  const mockOffersService = {
    findAll: jest.fn(),
  };

  const mockPaginatedResponse: PaginatedOffersResponseDto = {
    data: [
      {
        courseName: 'Medicina',
        rating: 4.8,
        fullPrice: 'R$ 1.200,00',
        offeredPrice: 'R$ 876,00',
        discountPercentage: '27%',
        kind: 'Presencial 🏫',
        level: 'Graduação (bacharelado) 🎓',
        iesLogo: 'https://example.com/logo1.png',
        iesName: 'Universidade Federal',
      },
      {
        courseName: 'Engenharia Civil',
        rating: 4.5,
        fullPrice: 'R$ 800,00',
        offeredPrice: 'R$ 600,00',
        discountPercentage: '25%',
        kind: 'EaD 🏠',
        level: 'Graduação (tecnólogo) 🎓',
        iesLogo: 'https://example.com/logo2.png',
        iesName: 'Universidade Tecnológica',
      },
    ],
    metadata: {
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        {
          provide: OffersService,
          useValue: mockOffersService,
        },
      ],
    }).compile();

    controller = module.get<OffersController>(OffersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return paginated offers', async () => {
      mockOffersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const filters: FilterOfferDto = {};
      const result = await controller.findAll(filters);

      expect(mockOffersService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockPaginatedResponse);
      expect(result.data).toHaveLength(2);
      expect(result.metadata.totalItems).toBe(2);
    });

    it('should handle basic filtering', async () => {
      const filteredResponse = {
        data: [mockPaginatedResponse.data[0]],
        metadata: {
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: 10,
        },
      };
      mockOffersService.findAll.mockResolvedValue(filteredResponse);

      const filters: FilterOfferDto = {
        courseName: 'medicina',
        kind: 'presencial',
      };
      const result = await controller.findAll(filters);

      expect(mockOffersService.findAll).toHaveBeenCalledWith(filters);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].courseName).toBe('Medicina');
    });

    it('should handle pagination parameters', async () => {
      const paginatedResponse = {
        ...mockPaginatedResponse,
        metadata: {
          totalItems: 25,
          totalPages: 5,
          currentPage: 2,
          itemsPerPage: 5,
        },
      };
      mockOffersService.findAll.mockResolvedValue(paginatedResponse);

      const filters: FilterOfferDto = { page: 2, limit: 5 };
      const result = await controller.findAll(filters);

      expect(mockOffersService.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
      });
      expect(result.metadata.currentPage).toBe(2);
      expect(result.metadata.itemsPerPage).toBe(5);
    });

    it('should handle field selection', async () => {
      const partialResponse = {
        data: [
          {
            courseName: 'Medicina',
            offeredPrice: 'R$ 876,00',
          },
        ],
        metadata: {
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: 10,
        },
      };
      mockOffersService.findAll.mockResolvedValue(partialResponse);

      const filters: FilterOfferDto = { fields: 'courseName,offeredPrice' };
      const result = await controller.findAll(filters);

      expect(mockOffersService.findAll).toHaveBeenCalledWith({
        fields: 'courseName,offeredPrice',
      });
      expect(result.data[0]).toHaveProperty('courseName');
      expect(result.data[0]).toHaveProperty('offeredPrice');
      expect(result.data[0]).not.toHaveProperty('rating');
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database connection failed');
      mockOffersService.findAll.mockRejectedValue(error);

      const filters: FilterOfferDto = {};

      await expect(controller.findAll(filters)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockOffersService.findAll).toHaveBeenCalledWith(filters);
    });
  });
});
