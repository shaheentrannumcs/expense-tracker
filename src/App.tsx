import { useMemo, useState } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Summary } from './components/Summary';
import { useExpenses } from './hooks/useExpenses';
import { useLocalStorage } from './hooks/useLocalStorage';
import { availableMonths, filterByMonth, formatMonth, monthKey, sortExpenses, toCsv } from './lib/expenses';
import type { Expense } from './types';

export default function App() {
  const { expenses, add, update, remove } = useExpenses();
  const [budget, setBudget] = useLocalStorage('expense-tracker:budget', 0);
  const [month, setMonth] = useState(() => monthKey(new Date().toISOString()));
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [editing, setEditing] = useState<Expense | null>(null);

  const months = useMemo(() => {
    const list = availableMonths(expenses);
    return list.includes(month) || month === 'all' ? list : [month, ...list];
  }, [expenses, month]);
  const visible = useMemo(() => sortExpenses(filterByMonth(expenses, month), sortBy), [expenses, month, sortBy]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `expenses-${month}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="app">
      <header>
        <h1>Expense Tracker</h1>
        <p className="muted">Track where your money goes, month by month.</p>
      </header>

      <main className="layout">
        <aside>
          <ExpenseForm
            editing={editing}
            onSubmit={(input) => {
              if (editing) update(editing.id, input);
              else add(input);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </aside>

        <section className="content">
          <div className="toolbar">
            <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month">
              {months.map((m) => (
                <option key={m} value={m}>
                  {formatMonth(m)}
                </option>
              ))}
              <option value="all">All time</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')} aria-label="Sort by">
              <option value="date">Newest first</option>
              <option value="amount">Highest amount</option>
            </select>
            <button onClick={exportCsv} disabled={!visible.length}>
              Export CSV
            </button>
          </div>

          <Summary expenses={visible} budget={budget} onBudgetChange={setBudget} showBudget={month !== 'all'} />

          <div className="card">
            <h2>Transactions</h2>
            <ExpenseList
              expenses={visible}
              onEdit={setEditing}
              onDelete={(id) => {
                remove(id);
                if (editing?.id === id) setEditing(null);
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
