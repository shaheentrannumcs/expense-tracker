import { describe, expect, it } from 'vitest';
import type { Expense } from '../types';
import { availableMonths, filterByMonth, sortExpenses, toCsv, total, totalsByCategory } from './expenses';

const data: Expense[] = [
  { id: '1', title: 'Lunch', amount: 250, category: 'Food', date: '2026-09-02' },
  { id: '2', title: 'Metro card', amount: 500, category: 'Transport', date: '2026-09-05' },
  { id: '3', title: 'Dinner, with "friends"', amount: 1200.5, category: 'Food', date: '2026-10-01', note: 'Paradise' },
];

describe('expense helpers', () => {
  it('totals amounts', () => expect(total(data)).toBe(1950.5));

  it('filters by month', () => {
    expect(filterByMonth(data, '2026-09')).toHaveLength(2);
    expect(filterByMonth(data, 'all')).toHaveLength(3);
  });

  it('groups by category sorted by amount', () => {
    expect(totalsByCategory(data)).toEqual([
      { category: 'Food', amount: 1450.5 },
      { category: 'Transport', amount: 500 },
    ]);
  });

  it('lists months newest first', () => expect(availableMonths(data)).toEqual(['2026-10', '2026-09']));

  it('sorts by amount or date', () => {
    expect(sortExpenses(data, 'amount').map((e) => e.id)).toEqual(['3', '2', '1']);
    expect(sortExpenses(data, 'date').map((e) => e.id)).toEqual(['3', '2', '1']);
  });

  it('escapes CSV values', () => {
    const csv = toCsv(data).split('\n');
    expect(csv[0]).toBe('date,title,category,amount,note');
    expect(csv[3]).toBe('2026-10-01,"Dinner, with ""friends""",Food,1200.50,Paradise');
  });
});
