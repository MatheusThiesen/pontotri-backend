import { Either, right } from "@/core/either";
import { Product } from "../../entities/product";
import { ProductsRepository } from "../repositories/products-repository";

interface CreateProductUseCaseRequest {
  description: string;
}

type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product;
  }
>;

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    description,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      description,
    });

    await this.productsRepository.create(product);

    return right({ product });
  }
}
