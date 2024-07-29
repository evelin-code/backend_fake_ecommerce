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
}