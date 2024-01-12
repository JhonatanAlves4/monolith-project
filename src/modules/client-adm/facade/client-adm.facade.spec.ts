import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import ClientAdmFacadeFactory from "../factory/facade.factory";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";

describe("ClientAdmFacade test", () => {
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

  it("should create a client", async () => {
    const repository = new ClientRepository();
    const addUsecase = new AddClientUsecase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: undefined,
    });

    const input = {
      id: "1",
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
    };

    await facade.add(input);

    const clientDb = await ClientModel.findOne({ where: { id: "1" } });

    expect(clientDb).toBeDefined();
    expect(clientDb.name).toBe(input.name);
    expect(clientDb.email).toBe(input.email);
    expect(clientDb.address.city).toEqual(input.address.city);
    expect(clientDb.address.complement).toEqual(input.address.complement);
    expect(clientDb.address.number).toEqual(input.address.number);
    expect(clientDb.address.state).toEqual(input.address.state);
    expect(clientDb.address.street).toEqual(input.address.street);
    expect(clientDb.address.zipCode).toEqual(input.address.zipCode);
    expect(clientDb.document).toEqual(input.document);
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();
    
    const input = {
      id: "1",
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
    };

    await facade.add(input);

    const clientDb = await facade.find({ id: "1" });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(input.id);
    expect(clientDb.name).toBe(input.name);
    expect(clientDb.email).toBe(input.email);
    expect(clientDb.address.city).toEqual(input.address.city);
    expect(clientDb.address.complement).toEqual(input.address.complement);
    expect(clientDb.address.number).toEqual(input.address.number);
    expect(clientDb.address.state).toEqual(input.address.state);
    expect(clientDb.address.street).toEqual(input.address.street);
    expect(clientDb.address.zipCode).toEqual(input.address.zipCode);
    expect(clientDb.document).toEqual(input.document);
  });
});
