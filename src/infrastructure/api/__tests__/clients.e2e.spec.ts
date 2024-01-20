import { app, sequelize } from "../express";
import request from "supertest";
import Address from "../../../modules/@shared/domain/value-object/address.value-object";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const input = {
      name: "Client name",
      document: "12345678901",
      email: "jhonatan4alves@gmail.com",
      address: {
        street: "Rodovia",
        city: "Florianópolis",
        complement: "Complemento",
        number: "4755",
        state: "SC",
        zipCode: "77283-836",
      },
    };
    const response = await request(app).post("/clients").send(input);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(input.name);
    expect(response.body.document).toBe(input.document);
    expect(response.body.email).toBe(input.email);
    expect(response.body.address._city).toEqual(input.address.city);
    expect(response.body.address._complement).toEqual(input.address.complement);
    expect(response.body.address._number).toEqual(input.address.number);
    expect(response.body.address._state).toEqual(input.address.state);
    expect(response.body.address._street).toEqual(input.address.street);
    expect(response.body.address._zipCode).toEqual(input.address.zipCode);
  });
});
