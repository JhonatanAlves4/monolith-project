import Address from "../../../@shared/domain/value-object/address.value-object";

export interface AddClientInputDto {
  id?: string;
  name: string;
  email: string;
  address: Address;
  document: string;
}

export interface AddClientOutputDto {
  id: string;
  name: string;
  email: string;
  address: Address;
  document: string;
  createdAt: Date;
  updatedAt: Date;
}
