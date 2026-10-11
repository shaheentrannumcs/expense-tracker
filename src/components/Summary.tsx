import type { Expense } from '../types';
import { formatINR, total, totalsByCategory } from '../lib/expenses';

interface Props {
  expenses: Expense[];
  budget: number;
  onBudgetChange: (n: number) => void;
  showBudget: boolean;
}

export function Summary({ expenses, budget, onBudgetChange, showBudget }: Props) {
  const spent = total(expenses);
  const byCat = totalsByCategory(expenses);
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = budget > 0 && spent > budget;

  return (
    <section className="card summary" aria-label="Summary">
      <div className="stats">
        <div>
          <span className="muted">Spent</span>
          <strong data-testid="total">{formatINR(spent)}</strong>
        </div>
        <div>
          <span className="muted">Transactions</span>
          <strong>{expenses.length}</strong>
        </div>
      </div>

      {showBudget && (
        <div className="budget">
          <label>
            Monthly budget (₹)
            <input
              type="number"
              min="0"
              value={budget || ''}
              onChange={(e) => onBudgetChange(Number(e.target.value) || 0)}
              placeholder="Set a budget"
            />
          </label>
          {budget > 0 && (
            <>
              <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
                <div className={`fill ${over ? 'over' : pct > 80 ? 'warn' : ''}`} style={{ width: `${pct}%` }} />
              </div>
              <p className={over ? 'error' : 'muted'}>
                {over ? `Over budget by ${formatINR(spent - budget)}` : `${formatINR(budget - spent)} left`}
              </p>
            </>
          )}
        </div>
      )}

      {byCat.length > 0 && (
        <div className="breakdown">
          <h3>By category</h3>
          {byCat.map(({ category, amount }) => (
            <div key={category} className="cat-row">
              <span>{category}</span>
              <div className="cat-bar">
                <div className={`cat-fill cat-${category.toLowerCase()}`} style={{ width: `${(amount / spent) * 100}%` }} />
              </div>
              <span className="amount">{formatINR(amount)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
