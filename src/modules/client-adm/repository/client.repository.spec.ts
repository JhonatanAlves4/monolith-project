import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a client", async () => {
    const client = await ClientModel.create({
      id: "1",
      name: "Jhonatan",
      email: "jhonatan4alves@gmail.com",
      address: {
        street: "Street",
        city: "City",
        complement: "Complement",
        number: "0298",
        state: "State",
        zipCode: "000",
      },
      document: "0297",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    const result = await clientRepository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address.city).toEqual(client.address.city);
    expect(result.address.complement).toEqual(client.address.complement);
    expect(result.address.number).toEqual(client.address.number);
    expect(result.address.state).toEqual(client.address.state);
    expect(result.address.street).toEqual(client.address.street);
    expect(result.address.zipCode).toEqual(client.address.zipCode);
    expect(result.document).toEqual(client.document);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });

  it("should create a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Jhonatan",
      email: "jhonatan4alves@gmail.com",
      address: new Address({
        street: "Street",
        city: "City",
        complement: "Complement",
        number: "0298",
        state: "State",
        zipCode: "000",
      }),
      document: "0297",
    });

    const clientRepository = new ClientRepository();
    await clientRepository.add(client);

    const clientDb = await ClientModel.findOne({ where: { id: "1" } });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(client.id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.address.city).toEqual(client.address.city);
    expect(clientDb.address.complement).toEqual(client.address.complement);
    expect(clientDb.address.number).toEqual(client.address.number);
    expect(clientDb.address.state).toEqual(client.address.state);
    expect(clientDb.address.street).toEqual(client.address.street);
    expect(clientDb.address.zipCode).toEqual(client.address.zipCode);
    expect(clientDb.document).toEqual(client.document);
    expect(clientDb.createdAt).toEqual(client.createdAt);
    expect(clientDb.updatedAt).toEqual(client.updatedAt);
  });
});
