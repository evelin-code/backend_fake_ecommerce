import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './../product.service';
import { Product } from './../entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductConstants } from './../config/product.constants';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockProductRepository = () => ({
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepository() },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('getProductStock', () => {
    it('should return stock when product is found', async () => {
      const productId = 1;
      const mockProduct = { id: productId, stock: 10 };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockProduct as any);

      const result = await service.getProductStock(productId);
      expect(result).toEqual(ProductConstants.STOCK_FETCHED(mockProduct.stock));
    });

    it('should return PRODUCT_NOT_FOUND when product is not found', async () => {
      const productId = 1;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const result = await service.getProductStock(productId);
      expect(result).toEqual(ProductConstants.PRODUCT_NOT_FOUND);
    });

    it('should return STOCK_FETCH_FAILED on exception', async () => {
      const productId = 1;
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      const result = await service.getProductStock(productId);
      expect(result).toEqual(ProductConstants.STOCK_FETCH_FAILED);
    });
  });
});
