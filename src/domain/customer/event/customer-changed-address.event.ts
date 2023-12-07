import Address from "../value-object/address";
import EventInterface from "../../@shared/event/event.interface";

export default class CustomerChangedAddressEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: { id: string, name: string, address: Address };

  constructor(eventData: { id: string, name: string, address: Address }) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
