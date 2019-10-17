export class Customer {
  public id = 0;
  public fullName = '';
  public phoneNumber = '';
  public placeInLine = 0;

  constructor() {}

  public static parse(obj: any): Customer {
    return new Customer().set(obj);
  }

  public set(obj: any): this {
    this.id = Number(obj.id || this.id || 0);
    this.fullName = String(obj.fullName || this.fullName || '');
    this.phoneNumber = String(obj.phoneNumber || this.phoneNumber || '');
    this.placeInLine = Number(obj.placeInLine || this.placeInLine || 0);
    return this;
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
