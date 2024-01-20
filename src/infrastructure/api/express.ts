import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { ProductModel as CheckoutOrderModel } from "../../modules/checkout/repository/product.model";
import { ProductModel as StoreCatalogProductModel } from "../../modules/store-catalog/repository/product.model";
import { clientsRoute } from "./routes/client.route";
import { InvoiceItemsModel } from "../../modules/invoice/repository/invoice-items.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { productsRoute } from "./routes/product.route";
import { invoiceRoute } from "./routes/invoice.route";
import { checkoutRoute } from "./routes/checkout.route";

export const app: Express = express();

app.use(express.json());
app.use("/products", productsRoute);
app.use("/clients", clientsRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    ClientModel,
    InvoiceModel,
    InvoiceItemsModel,
    OrderModel,
    TransactionModel,
    CheckoutOrderModel,
    StoreCatalogProductModel,
    ProductModel,
  ]);
  await sequelize.sync();
}
setupDb();
