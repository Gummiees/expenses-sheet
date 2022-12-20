export interface EntryTable {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  type: string;
  categories: string[];
  tags: string[];
}
