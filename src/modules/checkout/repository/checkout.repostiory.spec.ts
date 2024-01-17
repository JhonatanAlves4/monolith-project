import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import { ClientModel } from "./client.model";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

const mockDate = new Date(2000, 1, 1);
describe("CheckoutRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, ClientModel, ProductModel]);
    await sequelize.sync();
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add an order", async () => {
    const orderProps = {
      id: new Id("1"),
      client: new Client({
        id: new Id("1"),
        name: "Client 1",
        email: "x@x.com",
        document: "document 1",
        address: new Address({
          street: "Rodovia",
          city: "Florianópolis",
          complement: "Complemento",
          number: "4755",
          state: "SC",
          zipCode: "77283-836",
        }),
      }),
      products: [
        new Product({
          id: new Id("1"),
          name: "item 1",
          description: "description 1",
          salesPrice: 10,
        }),
        new Product({
          id: new Id("2"),
          name: "item 2",
          description: "description 2",
          salesPrice: 20,
        }),
      ],
      status: "status 1",
    };

    const order = new Order(orderProps);
    const checkoutRepository = new CheckoutRepository();
    await checkoutRepository.addOrder(order);

    const checkoutDb = await OrderModel.findOne({
      where: { id: orderProps.id.id },
      include: [ClientModel, ProductModel],
    });

    expect(orderProps.id.id).toEqual(checkoutDb.id);
    expect(orderProps.client.id.id).toEqual(checkoutDb.client.id);
    expect(orderProps.client.name).toEqual(checkoutDb.client.name);
    expect(orderProps.client.email).toEqual(checkoutDb.client.email);
    expect(orderProps.client.document).toEqual(checkoutDb.client.document);
    expect(orderProps.client.address.street).toEqual(
      checkoutDb.client.address.street
    );
    expect(orderProps.client.address.city).toEqual(
      checkoutDb.client.address.city
    );
    expect(orderProps.client.address.complement).toEqual(
      checkoutDb.client.address.complement
    );
    expect(orderProps.client.address.number).toEqual(
      checkoutDb.client.address.number
    );
    expect(orderProps.client.address.state).toEqual(
      checkoutDb.client.address.state
    );
    expect(orderProps.client.address.zipCode).toEqual(
      checkoutDb.client.address.zipCode
    );
    expect(orderProps.products).toStrictEqual([
      new Product({
        id: new Id(checkoutDb.products[0].id),
        name: checkoutDb.products[0].name,
        description: checkoutDb.products[0].description,
        salesPrice: checkoutDb.products[0].salesPrice,
      }),
      new Product({
        id: new Id(checkoutDb.products[1].id),
        name: checkoutDb.products[1].name,
        description: checkoutDb.products[1].description,
        salesPrice: checkoutDb.products[1].salesPrice,
      }),
    ]);
    expect(orderProps.status).toEqual(checkoutDb.status);
  });

  it("should find an order", async () => {
    const checkoutRepository = new CheckoutRepository();

    await OrderModel.create(
      {
        id: "1",
        client: new ClientModel({
          id: "1",
          name: "Client 1",
          email: "x@x.com",
          document: "document 1",
          address: {
            street: "Rodovia",
            city: "Florianópolis",
            complement: "Complemento",
            number: "4755",
            state: "SC",
            zipCode: "77283-836",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          orderId: "1",
        }),
        products: [
          new ProductModel({
            id: "1",
            name: "item 1",
            description: "description 1",
            salesPrice: 10,
            orderId: "1",
          }),
          new ProductModel({
            id: "2",
            name: "item 2",
            description: "description 2",
            salesPrice: 20,
            orderId: "1",
          }),
        ],
        status: "status 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [ClientModel, ProductModel] }
    );

    const checkout = await checkoutRepository.findOrder("1");

    expect(checkout.id.id).toEqual("1");
    expect(checkout.client.name).toEqual("Client 1");
    expect(checkout.client.email).toEqual("x@x.com");
    expect(checkout.client.document).toEqual("document 1");
    expect(checkout.client.address.street).toEqual("Rodovia");
    expect(checkout.client.address.city).toEqual("Florianópolis");
    expect(checkout.client.address.complement).toEqual("Complemento");
    expect(checkout.client.address.number).toEqual("4755");
    expect(checkout.client.address.state).toEqual("SC");
    expect(checkout.client.address.zipCode).toEqual("77283-836");
    expect(checkout.products).toStrictEqual([
      new Product({
        id: new Id("1"),
        name: "item 1",
        description: "description 1",
        salesPrice: 10,
      }),
      new Product({
        id: new Id("2"),
        name: "item 2",
        description: "description 2",
        salesPrice: 20,
      }),
    ]);
    expect(checkout.status).toEqual("status 1");
  });
});
