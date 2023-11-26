import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductDto } from "./find-all-product.dto";

export default class FindAllProductsUsecase {
  constructor(private productRepository: ProductGateway) {}

  async execute(): Promise<FindAllProductDto> {
    const products = await this.productRepository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
