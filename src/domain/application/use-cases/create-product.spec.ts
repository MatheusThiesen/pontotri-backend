import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { CreateProductUseCase } from "./create-product";

let inMemoryProductsRepository: InMemoryProductsRepository;

let sut: CreateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();

    sut = new CreateProductUseCase(inMemoryProductsRepository);
  });

  it("should be able to create a new product", async () => {
    const result = await sut.execute({
      description: "Test",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      product: inMemoryProductsRepository.items[0],
    });
  });
});
