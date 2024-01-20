import express, { Request, Response } from 'express';
import ProductRepository from '../../../modules/product-adm/repository/product.repository';
import { AddProductInputDto } from '../../../modules/product-adm/usecase/add-product/add-product.dto';
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase';

export const productsRoute = express.Router();

productsRoute.post('/', async (req: Request, res: Response) => {
  const usecase = new AddProductUseCase(new ProductRepository());
  const productDto: AddProductInputDto = {
    name: req.body.name,
    description: req.body.description,
    stock: req.body.stock,
    purchasePrice: req.body.purchasePrice,
  };
  const output = await usecase.execute(productDto);
  res.send(output);
});