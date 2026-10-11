import { useEffect, useState, type FormEvent } from 'react';
import { CATEGORIES, type Category, type Expense, type ExpenseInput } from '../types';

interface Props {
  editing?: Expense | null;
  onSubmit: (input: ExpenseInput) => void;
  onCancel?: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);
const empty = { title: '', amount: '', category: 'Food' as Category, date: today(), note: '' };

export function ExpenseForm({ editing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(
      editing
        ? { ...editing, amount: String(editing.amount), note: editing.note ?? '' }
        : { ...empty, date: today() },
    );
    setError('');
  }, [editing]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.title.trim()) return setError('Please enter a title');
    if (!Number.isFinite(amount) || amount <= 0) return setError('Amount must be greater than 0');
    if (!form.date) return setError('Please pick a date');
    onSubmit({
      title: form.title.trim(),
      amount: Math.round(amount * 100) / 100,
      category: form.category,
      date: form.date,
      note: form.note.trim() || undefined,
    });
    if (!editing) setForm({ ...empty, date: form.date, category: form.category });
    setError('');
  };

  return (
    <form className="card form" onSubmit={handleSubmit} aria-label="Expense form">
      <h2>{editing ? 'Edit expense' : 'Add expense'}</h2>
      <label>
        Title
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Lunch" />
      </label>
      <div className="row">
        <label>
          Amount (₹)
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </label>
        <label>
          Date
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </label>
      </div>
      <label>
        Category
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        <span>
          Note <span className="muted">(optional)</span>
        </span>
        <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="actions">
        <button type="submit" className="primary">
          {editing ? 'Save changes' : 'Add expense'}
        </button>
        {editing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
