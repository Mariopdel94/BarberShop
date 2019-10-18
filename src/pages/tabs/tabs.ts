import { Component } from '@angular/core';

import { LinePage } from '../line/line';
import { BarbersPage } from '../barbers/barbers';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = LinePage;
  tab3Root = BarbersPage;

  constructor() {

  }
}
