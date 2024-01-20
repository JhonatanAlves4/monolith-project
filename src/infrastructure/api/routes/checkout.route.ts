import express, { Request, Response } from "express";
import CheckoutRepository from "../../../modules/checkout/repository/checkout.repository";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  const checkoutRepository = new CheckoutRepository();
  const clientFacade = ClientAdmFacadeFactory.create();
  const productFacade = ProductAdmFacadeFactory.create();
  const catalogFacade = StoreCatalogFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();
  const paymentFacade = PaymentFacadeFactory.create();

  const usecase = new PlaceOrderUseCase(
    checkoutRepository,
    clientFacade,
    productFacade,
    catalogFacade,
    invoiceFacade,
    paymentFacade
  );

  try {
    const input = {
      clientId: req.body.clientId,
      products: req.body.products,
    };
    const output = await usecase.execute(input);
    res.send(output);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
