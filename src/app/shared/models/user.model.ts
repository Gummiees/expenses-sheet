import { BaseUser } from './base.model';

export type UserType = 'admin' | 'user';

export interface User extends BaseUser {
  username?: string | null;
  email?: string | null;
  currency?: string | null;
}
