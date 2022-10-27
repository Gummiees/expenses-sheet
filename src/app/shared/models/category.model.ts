import { BaseUser } from './base.model';

export interface Category extends BaseUser {
  name: string;
  typeId: string;
}
