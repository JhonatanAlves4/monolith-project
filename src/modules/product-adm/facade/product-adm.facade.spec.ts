import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import { AddProductInputDto } from "../usecase/add-product/add-product.dto";
import AddProductUsecase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";

describe("ProductAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const addProductUsecase = new AddProductUsecase(productRepository);
    const productFacade = new ProductAdmFacade({
      addUseCase: addProductUsecase,
      stockUseCase: undefined,
    });

    const input: AddProductInputDto = {
      id: "1",
      name: "Product 1",
      purchasePrice: 10,
      stock: 10,
      description: "Product description",
    };

    await productFacade.addProduct(input);

    const product = await ProductModel.findOne({
      where: { id: "1" },
    });

    expect(product).toBeDefined();
    expect(product.id).toBe(input.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
  });
});
