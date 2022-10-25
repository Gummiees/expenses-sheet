import { Component } from '@angular/core';
import { TabItem } from '@shared/models/tab-item.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  tabs: TabItem[] = [
    {
      label: 'Home',
      link: 'home',
      icon: 'home'
    },
    {
      label: 'History',
      link: 'history',
      icon: 'history'
    }
    // {
    //   label: 'Charts',
    //   link: 'charts',
    //   icon: 'insert_chart_outlined'
    // }
  ];
  constructor() {}
}
