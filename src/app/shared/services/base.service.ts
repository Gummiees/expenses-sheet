import { collectionData, query, where } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  FirestoreDataConverter,
  Query,
  updateDoc
} from '@firebase/firestore';
import { BaseUser } from '@shared/models/base.model';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

export class BaseService<T extends BaseUser> {
  protected query?: Query<T> | null;
  protected collection?: CollectionReference<T> | null;
  protected converter: FirestoreDataConverter<T> = {
    toFirestore: (item) => ({ id: item.id }),
    fromFirestore: (snapshot) => {
      return {
        ...snapshot.data(),
        id: snapshot.id
      } as T;
    }
  };

  constructor(
    public collectionName: string,
    protected firestore: Firestore,
    protected userService: UserService
  ) {}

  protected getCollection(): CollectionReference<T> {
    if (!this.collection) {
      this.collection = collection(this.firestore, this.collectionName).withConverter(
        this.converter
      );
    }
    return this.collection;
  }

  protected getQuery(user: firebase.User): Query<T> {
    if (!this.query) {
      const genericCollection = collection(this.firestore, this.collectionName);

      this.query = query(genericCollection, where('userId', '==', user.uid)).withConverter(
        this.converter
      );
    }
    return this.query;
  }

  public listItems(user: firebase.User): Observable<T[]> {
    return collectionData<T>(this.getQuery(user).withConverter(this.converter));
  }

  public async createItem(item: T): Promise<void> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    item.userId = user.uid;
    await addDoc(this.getCollection(), item);
  }

  public async deleteItem(item: T): Promise<void> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    const reference = doc(this.getCollection(), `${this.collectionName}/${item.id}`);
    await deleteDoc(reference);
  }

  public async updateItem(item: T): Promise<void> {
    const user: firebase.User | null = await this.userService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (!item.id) {
      throw new Error('Item ID is required');
    }
    const reference = doc(this.getCollection(), `${this.collectionName}/${item.id}`);
    await updateDoc(reference, { ...item } as any);
  }
}
