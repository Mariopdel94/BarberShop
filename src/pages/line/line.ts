import { HomeDataProvider } from './../../providers/home-data/home-data';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-line',
  templateUrl: 'line.html'
})
export class LinePage {

  constructor(
    public navCtrl: NavController,
    public homeDataProvider: HomeDataProvider
  ) { }

}
