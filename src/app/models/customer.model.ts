import { Barber } from './barber.model';

export class Customer {
  public id = '';
  public fullName = '';
  public phoneNumber = '';
  public selectedBarber: Barber = new Barber();
  public arrivalTime: Date;
  public eta = 0;

  constructor() {}

  public static parse(obj: any): Customer {
    return new Customer().set(obj);
  }

  public set(obj: any): this {
    this.id = this.uuidv4();
    this.fullName = String(obj.fullName || this.fullName || '');
    this.phoneNumber = String(obj.phoneNumber || this.phoneNumber || '');
    this.selectedBarber = Barber.parse(obj.selectedBarber || this.selectedBarber || new Barber());
    this.arrivalTime = obj.arrivalTime || this.arrivalTime || new Date();
    this.eta = Number(obj.eta || this.eta || 0);
    return this;
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public clone(): Customer {
    return new Customer().set(this);
  }

  public clear(): this {
    Object.keys(this).forEach((key) => {
      this[key] = null;
    });
    this.set({});
    return this;
  }
}
