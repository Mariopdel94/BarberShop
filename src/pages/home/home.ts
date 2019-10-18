import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Customer } from '../../app/models/customer.model';
import { Barber } from '../../app/models/barber.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public customer = new Customer(); // The customer object created on the form

  constructor(
    public navCtrl: NavController,
    public alertController: AlertController,
    public dataProvider: DataProvider
  ) { }

  ionViewWillEnter() {
    this.resetForm();
  }

  public onSubmit() {
    /*
      Add the customer to the line by pushing it into the array.
      Can't be the ID because the ID will never stop incrementing, but the place in line could be 1 multiple times.
    */
    this.dataProvider.customerLine.push(this.customer.clone());
    this.seatCustomer();
  }

  private resetForm() {
    this.customer = new Customer();
    this.customer.selectedBarber = this.dataProvider.barbers[0];
  }

  private async seatCustomer() {
    /* First assign the message that will be displayed on the alert. The message changes if the customer selected a prefered barber or not */
    let message = `Hello ${this.customer.fullName}! Your customer number is ${this.dataProvider.customerLine.length}.`;
    if (this.customer.selectedBarber.id) {
      message = `Hello ${this.customer.fullName}! Your customer number is ${this.dataProvider.customerLine.length}. You are waiting for ${this.customer.selectedBarber.name}`;
    }

    /* Create the alert and reset the form when user accepts. */
    const alert = await this.alertController.create({
      title: 'You are on line!',
      message,
      buttons: [
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
