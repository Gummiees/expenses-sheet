import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from '@shared/models/entry.model';
import { Type } from '@shared/models/type.model';
import { Subscription } from 'rxjs';
import { MainService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  public types: Type[] = [];
  public entries: Entry[] = [];
  private subscriptions: Subscription[] = [];
  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    const typeSub = this.mainService.types$.subscribe((types: Type[]) => {
      this.types = [...types];
    });
    const entrySub = this.mainService.entries$.subscribe((entries: Entry[]) => {
      this.entries = [...entries];
    });
    this.subscriptions = [typeSub, entrySub];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
