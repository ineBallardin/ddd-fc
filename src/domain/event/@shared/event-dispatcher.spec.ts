import EnviaConsoleLog1Handler from "../../customer/handler/customer-created-handler-1";
import EnviaConsoleLog2Handler from "../../customer/handler/customer-created-handler-2";
import SendEmailWhenProductIsCreatedHandler from "../../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/product-created.event";
import EventDispatcher from "./event-dispatcher";
import CustomerCreatedEvent from '../../customer/customer-created.event';
import EnviaConsoleLogCustomerChangeAddressHandler from "../../customer/handler/customer-changed-address-handler";
import Customer from "../../entity/customer";
import Address from "../../entity/address";
import CustomerChangedAddressEvent from "../../customer/customer-changed-address.event";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandler1 = new EnviaConsoleLog1Handler()
    const eventHandler2 = new EnviaConsoleLog2Handler()
    const eventHandlerCustomerAddrChanged = new EnviaConsoleLogCustomerChangeAddressHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomerAddrChanged);

    eventDispatcher.getEventHandlers["ProductCreatedEvent"]

    // ProductCreatedEvent
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    // CustomerCreatedEvent
    eventDispatcher.getEventHandlers["CustomerCreatedEvent"]

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    // CustomerChangedAddressEvent
    eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandlerCustomerAddrChanged);

  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandler1 = new EnviaConsoleLog1Handler()
    const eventHandler2 = new EnviaConsoleLog2Handler()
    const eventHandlerCustomerAddrChanged = new EnviaConsoleLogCustomerChangeAddressHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomerAddrChanged);

    // ProductCreatedEvent
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );

    // CustomerCreatedEvent
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      0
    );

    // CustomerChangedAddressEvent
    eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandlerCustomerAddrChanged);

    eventDispatcher.unregister("CustomerChangedAddressEvent", eventHandlerCustomerAddrChanged);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandler1 = new EnviaConsoleLog1Handler()
    const eventHandler2 = new EnviaConsoleLog2Handler()
    const eventHandlerCustomerAddrChanged = new EnviaConsoleLogCustomerChangeAddressHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomerAddrChanged);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandlerCustomerAddrChanged);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeUndefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandler1 = new EnviaConsoleLog1Handler()
    const eventHandler2 = new EnviaConsoleLog2Handler()
    const eventHandlerCustomerAddrChanged = new EnviaConsoleLogCustomerChangeAddressHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomerAddrChanged);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customer = new Customer("customerId1", "Customer 1");
    customer.Address = new Address("Street 1", 1, "City Y", "12345-678");

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      street: customer.Address.street,
      number: customer.Address.number,
      zip: customer.Address.zip,
      city: customer.Address.city,
    })

    const newAddress = new Address("New Street", 2, "New City", "New Zip");
    customer.changeAddress(newAddress);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address
    });

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandlerCustomerAddrChanged);

    eventDispatcher.notify(productCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent);
    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
