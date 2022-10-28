import { BaseUser } from './base.model';

export interface Tag extends BaseUser {
  name: string;
  typeId?: string;
}
