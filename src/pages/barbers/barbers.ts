import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-barbers',
  templateUrl: 'barbers.html'
})
export class BarbersPage {

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider
  ) { }

}
