import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import {
  AddClientInputDto,
  AddClientOutputDto,
} from "./add-client.usecase.dto";

export default class AddClientUsecase {
  private _clientRepository: ClientGateway;

  constructor(clientRepositort: ClientGateway) {
    this._clientRepository = clientRepositort;
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      email: input.email,
      address: new Address({
        street: input.address.street,
        city: input.address.city,
        complement: input.address.complement,
        number: input.address.number,
        state: input.address.state,
        zipCode: input.address.zipCode,
      }),
      document: input.document,
    };

    const client = new Client(props);
    await this._clientRepository.add(client);

    const output: AddClientOutputDto = {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      document: client.document,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };

    return output;
  }
}
