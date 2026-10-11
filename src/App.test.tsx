import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

async function addExpense(title: string, amount: string) {
  const user = userEvent.setup();
  const form = screen.getByRole('form', { name: /expense form/i });
  await user.type(within(form).getByLabelText(/title/i), title);
  await user.type(within(form).getByLabelText(/amount/i), amount);
  await user.click(within(form).getByRole('button', { name: /add expense/i }));
  return user;
}

describe('App', () => {
  it('adds an expense and updates the total', async () => {
    render(<App />);
    await addExpense('Biryani', '320');
    expect(screen.getByText('Biryani')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('320');
  });

  it('validates the form', async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add expense/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/title/i);
  });

  it('edits and deletes an expense', async () => {
    render(<App />);
    const user = await addExpense('Auto', '80');
    await user.click(screen.getByRole('button', { name: /edit auto/i }));
    const amount = screen.getByLabelText(/amount/i);
    await user.clear(amount);
    await user.type(amount, '120');
    await user.click(screen.getByRole('button', { name: /save changes/i }));
    expect(screen.getByTestId('total')).toHaveTextContent('120');

    await user.click(screen.getByRole('button', { name: /delete auto/i }));
    expect(screen.queryByText('Auto')).not.toBeInTheDocument();
  });

  it('persists to localStorage', async () => {
    const { unmount } = render(<App />);
    await addExpense('Groceries run', '900');
    unmount();
    render(<App />);
    expect(screen.getByText('Groceries run')).toBeInTheDocument();
  });

  it('warns when over budget', async () => {
    render(<App />);
    const user = await addExpense('Phone', '5000');
    await user.type(screen.getByLabelText(/monthly budget/i), '4000');
    expect(screen.getByText(/over budget/i)).toBeInTheDocument();
  });
});
