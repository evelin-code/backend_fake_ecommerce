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

  describe('calculateSubtotal', () => {
    it('should return the total value when all products are available', async () => {
      const items = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ];
      const mockProducts = [
        { id: 1, price: 100, stock: 10 } as Product,
        { id: 2, price: 200, stock: 20 } as Product
      ];
      jest.spyOn(repository, 'findOneBy').mockImplementation(async (criteria) => {
        const product = mockProducts.find(p => p.id === (criteria as any).id);
        return product || null;
      });

      const result = await service.calculateSubtotal(items);
      expect(result).toEqual(ProductConstants.TOTAL_CALCULATED(400));
    });

    it('should return OUT_OF_STOCK when some products are out of stock', async () => {
      const items = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 30 }
      ];
      const mockProducts = [
        { id: 1, price: 100, stock: 10 } as Product,
        { id: 2, price: 200, stock: 20 } as Product
      ];
      jest.spyOn(repository, 'findOneBy').mockImplementation(async (criteria) => {
        const product = mockProducts.find(p => p.id === (criteria as any).id);
        return product || null;
      });

      const result = await service.calculateSubtotal(items);
      expect(result).toEqual(ProductConstants.OUT_OF_STOCK([2]));
    });

    it('should return PRODUCT_NOT_FOUND when a product is not found', async () => {
      const items = [
        { productId: 1, quantity: 2 },
        { productId: 999, quantity: 1 }
      ];
      const mockProducts = [
        { id: 1, price: 100, stock: 10 } as Product
      ];
      jest.spyOn(repository, 'findOneBy').mockImplementation(async (criteria) => {
        const product = mockProducts.find(p => p.id === (criteria as any).id);
        return product || null;
      });

      const result = await service.calculateSubtotal(items);
      expect(result).toEqual(ProductConstants.PRODUCT_NOT_FOUND);
    });

    it('should return CALCULATION_FAILED on exception', async () => {
      const items = [
        { productId: 1, quantity: 2 }
      ];
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      const result = await service.calculateSubtotal(items);
      expect(result).toEqual(ProductConstants.CALCULATION_FAILED);
    });
  });
});
