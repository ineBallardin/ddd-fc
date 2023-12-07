import Address from "../entity/address";
import EventInterface from "../event/@shared/event.interface";

export default class CustomerChangedAddressEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: { id: string, name: string, address: Address };

  constructor(eventData: { id: string, name: string, address: Address }) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
