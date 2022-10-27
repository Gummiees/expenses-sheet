import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Entry } from '@shared/models/entry.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseService<Entry> {
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('entries', firestore, userService);
  }

  public listItems(user: firebase.User): Observable<Entry[]> {
    return super.listItems(user).pipe(
      map((items: Entry[]) => {
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
