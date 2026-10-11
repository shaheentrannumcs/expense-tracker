import { useCallback } from 'react';
import type { Expense, ExpenseInput } from '../types';
import { useLocalStorage } from './useLocalStorage';

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

export function useExpenses(seed: Expense[] = []) {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expense-tracker:expenses', seed);

  const add = useCallback(
    (input: ExpenseInput) => setExpenses((prev) => [{ ...input, id: newId() }, ...prev]),
    [setExpenses],
  );
  const update = useCallback(
    (id: string, input: ExpenseInput) => setExpenses((prev) => prev.map((e) => (e.id === id ? { ...input, id } : e))),
    [setExpenses],
  );
  const remove = useCallback((id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id)), [setExpenses]);

  return { expenses, add, update, remove };
}
