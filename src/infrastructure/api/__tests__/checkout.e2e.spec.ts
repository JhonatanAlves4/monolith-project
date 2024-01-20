import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { ProductModel } from "../../../modules/checkout/repository/product.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { ClientModel as OrderClientModel } from "../../../modules/checkout/repository/client.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import { ProductModel as AdmProductModel } from "../../../modules/product-adm/repository/product.model";
import { ProductModel as StoreProductModel } from "../../../modules/store-catalog/repository/product.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import Id from "../../../modules/@shared/domain/value-object/id.value-object";
import CheckStockUsecase from "../../../modules/product-adm/usecase/check-stock/check-stock.usecase";
import GenerateInvoiceUseCase from "../../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase";
import CheckoutRepository from "../../../modules/checkout/repository/checkout.repository";
import { InvoiceItemsModel } from "../../../modules/invoice/repository/invoice-items.model";
import PlaceOrderUsecase from "../../../modules/checkout/usecase/place-order/place-order.usecase";

describe("E2E test for checkout", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      ProductModel,
      OrderModel,
      ClientModel,
      OrderClientModel,
      TransactionModel,
      AdmProductModel,
      StoreProductModel,
      InvoiceModel,
      InvoiceItemsModel,
    ]);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should place an order", async () => {
    const invoiceId = new Id();
    //@ts-expect-error - spy on private method
    jest.spyOn(CheckStockUsecase.prototype, "execute").mockImplementation(() => ({
      execute: jest.fn(({ productId }: { productId: string }) =>
        Promise.resolve({
          productId,
          stock: 10,
        })
      ),
    }));

    jest.spyOn(GenerateInvoiceUseCase.prototype, "execute").mockImplementation(
      // @ts-ignore
      jest.fn((invoice) => Promise.resolve({ id: invoiceId }))
      );

    //@ts-expect-error
    jest.spyOn(CheckoutRepository.prototype, "addOrder").mockImplementation(() => ({
      // @ts-ignore
      addOrder: jest.fn((order) =>
        Promise.resolve({
          id: new Id(),
          status: "approved",
          total: 100,
          products: [
            {
              productId: new Id(),
            },
          ],
        })
      ),
    }));

    await ClientModel.create({
      id: "1",
      name: "Jhonatan",
      email: "jhonatan4alves@gmail.com",
      document: "287923",
      address: {
        street: "Street",
        city: "City",
        complement: "Complement",
        number: "0298",
        state: "State",
        zipCode: "000",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await StoreProductModel.create({
      id: "1",
      name: "Product name",
      description: "Product description",
      salesPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [{ productId: "1" }],
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(100);
    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].productId).toBe("1");
    expect(GenerateInvoiceUseCase.prototype.execute).toHaveBeenCalled();
    expect(CheckoutRepository.prototype.addOrder).toHaveBeenCalled();
  });
});
