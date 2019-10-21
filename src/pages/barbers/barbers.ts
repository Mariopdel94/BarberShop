import { Barber } from './../../app/models/barber.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Subject } from 'rxjs';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'page-barbers',
  templateUrl: 'barbers.html'
})
export class BarbersPage implements OnInit, OnDestroy {
  private _destroyed$ = new Subject();
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

    timer(60000, 60000)
    .takeUntil(this._destroyed$)
    .subscribe(() => {
      this.dataProvider.barbers.forEach(barber => {
        if (barber.customerOnChairName) {
          barber.timeElapsedWithCustomer++;
          this.dataProvider.barberBusyTime.next(barber);
        }
      });
    });
  }

  ngOnDestroy() {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }

  public async confirmEndOfService(barber: Barber) {
    const alert = await this.alertController.create({
      title: 'You finished?',
      message: `Please confirm you finished with ${barber.customerOnChairName}`,
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
            this.finishWithCustomer(barber);
          }
        }
      ]
    });

    /* Display the alert */
    await alert.present();
  }

  private finishWithCustomer(barber: Barber) {
    barber.customerOnChairName = '';
    barber.timeElapsedWithCustomer = 0;
    barber.customersScheduled.forEach(customer => {
      const cust = this.dataProvider.customerLine.find(cust => cust.id === customer);
      if (cust) {
        cust.eta = 0;
      }
    });
    barber.customersScheduled = [];
  }

}
