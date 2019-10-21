import { Barber } from './../../app/models/barber.model';
import { Customer } from './../../app/models/customer.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
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
    public dataProvider: DataProvider
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

  public finishWithCustomer(barber: Barber) {
    this.dataProvider.barberDoneWithCustomer.next(barber);
  }

}
