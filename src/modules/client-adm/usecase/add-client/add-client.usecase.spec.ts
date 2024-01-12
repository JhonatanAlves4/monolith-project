import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import AddClientUsecase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add client Usecase unit test", () => {
  it("should add a client", async () => {
    const clientRepository = MockRepository();
    const usecase = new AddClientUsecase(clientRepository);

    const input = {
      name: "Client name",
      email: "client@gmail.com",
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

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);
    expect(result.document).toEqual(input.document);
  });
});
