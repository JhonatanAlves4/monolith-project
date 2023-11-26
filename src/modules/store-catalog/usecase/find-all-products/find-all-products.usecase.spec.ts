import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUsecase from "./find-all-products.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product name",
  description: "Product description",
  salesPrice: 20,
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product name 2",
  description: "Product description 2",
  salesPrice: 40,
});

const MockRepository = () => {
  return {
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
    find: jest.fn(),
  };
};

describe("find all products usecase unit test", () => {
  it("should find all products", async () => {
    const productRepository = MockRepository();
    const usecase = new FindAllProductsUsecase(productRepository);

    const result = await usecase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("1");
    expect(result.products[0].name).toBe("Product name");

    expect(result.products[1].id).toBe("2");
    expect(result.products[1].name).toBe("Product name 2");
  })
})