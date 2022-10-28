import { Base } from './base.model';

export interface Type extends Base {
  name: string;
}

export enum TypeName {
  expense = 'expense',
  income = 'income'
}
