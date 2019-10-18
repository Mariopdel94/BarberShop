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
  private timeInterval: any;

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public alertController: AlertController,
  ) { }

  public ionViewWillEnter() {
    this.timeInterval = setInterval(() => {
      this.dataProvider.customerLine.forEach(customer => {
        this.getCustomerETA(customer);
      });
    }, 1000)
  }

  public ionViewWillLeave() {
    clearInterval(this.timeInterval);
  }

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

  private getCustomerETA(customer: Customer) {
    // Which barber was selected by the user?
    const selectedBarber = customer.selectedBarber;

    // Check specific barbers availability
    if (selectedBarber.id) {
      // console.log('He selected a specific barber');
      // If barber is available ETA = 0;
      if (!selectedBarber.customerOnChairName) {
        // console.log('He selected a specific barber and barber is available');
        customer.eta = `Ready to go with: <b>${selectedBarber.name}</b>`;
        return;
      } else {
        // console.log('He selected a specific barber and barber is NOT available');
        // If customer wants an specific barber but barber is busy. Calcula the ETA on that specific barber.
        // Get all customers of that barber.
        const customers = this.dataProvider.customerLine.filter(cust => cust.selectedBarber.id === selectedBarber.id);

        // Get the place on the line of that customer by index in the array
        const customerPlaceInLine = customers.findIndex(cust => cust.id === customer.id) + 1;
        customer.eta = `ETA with <b>${selectedBarber.name}</b> is: <b>${this.calculateETA(customer.clone().arrivalTime, customerPlaceInLine)}</b>`;
        return;
      }
    } else {
      // console.log('He DIDN\'T selected a specific barber');
      // If customer goes with any barber check for all barbers availability
      const barber = this.dataProvider.barbers.find(barber => !barber.customerOnChairName && barber.id);
      // console.log('He DIDN\'T selected a specific barber AND a barber is available');
      if (barber) {
        // If a barber was found, it means the barber is available. ETA = 0;
        customer.eta = `Ready to go with <b>${barber.name}</b>`;
        return;
      } else {
        // console.log('He DIDN\'T selected a specific barber AND a barber is NOT available');
        // Make sure no ETA was calculated before
        customer.eta = '';

        // If no barber was found, it means all barbers are busy. Calculate ETA on all barbers.
        this.dataProvider.barbers.filter(barber => barber.id).forEach(barber => {
          // console.log('going through each barber...', barber);
          // Get all customers of current barber in the iteration AND that got before him.
          const customers = this.dataProvider.customerLine.filter(cust => cust.selectedBarber.id === selectedBarber.id && (customer.clone().arrivalTime.getTime() < cust.arrivalTime.getTime()));
          // If he wants to go with that barber he would be last on line
          customer.eta += `ETA with <b>${barber.name}</b> is <b>${this.calculateETA(customer.clone().arrivalTime, customers.length + 1)}</b><br>`;
        });
      }
    }
  }

  private calculateETA(arrivalTime: Date, placeInLine: number) {
    // Set the date we're counting down to
    // In this case 15 minutes from when the customer arrived
    const countDownDate = new Date(new Date(new Date().setMinutes(arrivalTime.getMinutes() + (15 * placeInLine))).setSeconds(arrivalTime.getSeconds())).getTime();

    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for hours, minutes and seconds
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the eta
    return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  }

}
