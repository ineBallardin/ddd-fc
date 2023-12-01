import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";


export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const order = await OrderModel.findByPk(entity.id);
    if (!order) {
      throw new Error('Order not found');
    }
    await order.update({
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    });
  }

  async find(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
        where: { id },
        include: ["items"],
    });
    const list: OrderItem[] = [];
    order.items.map((item) => {
        let i = new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
        );
        list.push(i);
    });
    return new Order(order.id, order.customer_id, list);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"],

    });
  
    const orders: Order[] = orderModels.map(orderModel => {
      const items: OrderItem[] = orderModel.items.map(item => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      ));
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  
    return orders;
  }
  
  
 
}
