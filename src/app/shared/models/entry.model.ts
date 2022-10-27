import { BaseUser } from './base.model';

export interface Entry extends BaseUser {
  typeId: string;
  amout: number;
  date: Date;
  description?: string;
  categoryId?: string;
  tagIds: string[];
}
