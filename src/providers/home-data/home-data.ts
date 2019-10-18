import { Customer } from './../../app/models/customer.model';
import { Injectable } from '@angular/core';

@Injectable()
export class HomeDataProvider {
  public customerLine: Customer[] = [];

  constructor() { }

}
