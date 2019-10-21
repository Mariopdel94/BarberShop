import { Barber } from './../../app/models/barber.model';
import { Customer } from './../../app/models/customer.model';
import { DataProvider } from '../../providers/data/data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'page-line',
  templateUrl: 'line.html'
})
export class LinePage implements OnInit, OnDestroy {
  private _destroyed$ = new Subject();
  private _serviceTime = 15; // Time in minutes it takes.
  public currentTime = new Date();

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    timer(1000, 1000)
    .takeUntil(this._destroyed$)
    .subscribe(() => {
      this.currentTime = new Date();
    });

    this.dataProvider.barberBusyTime
    .takeUntil(this._destroyed$)
    .subscribe((barber: Barber) => {
      const barberCustomers = this.dataProvider.customerLine.filter(cust => cust.selectedBarber.id === barber.id);
      barberCustomers.forEach(customer => {
        customer.eta = customer.eta - barber.timeElapsedWithCustomer;
      })
    })
  }

  public ionViewWillEnter() {
    this._getCustomersETA();
  }

  ngOnDestroy() {
    this._destroyed$.next(true);
    this._destroyed$.complete();
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
            const temporalBarber = customer.selectedBarber.clone();
            customer.selectedBarber = this._getBarberWithLessLine();
            if (temporalBarber === customer.selectedBarber) {
              this.allBarbersBusy(customer);
            } else {
              this.moveCustomerToChair(customer);
            }
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
      message: `Sorry, ${customer.fullName} all barbers are busy right now. Please wait for the next barber to be available.`,
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

  private _getBarberWithLessLine() {
    const barbers = this.dataProvider.barbers.filter(barbs => barbs.id); // For easier reading on this method
    let barberWithLessLine = barbers[0].clone();
    /* We search for the barber with less line at the moment */
    barbers.forEach(barber => {
      if (barber.customersScheduled.length < barberWithLessLine.customersScheduled.length) {
        barberWithLessLine = barber.clone();
      }
    });
    return barberWithLessLine;
  }

  private _getCustomersETA() {
    const customers = this.dataProvider.customerLine.filter(cust => !cust.eta); // For easier reading on this method
    console.log(customers);
    const barbers = this.dataProvider.barbers.filter(barbs => barbs.id); // For easier reading on this method

    customers.forEach(customer => {
      // If customer goes with whatever is first, we need to look which barber has less line at the moment.
      if (!(customer.selectedBarber && customer.selectedBarber.id)) {
        const barberWithLessLine = this._getBarberWithLessLine();
        /* We assign that barber to the customer currently on the iteration */
        customer.selectedBarber = barberWithLessLine.clone();
      }

      // We add the customer to the barber specifc line.
      const barber = barbers.find(barb => barb.id === customer.selectedBarber.id);
      // Make sure the customer is not already on line.
      if (barber.customersScheduled.findIndex(customerScheduled => customerScheduled === customer.id) === -1) {
        barber.customersScheduled.push(customer.id);
      }
      /* We clone again, just to add the whole customer line to the selected customer */
      customer.selectedBarber = barber.clone();
    });

    /* After adding the customers to each specific line for each barber we need get in what place of the line
    for a specific barber they are to calculate their ETA */
    customers.forEach(customer => {
      const index = customer.selectedBarber.customersScheduled.findIndex(customerId => customerId === customer.id);
      customer.eta = (index * this._serviceTime) - customer.selectedBarber.timeElapsedWithCustomer;
    });
  }




}
