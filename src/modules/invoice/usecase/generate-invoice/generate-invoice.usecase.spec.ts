import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate invoice unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(repository);

    const input = {
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

    const result = await usecase.execute(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.total).toBe(15);
  });
});
