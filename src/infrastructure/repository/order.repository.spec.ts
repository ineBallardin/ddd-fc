import { Sequelize } from "sequelize-typescript";
import OrderRepository from "./order.repository";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("01", "Product 1", 100);
    await productRepository.create(product1);

    const product2 = new Product("02", "Product 2", 200);
    await productRepository.create(product2);

    const product3 = new Product("03", "Product 3", 300);
    await productRepository.create(product3);

    const orderItem1 = new OrderItem(
      "001",
      "Order Item 1",
      product1.price,
      product1.id,
      1
    );
    const orderItem2 = new OrderItem(
      "002",
      "Order Item 2",
      product2.price,
      product2.id,
      2
    );

    const order = new Order("0001", customer.id, [orderItem1, orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    await sequelize.transaction(async (t) => {
      OrderItemModel.destroy({
        where: { order_id: order.id },
      });
      const items = order.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: order.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t });
      await OrderModel.update(
        { total: order.total() },
        { where: { id: order.id }, transaction: t }
      );
    });

    const orderItem3 = new OrderItem(
      "003",
      "Order Item 3",
      product3.price,
      product3.id,
      1
    );

    order.addItem(orderItem3);

    await orderRepository.update(order);

    const updatedOrder = await orderRepository.find(order.id);

    expect(updatedOrder.items.length).toBe(3);
    expect(updatedOrder.total()).toBe(order.total());

    order.removeItem(orderItem1.id);
    order.removeItem(orderItem2.id);

    await orderRepository.update(order);

    const updatedOrder2 = await orderRepository.find(order.id);

    expect(updatedOrder2.items.length).toBe(1);
    expect(updatedOrder2.total()).toBe(order.total());
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("01", "Product 1", 100);
    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "001",
      "Order Item 1",
      product1.price,
      product1.id,
      1
    );

    const orderRepository = new OrderRepository();
    const order = new Order("O001", customer.id, [orderItem1]);
    await orderRepository.create(order);

    const orderFound = await orderRepository.find(order.id);

    expect(orderFound).toEqual(order);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    console.log(`customer: ${customer}`);

    const productRepository = new ProductRepository();
    const product1 = new Product("01", "Product 1", 10);
    await productRepository.create(product1);
    console.log(`product1: ${product1}`);

    const product2 = new Product("02", "Product 2", 20);
    await productRepository.create(product2);
    console.log(`product2: ${product2}`);

    const orderItem1 = new OrderItem(
      "001",
      product1.name,
      product1.price,
      product1.id,
      1
    );
    console.log(`orderItem1: ${orderItem1}`);

    const orderItem2 = new OrderItem(
      "002",
      product2.name,
      product2.price,
      product2.id,
      2
    );
    console.log(`orderItem2: ${orderItem2}`);

    const order = new Order("0001", customer.id, [orderItem1, orderItem2]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    console.log(`order:${order}`);

    const orders = await orderRepository.findAll();
    console.log(`orders: ${[orders]}`)
    expect(orders).toEqual([order]);
  });
})
