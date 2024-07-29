import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './../product.controller';
import { ProductService } from './../product.service';
import { Product } from './../entity/product.entity';
import { ProductConstants } from './../config/product.constants';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              { id: 1, name: 'Product A', description: 'Description A', stock: 10, url_img: 'url_a', price: 100 },
              { id: 2, name: 'Product B', description: 'Description B', stock: 20, url_img: 'url_b', price: 200 }
            ]),
            getProductStock: jest.fn().mockResolvedValue(ProductConstants.STOCK_FETCHED(10)),
            calculateSubtotal: jest.fn().mockResolvedValue(ProductConstants.TOTAL_CALCULATED(500)),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await productController.findAll();

      expect(productService.getAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Product A', description: 'Description A', stock: 10, url_img: 'url_a', price: 100 },
        { id: 2, name: 'Product B', description: 'Description B', stock: 20, url_img: 'url_b', price: 200 }
      ]);
    });
  });

  describe('getProductStock', () => {
    it('should return the stock of a product', async () => {
      const result = await productController.getProductStock('1');

      expect(productService.getProductStock).toHaveBeenCalledWith(1);
      expect(result).toEqual(ProductConstants.STOCK_FETCHED(10));
    });
  });

  describe('calculateSubtotal', () => {
    it('should return the subtotal value of products', async () => {
      const items = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ];
      const result = await productController.calculateSubtotal({ items });

      expect(productService.calculateSubtotal).toHaveBeenCalledWith(items);
      expect(result).toEqual(ProductConstants.TOTAL_CALCULATED(500));
    });
  });
});
