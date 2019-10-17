import { HomeDataProvider } from './../../providers/home-data/home-data';
import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, AlertOptions } from 'ionic-angular';
import { Customer } from '../../app/models/customer.model';
import { Barber } from '../../app/models/barber.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('customerForm') public customerForm: NgForm;
  public customer = new Customer();
  public alertOptions: AlertOptions;
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
  ].map(barber => Barber.parse(barber));
  public selectedBarber: Barber = this.barbers[0];

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public homeDataProvider: HomeDataProvider
  ) {}

  public onSubmit() {
    this.customer.placeInLine = ++this.homeDataProvider.currentCustomers;
    this.seatCustomer();
  }

  private resetForm() {
    this.customerForm.reset();
    this.selectedBarber = this.barbers[0];
  }

  private async seatCustomer() {
    let message = `Hello ${this.customer.fullName}! Your customer number is ${this.customer.placeInLine}.`;
    if (this.selectedBarber.id) {
      message = `Hello ${this.customer.fullName}! Your customer number is ${this.customer.placeInLine}. You are waiting for ${this.selectedBarber.name}`;
    }
    const alert = await this.alertController.create({
      title: 'You are on line!',
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Ok clicked');
            this.resetForm();
          }
        }
      ]
    });
    await alert.present();
  }


}
