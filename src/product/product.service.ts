import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { ProductConstants } from './config/product.constants';

@Injectable()
export class ProductService {
  
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductStock(productId: number): Promise<any> {
    try {
      const product = await this.productRepository.findOneBy({ id: productId });
      if (!product) {
        return ProductConstants.PRODUCT_NOT_FOUND;
      }
      
      return ProductConstants.STOCK_FETCHED(product.stock);
    } catch (error) {
      return ProductConstants.STOCK_FETCH_FAILED;
    }
  }

  async calculateSubtotal(items: { productId: number; quantity: number }[]): Promise<any> {
    try {
      let total = 0;
      const productPromises = items.map(async item => {
        const product = await this.productRepository.findOneBy({ id: item.productId });
        if (!product) {
          return ProductConstants.PRODUCT_NOT_FOUND;
        }
        if (product.stock < item.quantity) {
          return ProductConstants.OUT_OF_STOCK([item.productId]);
        }
        total += product.price * item.quantity;
        return null;
      });
  
      const results = await Promise.all(productPromises);
      const errorResults = results.filter(result => result && (result as any).status !== ProductConstants.TOTAL_CALCULATED(0).status);
  
      if (errorResults.length > 0) {
        return errorResults[0];
      }
  
      return ProductConstants.TOTAL_CALCULATED(total);
    } catch (error) {
      return ProductConstants.CALCULATION_FAILED;
    }
  }
}
