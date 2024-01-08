import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemsModel } from "./invoice-items.model";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
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
    const invoiceProps = {
      id: new Id("1"),
      name: "Invoice name",
      document: "Document",
      address: new Address({
        street: "Rodovia",
        city: "Florianópolis",
        complement: "Complemento",
        number: "4755",
        state: "SC",
        zipCode: "77283-836",
      }),
      items: [
        new InvoiceItems(new Id("1"), "Item name", 20),
        new InvoiceItems(new Id("2"), "Item name 2", 22),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const invoice = new Invoice(invoiceProps);

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: [{ model: InvoiceItemsModel }],
    });

    expect(invoiceDb.id).toEqual(invoiceProps.id.id);
    expect(invoiceDb.name).toEqual(invoiceProps.name);
    expect(invoiceDb.document).toEqual(invoiceProps.document);
    expect(invoiceDb.address.street).toEqual(invoiceProps.address.street);
    expect(invoiceDb.address.city).toEqual(invoiceProps.address.city);
    expect(invoiceDb.address.complement).toEqual(
      invoiceProps.address.complement
    );
    expect(invoiceDb.address.number).toEqual(invoiceProps.address.number);
    expect(invoiceDb.address.state).toEqual(invoiceProps.address.state);
    expect(invoiceDb.address.zipCode).toEqual(invoiceProps.address.zipCode);
    expect(invoiceDb.items[0].id).toEqual(invoiceProps.items[0].id.id);
    expect(invoiceDb.items[0].name).toEqual(invoiceProps.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoiceProps.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(invoiceProps.items[1].id.id);
    expect(invoiceDb.items[1].name).toEqual(invoiceProps.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoiceProps.items[1].price);
    expect(invoiceDb.createdAt).toEqual(invoiceProps.createdAt);
    expect(invoiceDb.updatedAt).toEqual(invoiceProps.updatedAt);
  });

  it("should find an invoice", async () => {
    const invoiceProps = {
      id: new Id("1"),
      name: "Invoice name",
      document: "Document",
      address: new Address({
        street: "Rodovia",
        city: "Florianópolis",
        complement: "Complemento",
        number: "4755",
        state: "SC",
        zipCode: "77283-836",
      }),
      items: [
        new InvoiceItems(new Id("1"), "Item name", 20),
        new InvoiceItems(new Id("2"), "Item name 2", 22),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const invoice = new Invoice(invoiceProps);

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoice);

    const invoiceDb = await invoiceRepository.find(invoice.id.id);

    expect(invoice.id.id).toEqual(invoiceDb.id.id);
    expect(invoice.name).toEqual(invoiceDb.name);
    expect(invoice.document).toEqual(invoiceDb.document);
    expect(invoice.address).toEqual(invoiceDb.address);
    expect(invoice.items[0].id.id).toEqual(invoiceDb.items[0].id.id);
    expect(invoice.items[0].name).toEqual(invoiceDb.items[0].name);
    expect(invoice.items[0].price).toEqual(invoiceDb.items[0].price);
    expect(invoice.createdAt).toEqual(invoiceDb.createdAt);
    expect(invoice.updatedAt).toEqual(invoiceDb.updatedAt);
  });
});
