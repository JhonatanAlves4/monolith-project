import { Sequelize } from "sequelize-typescript";
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
      address: "Rodovia",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    const result = await clientRepository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });

  it("should create a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Jhonatan",
      email: "jhonatan4alves@gmail.com",
      address: "Rodovia",
    });

    const clientRepository = new ClientRepository();
    await clientRepository.add(client);

    const clientDb = await ClientModel.findOne({ where: { id: "1" } });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(client.id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.address).toBe(client.address);
    expect(clientDb.createdAt).toEqual(client.createdAt);
    expect(clientDb.updatedAt).toEqual(client.updatedAt);
  });
});
