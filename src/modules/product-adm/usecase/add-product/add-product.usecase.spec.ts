import Product from "../../domain/product.entity";
import { AddProductInputDto } from "./add-product.dto";
import AddProductUsecase from "./add-product.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add product usecase unit test", () => {
  it("should add an product", async () => {
    const productRepository = MockRepository();
    const usecase = new AddProductUsecase(productRepository);

    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 20,
      stock: 1,
    };
    const result = await usecase.execute(input);

    expect(productRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.purchasePrice).toBe(input.purchasePrice);
    expect(result.stock).toBe(input.stock);
  });
});
