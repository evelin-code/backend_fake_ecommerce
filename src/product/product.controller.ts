import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';

@Controller('product')
export class ProductController {
  
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Get(':id/stock')
  async getProductStock(@Param('id') id: string) {
    return this.productService.getProductStock(+id);
  }

  @Post('calculate')
  async calculateSubtotal(@Body() body: { items: { productId: number; quantity: number }[] }) {
    return this.productService.calculateSubtotal(body.items);
  }
}