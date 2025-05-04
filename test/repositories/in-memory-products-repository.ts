import { ProductsRepository } from "@/domain/application/repositories/products-repository";
import { Product } from "@/domain/entities/product";

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async create(product: Product) {
    this.items.push(product);
  }
}
