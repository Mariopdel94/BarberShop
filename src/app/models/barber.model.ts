export class Barber {
  public id = 0;
  public name = '';

  constructor() {}

  public static parse(obj: any): Barber {
    return new Barber().set(obj);
  }

  public set(obj: any): this {
    this.id = Number(obj.id || this.id || 0);
    this.name = String(obj.name || this.name || '');
    return this;
  }

  public clone(): Barber {
    return new Barber().set(this);
  }

  public clear(): this {
    Object.keys(this).forEach((key) => {
      this[key] = null;
    });
    this.set({});
    return this;
  }
}