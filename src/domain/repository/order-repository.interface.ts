import Order from "../entity/order";
import RepositoryInterface from "./repository-interface";

export default interface CustomerRepositoryInterface
  extends RepositoryInterface<Order> {}
