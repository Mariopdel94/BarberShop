import { Barber } from './../../app/models/barber.model';
import { Customer } from './../../app/models/customer.model';
import { DataProvider } from '../../providers/data/data';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-line',
  templateUrl: 'line.html'
})
export class LinePage {

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public alertController: AlertController,
  ) { }

  public async confirmCustomerMovement(customer: Customer) {
    const alert = await this.alertController.create({
      title: 'Move customer to chair',
      message: `Please confirm if you want to move ${customer.fullName} to a chair`,
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
            this.moveCustomerToChair(customer);
          }
        }
      ]
    });

    /* Display the alert */
    await alert.present();
  }

  private moveCustomerToChair(customer: Customer) {
    /* Assign customer to the barber he selected or the next one available */
    let barber = new Barber();
    if (customer.selectedBarber.id) {
      /* Look for the barber the customer selected to see if is available */
      barber = this.dataProvider.barbers.find(barber => barber.id === customer.selectedBarber.id && !barber.customerOnChairName);
      /* If no barber was found we finish this process, and ask the user if the customer wants to go with another barber */
      if (!barber) {
        this.cancelSpecificBarber(customer);
        return;
      }
    } else {
      /* Look for the next barber available */
      barber = this.dataProvider.barbers.find(barber => barber.id && !barber.customerOnChairName);
      /* If there aren't barbers available that means that everyone is busy */
      if (!barber) {
        this.allBarbersBusy(customer);
        return;
      }
    }
    barber.customerOnChairName = customer.fullName;

    /* Remove customer from the waiting list */
    const index = this.dataProvider.customerLine.findIndex(cust => cust.id === customer.id);
    this.dataProvider.customerLine.splice(index, 1);
  }

  private async cancelSpecificBarber(customer: Customer) {
    const alert = await this.alertController.create({
      title: 'Barber unavailable',
      message: `${customer.selectedBarber.name} is busy right now. Would you like to go with the next available barber?`,
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
            customer.selectedBarber = this.dataProvider.barbers[0];
            this.moveCustomerToChair(customer);
          }
        }
      ]
    });

    /* Display the alert */
    await alert.present();
  }

  private async allBarbersBusy(customer: Customer) {
    const alert = await this.alertController.create({
      title: 'All barbers unavailable',
      message: `Sorry, ${customer.fullName} all barbers are busy right now. Please wait for the next barber to be available`,
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
          }
        }
      ]
    });

    /* Display the alert */
    await alert.present();
  }

}
