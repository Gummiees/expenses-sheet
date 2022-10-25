import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { Type } from '@shared/models/type.model';
import { UserService } from '@shared/services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  protected collection?: AngularFirestoreCollection<Type> | null;
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {}

  protected getCollection(): AngularFirestoreCollection<Type> {
    if (!this.collection) {
      this.collection = this.firestore.collection<Type>('types');
    }
    return this.collection;
  }

  public listItems(): Observable<Type[]> {
    return this.getCollection()
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Type>[]) => {
          return items
            .map((item: DocumentChangeAction<Type>) => {
              return {
                ...item.payload.doc.data(),
                id: item.payload.doc.id
              };
            })
            .sort((a: Type, b: Type) => {
              return a.name.localeCompare(b.name);
            });
        })
      );
  }
}
