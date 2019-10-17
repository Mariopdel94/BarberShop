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
  @ViewChild('customerForm') public customerForm: NgForm; // The customer NgForm, will be used to reset the form when submitting.
  public customer = new Customer(); // The customer object created on the form
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
  public selectedBarber: Barber = this.barbers[0]; // This will make the form have a preselected option on the dropdown.

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public homeDataProvider: HomeDataProvider
  ) {}

  public onSubmit() {
    /*
      When clicking on submit button, increment the place in line of the customers and assign it to the new customer.
      Can't be the ID because the ID will never stop incrementing, but the place in line could be 1 multiple times.
    */
    this.customer.placeInLine = ++this.homeDataProvider.currentCustomers;
    this.seatCustomer();
  }

  private resetForm() {
    this.customerForm.reset();
    this.selectedBarber = this.barbers[0];
  }

  private async seatCustomer() {
    /* First assign the message that will be displayed on the alert. The message changes if the customer selected a prefered barber or not */
    let message = `Hello ${this.customer.fullName}! Your customer number is ${this.customer.placeInLine}.`;
    if (this.selectedBarber.id) {
      message = `Hello ${this.customer.fullName}! Your customer number is ${this.customer.placeInLine}. You are waiting for ${this.selectedBarber.name}`;
    }

    /* Create the alert and reset the form if user accepts. If user cancels, leave the form as it is, in case the customer wants to make any changes. */
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

    /* Display the alert */
    await alert.present();
  }


}
