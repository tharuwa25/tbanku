export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export async function getAllExpenses(): Promise<Expense[]> {
  try {
    const response = await fetch('http://localhost:5000/expenses');
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    const data = await response.json();
    return data.expenses || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

export async function addExpense(expense: Omit<Expense, 'id'>): Promise<Expense | null> {
  try {
    const response = await fetch('http://localhost:5000/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      throw new Error('Failed to add expense');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding expense:', error);
    return null;
  }
}

export async function getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
  const expenses = await getAllExpenses();
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
  });
}

export async function getExpensesByCategory(category: string): Promise<Expense[]> {
  const expenses = await getAllExpenses();
  return expenses.filter(expense => expense.category === category);
} 