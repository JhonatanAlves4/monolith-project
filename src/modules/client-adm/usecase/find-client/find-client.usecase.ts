import ClientGateway from "../../gateway/client.gateway";
import {
  FindClientInputDto,
  FindClientOutputDto,
} from "./find-client.usecase.dto";

export default class FindClientUsecase {
  private _clientRepository: ClientGateway;

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const result = await this._clientRepository.find(input.id);

    const output = {
      id: result.id.id,
      name: result.name,
      email: result.email,
      address: result.address,
      document: result.document,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return output;
  }
}
