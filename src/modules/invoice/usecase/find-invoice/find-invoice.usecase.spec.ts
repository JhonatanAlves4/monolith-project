import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import FindInvoiceUsecase from "./find-invoice.usecase";

const invoice = {
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
  total: 42,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("FindInvoiceUsecase unit test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUsecase(invoiceRepository);

    const input = {
      id: invoice.id.id,
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items[0].id).toEqual(invoice.items[0].id.id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id).toEqual(invoice.items[1].id.id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
    expect(result.total).toEqual(invoice.total);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
