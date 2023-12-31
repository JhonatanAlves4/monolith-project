import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class InvoiceItems extends BaseEntity {
  private _name: string;
  private _price: number;

  constructor(id: Id, name: string, price: number) {
    super(id);
    this._name = name;
    this._price = price;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
