import { Barber } from './../../app/models/barber.model';
import { Customer } from '../../app/models/customer.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DataProvider {
  public customerLine: Customer[] = [];
  public barbers: Barber[] = [
    {
      id: 0,
      name: 'First one available'
    },
    {
      id: 1,
      name: 'Joe'
    },
    {
      id: 2,
      name: 'Gary'
    },
    // {
    //   id: 3,
    //   name: 'Jane Doe'
    // }
  ].map(barber => Barber.parse(barber)); // Let's parse it so we transform it into a Barber object
  public barberBusyTime: Subject<Barber> = new Subject();
  public barberDoneWithCustomer: Subject<Barber> = new Subject();

  constructor() { }

}
