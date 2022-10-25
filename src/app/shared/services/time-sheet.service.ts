import { Injectable } from '@angular/core';
import { Firestore } from '@firebase/firestore';
import { TimeSheet } from '@shared/models/time-sheet.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService extends BaseService<TimeSheet> {
  constructor(protected firestore: Firestore, protected userService: UserService) {
    super('time-sheet', firestore, userService);
  }

  public listItems(user: firebase.User): Observable<TimeSheet[]> {
    return super.listItems(user).pipe(
      map((items: TimeSheet[]) => {
        return items
          .map((item) => {
            const obj = item.date as any;
            item.date = new Date(obj.toMillis());
            return item;
          })
          .sort((a, b) => {
            if (a.date < b.date) {
              return 1;
            } else if (a.date > b.date) {
              return -1;
            } else {
              return 0;
            }
          });
      })
    );
  }
}
