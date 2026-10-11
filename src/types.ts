export const CATEGORIES = [
  'Food',
  'Groceries',
  'Transport',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  note?: string;
}

export type ExpenseInput = Omit<Expense, 'id'>;
