import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../../modules/invoice/repository/invoice-items.model";

describe("E2E test for invoice", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const { body: output, status } = await request(app)
      .post("/invoice")
      .send({
        name: "Invoice name",
        document: "Invoice document",
        street: "Client street",
        number: "Client number",
        complement: "Client complement",
        city: "Client city",
        state: "Client state",
        zipCode: "Client zipcode",
        items: [
          {
            id: "1",
            name: "product 1",
            price: 100,
          },
          {
            id: "2",
            name: "product 2",
            price: 200,
          },
        ],
      });

    expect(status).toBe(200);
    expect(output.name).toBe("Invoice name");
    expect(output.document).toBe("Invoice document");
    expect(output.street).toBe("Client street");
    expect(output.number).toBe("Client number");
    expect(output.complement).toBe("Client complement");
    expect(output.city).toBe("Client city");
    expect(output.state).toBe("Client state");
    expect(output.zipCode).toBe("Client zipcode");
    expect(output.items[0].name).toBe("product 1");
    expect(output.items[0].price).toBe(100);
    expect(output.items[1].name).toBe("product 2");
    expect(output.items[1].price).toBe(200);
    expect(output.total).toBe(300);

    const response = await request(app).get(
      `/invoice/${output.id}`
    );

    expect(response.status).toBe(200);
  });
});
