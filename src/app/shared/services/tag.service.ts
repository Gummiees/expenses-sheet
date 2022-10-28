import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
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
  constructor(protected firestore: AngularFirestore, protected userService: UserService) {
    super('tags', firestore, userService);
  }

  protected override getCollection(user: firebase.User): AngularFirestoreCollection<Tag> {
    if (!this.collection) {
      this.collection = this.firestore.collection<Tag>(this.collectionName, (ref) =>
        ref.where('userId', '==', user.uid).where('userId', '==', null)
      );
    }
    return this.collection;
  }

  public listItems(user: firebase.User): Observable<Tag[]> {
    return super.listItems(user).pipe(map((items: Tag[]) => items.sort()));
  }
}
