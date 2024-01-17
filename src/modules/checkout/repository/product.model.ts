import {
  Table,
  PrimaryKey,
  Column,
  ForeignKey,
  Model,
  BelongsTo,
} from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: true })
  declare orderId: string;

  @BelongsTo(() => OrderModel)
  declare order: ReturnType<() => OrderModel>;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: false })
  declare salesPrice: number;
}
