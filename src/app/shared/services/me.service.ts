import { Injectable } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import {
  addDoc,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  FirestoreDataConverter,
  updateDoc
} from '@firebase/firestore';
import { User } from '@shared/models/user.model';
import firebase from 'firebase/compat/app';
import { of, Subject } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { BaseService } from './base.service';
import { CommonService } from './common.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MeService extends BaseService<User> {
  public user: User | null = null;
  public $user: Subject<User | null> = new Subject();
  protected userCollection?: CollectionReference<User> | null;
  protected userQuery?: FirestoreDataConverter<User> | null;
  constructor(
    protected firestore: Firestore,
    protected userService: UserService,
    private commonService: CommonService
  ) {
    super('users', firestore, userService);
    this.getMe().then((user) => (this.user = user));
  }

  public async userExists(userAuth: firebase.User | null): Promise<boolean> {
    if (!userAuth) {
      return false;
    }
    const user: User | null = await this.getMe(userAuth);
    return !this.commonService.isNullOrUndefined(user);
  }

  public async getMe(userAuth?: firebase.User | null): Promise<User | null> {
    if (this.user) {
      return this.user;
    }
    return new Promise<User | null>(async (resolve) => {
      if (!userAuth) {
        userAuth = await this.userService.user;
      }
      if (!userAuth) {
        resolve(null);
        return;
      }
      collectionData<User>(this.getQuery(userAuth))
        .pipe(
          catchError((err) => {
            console.error(err);
            return of([]);
          }),
          first()
        )
        .subscribe((items: User[]) => {
          if (items && items.length > 0) {
            resolve(items[0]);
          } else {
            resolve(null);
          }
        });
    });
  }

  public async createUser(user: firebase.User): Promise<void> {
    const userAuth: firebase.User | null = await this.userService.user;
    if (!userAuth) {
      throw new Error('You must be signed in');
    }
    if (user.uid !== userAuth.uid) {
      throw new Error('You can only create your own user');
    }

    const userData: User = {
      userId: user.uid,
      email: user.email,
      username: user.displayName
    };

    await addDoc(this.getCollection(), userData);
    this.userChanged(userData);
  }

  public async deleteUser(): Promise<void> {
    this.userChanged(null);
    const userAuth: firebase.User | null = await this.userService.user;
    if (!userAuth) {
      throw new Error('You must be signed in');
    }
    const user: User | null = await this.getMe(userAuth);
    if (!user) {
      throw new Error('You must be signed in');
    }
    const reference = doc(this.getCollection(), `${this.collectionName}/${user.id}`);
    await deleteDoc(reference);
  }

  public async updateUser(user: User): Promise<void> {
    const userAuth: firebase.User | null = await this.userService.user;
    if (!userAuth) {
      throw new Error('You must be signed in');
    }
    if (!user.id) {
      throw new Error('User ID is required');
    }
    const userId: User | null = await this.getMe(userAuth);
    if (!userId) {
      throw new Error('You must be signed in');
    }
    const reference = doc(this.getCollection(), `${this.collectionName}/${user.id}`);
    await updateDoc(reference, { ...user } as any);
    this.userChanged(user);
  }

  public logout() {
    this.userChanged(null);
  }

  public async login(userAuth: firebase.User) {
    if (!userAuth) {
      this.userChanged(null);
      return;
    }
    const user: User | null = await this.getMe(userAuth);
    this.userChanged(user);
  }

  public userChanged(user: User | null) {
    this.user = user;
    this.$user.next(user);
  }
}
