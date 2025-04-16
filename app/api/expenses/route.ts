import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const EXPENSES_FILE = path.join(process.cwd(), 'public', 'data', 'expenses.json');

// Define expense type
interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

// Helper to read from file
async function readExpenses(): Promise<{ expenses: Expense[] }> {
  try {
    const data = await fs.readFile(EXPENSES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.expenses)) {
      return { expenses: [] };
    }
    return parsed;
  } catch (err) {
    console.error('Read error:', err);
    return { expenses: [] };
  }
}

// Helper to write to file
async function writeExpenses(expenses: Expense[]): Promise<void> {
  await fs.writeFile(EXPENSES_FILE, JSON.stringify({ expenses }, null, 2));
}

// GET expenses
export async function GET() {
  try {
    const data = await readExpenses();
    return NextResponse.json(data.expenses);
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Failed to read expenses' }, { status: 500 });
  }
}

// POST new expense
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { amount, category, date, description } = body;

    if (typeof amount !== 'number' || typeof category !== 'string' || typeof date !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    const data = await readExpenses();

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      category,
      date,
      description: typeof description === 'string' ? description : '',
    };

    data.expenses.push(newExpense);
    await writeExpenses(data.expenses);

    return NextResponse.json(newExpense, { status: 201 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}
