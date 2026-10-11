import type { Expense } from '../types';
import { formatINR } from '../lib/expenses';

interface Props {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  if (!expenses.length) return <p className="empty">No expenses yet for this period.</p>;
  return (
    <ul className="list">
      {expenses.map((e) => (
        <li key={e.id} className="item">
          <div className={`dot cat-${e.category.toLowerCase()}`} aria-hidden />
          <div className="item-main">
            <strong>{e.title}</strong>
            <span className="muted">
              {e.category} · {new Date(e.date + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              {e.note ? ` · ${e.note}` : ''}
            </span>
          </div>
          <span className="amount">{formatINR(e.amount)}</span>
          <div className="item-actions">
            <button onClick={() => onEdit(e)} aria-label={`Edit ${e.title}`}>
              Edit
            </button>
            <button onClick={() => onDelete(e.id)} aria-label={`Delete ${e.title}`} className="danger">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
