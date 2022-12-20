import { BaseUser } from './base.model';

export interface Entry extends BaseUser {
  typeId: string;
  amount: number;
  date: Date;
  description?: string;
  categoryIds: string[];
  tagIds: string[];
}
