import { CATEGORIES, type Category, type Expense } from '../types';

export const monthKey = (date: string) => date.slice(0, 7);

export function filterByMonth(expenses: Expense[], month: string): Expense[] {
  return month === 'all' ? expenses : expenses.filter((e) => monthKey(e.date) === month);
}

export function total(expenses: Expense[]): number {
  return Math.round(expenses.reduce((sum, e) => sum + e.amount, 0) * 100) / 100;
}

export function totalsByCategory(expenses: Expense[]): { category: Category; amount: number }[] {
  const map = new Map<Category, number>();
  for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  return CATEGORIES.filter((c) => map.has(c))
    .map((category) => ({ category, amount: Math.round(map.get(category)! * 100) / 100 }))
    .sort((a, b) => b.amount - a.amount);
}

export function availableMonths(expenses: Expense[]): string[] {
  return [...new Set(expenses.map((e) => monthKey(e.date)))].sort().reverse();
}

export function sortExpenses(expenses: Expense[], by: 'date' | 'amount'): Expense[] {
  return [...expenses].sort((a, b) =>
    by === 'amount' ? b.amount - a.amount : b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );
}

export function toCsv(expenses: Expense[]): string {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const rows = expenses.map((e) =>
    [e.date, esc(e.title), e.category, e.amount.toFixed(2), esc(e.note ?? '')].join(','),
  );
  return ['date,title,category,amount,note', ...rows].join('\n');
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
export const formatINR = (n: number) => inr.format(n);

export function formatMonth(month: string): string {
  if (month === 'all') return 'All time';
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}
