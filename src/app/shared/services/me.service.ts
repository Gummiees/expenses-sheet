import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
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
  protected userCollection?: AngularFirestoreCollection<User> | null;
  constructor(
    protected firestore: AngularFirestore,
    protected userService: UserService,
    private commonService: CommonService
  ) {
    super('users', firestore, userService);
    this.getMe().then((user) => (this.user = user));
  }

  protected getUserCollection(user: firebase.User): AngularFirestoreCollection<User> {
    if (!this.userCollection) {
      this.userCollection = this.firestore.collection<User>('users', (ref) =>
        ref.where('userId', '==', user.uid)
      );
    }
    return this.userCollection;
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
      this.getUserCollection(userAuth)
        .snapshotChanges()
        .pipe(
          catchError((err) => {
            console.error(err);
            return of([]);
          }),
          first()
        )
        .subscribe((items: DocumentChangeAction<User>[]) => {
          if (items && items.length > 0) {
            const data: User = items[0].payload.doc.data() as User;
            data.id = items[0].payload.doc.id;
            resolve(data);
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
      username: user.displayName,
      currency: '€'
    };

    await this.getUserCollection(userAuth).add(userData);
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
    await this.getUserCollection(userAuth).doc(user.id).delete();
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
    await this.getUserCollection(userAuth).doc(userId.id).update(user);
    this.userChanged(user);
  }

  public async setUser(user: User): Promise<void> {
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
    await this.getUserCollection(userAuth).doc(userId.id).set(user);
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
