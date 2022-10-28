import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { Category } from '@shared/models/category.model';
import { BaseService } from '@shared/services/base.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { combineLatestWith, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category> {
  protected noUserCollection?: AngularFirestoreCollection<Category> | null;
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('categories', firestore, userService);
  }

  protected getNoUserCollection(): AngularFirestoreCollection<Category> {
    if (!this.noUserCollection) {
      this.noUserCollection = this.firestore.collection<Category>(this.collectionName, (ref) =>
        ref.where('userId', '==', null)
      );
    }
    return this.noUserCollection;
  }

  public listItems(user: firebase.User): Observable<Category[]> {
    return super
      .listItems(user)
      .pipe(combineLatestWith(this.listNoUserItems()))
      .pipe(map((items: [Category[], Category[]]) => items.flat().sort()));
  }

  private listNoUserItems(): Observable<Category[]> {
    return this.getNoUserCollection()
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Category>[]) => {
          return items.map((item: DocumentChangeAction<Category>) => {
            return {
              ...item.payload.doc.data(),
              id: item.payload.doc.id
            };
          });
        })
      );
  }
}