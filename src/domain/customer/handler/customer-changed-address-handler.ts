import EventHandlerInterface from "../../event/@shared/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class EnviaConsoleLogCustomerChangeAddressHandler
  implements EventHandlerInterface<CustomerChangedAddressEvent>
{
  handle(event: CustomerChangedAddressEvent): void {
    console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`); 
  }
}
