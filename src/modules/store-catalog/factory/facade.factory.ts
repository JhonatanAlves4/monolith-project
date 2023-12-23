import StoreCatalogFacade from "../facade/store-catalog.facade";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUsecase from "../usecase/find-product/find-product.usecase";

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findAllUsecase = new FindAllProductsUsecase(productRepository);
    const findUsecase = new FindProductUsecase(productRepository);

    const facade = new StoreCatalogFacade({
      findAllUsecase: findAllUsecase,
      findUsecase: findUsecase,
    });

    return facade;
  }
}
