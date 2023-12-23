import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUsecase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUsecase: FindProductUsecase;
  findAllUsecase: FindAllProductsUsecase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findAllUsecase: FindAllProductsUsecase;
  private _findUsecase: FindProductUsecase;

  constructor(props: UseCaseProps) {
    this._findAllUsecase = props.findAllUsecase;
    this._findUsecase = props.findUsecase;
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUsecase.execute();
  }

  async find(
    id: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUsecase.execute(id);
  }
}
