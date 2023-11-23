import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUsecase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product Name",
  description: "Product Description",
  purchasePrice: 20,
  stock: 90,
});

const MockRepostory = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("Check stock usecase test", () => {
  it("should get stock of a product", async () => {
    const productRepository = MockRepostory();
    const checkStockUsecase = new CheckStockUsecase(productRepository);

    const input = {
      productId: "1",
    };

    const result = await checkStockUsecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.productId).toBe("1");
    expect(result.stock).toBe(90);
  });
});
