import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import { Tag } from '@shared/models/tag.model';
import { BaseService } from '@shared/services/base.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseService<Tag> {
  protected noUserCollection?: AngularFirestoreCollection<Tag> | null;
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('tags', firestore, userService);
  }

  protected getNoUserCollection(): AngularFirestoreCollection<Tag> {
    if (!this.noUserCollection) {
      this.noUserCollection = this.firestore.collection<Tag>(this.collectionName, (ref) =>
        ref.where('userId', '==', null)
      );
    }
    return this.noUserCollection;
  }

  public listItems(user: firebase.User): Observable<Tag[]> {
    return super
      .listItems(user)
      .pipe(map((items: Tag[]) => items.sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))));
  }

  public listNoUserItems(): Observable<Tag[]> {
    return this.getNoUserCollection()
      .snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<Tag>[]) => {
          return items.map((item: DocumentChangeAction<Tag>) => {
            return {
              ...item.payload.doc.data(),
              id: item.payload.doc.id
            };
          });
        })
      );
  }
}
