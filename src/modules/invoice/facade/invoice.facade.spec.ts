import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceFacadeFactory from "../factory/facade.factory";
import { InvoiceItemsModel } from "../repository/invoice-items.model";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const facadeUsecase = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Invoice name",
      document: "Invoice document",
      street: "Invoice street",
      number: "Invoice number",
      complement: "Invoice complement",
      city: "Invoice city",
      state: "Invoice state",
      zipCode: "Invoice zipCode",
      items: [
        { id: "1", name: "Item name", price: 10 },
        { id: "2", name: "Item name 2", price: 5 },
      ],
    };

    const output = await facadeUsecase.generate(input);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: output.id },
      include: [InvoiceItemsModel],
    });

    expect(invoiceDb.id).toBeDefined();
    expect(invoiceDb.name).toEqual(input.name);
    expect(invoiceDb.document).toEqual(input.document);
    expect(invoiceDb.address.street).toEqual(input.street);
    expect(invoiceDb.address.city).toEqual(input.city);
    expect(invoiceDb.address.complement).toEqual(input.complement);
    expect(invoiceDb.address.number).toEqual(input.number);
    expect(invoiceDb.address.state).toEqual(input.state);
    expect(invoiceDb.address.zipCode).toEqual(input.zipCode);
    expect(invoiceDb.items[0].id).toEqual(input.items[0].id);
    expect(invoiceDb.items[0].name).toEqual(input.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(input.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(input.items[1].id);
    expect(invoiceDb.items[1].name).toEqual(input.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(input.items[1].price);
  });

  it("should find an invoice", async () => {
    const facadeUsecase = InvoiceFacadeFactory.create();

    const invoice = {
      name: "Invoice name",
      document: "Invoice document",
      street: "Invoice street",
      number: "Invoice number",
      complement: "Invoice complement",
      city: "Invoice city",
      state: "Invoice state",
      zipCode: "Invoice zipCode",
      items: [
        { id: "1", name: "Item name", price: 10 },
        { id: "2", name: "Item name 2", price: 5 },
      ],
      total: 15,
    };

    const input = await facadeUsecase.generate(invoice);
    const output = await facadeUsecase.find({ id: input.id });

    expect(output.id).toBeDefined();
    expect(output.name).toEqual(invoice.name);
    expect(output.document).toEqual(invoice.document);
    expect(output.address.street).toEqual(invoice.street);
    expect(output.address.city).toEqual(invoice.city);
    expect(output.address.complement).toEqual(invoice.complement);
    expect(output.address.number).toEqual(invoice.number);
    expect(output.address.state).toEqual(invoice.state);
    expect(output.address.zipCode).toEqual(invoice.zipCode);
    expect(output.items[0].id).toEqual(invoice.items[0].id);
    expect(output.items[0].name).toEqual(invoice.items[0].name);
    expect(output.items[0].price).toEqual(invoice.items[0].price);
    expect(output.items[1].id).toEqual(invoice.items[1].id);
    expect(output.items[1].name).toEqual(invoice.items[1].name);
    expect(output.items[1].price).toEqual(invoice.items[1].price);
    expect(output.total).toEqual(invoice.total);
  });
});
