import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const EXPENSES_FILE = path.join(process.cwd(), 'public', 'data', 'expenses.json');

// Read expenses from file
async function readExpenses() {
  try {
    const data = await fs.readFile(EXPENSES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { expenses: [] };
  }
}

// ❌ Writing to public directory (NOT RECOMMENDED)
// If you really need writable storage, consider:
// - Using a database
// - Writing to a server-side folder (outside `public`)
// - Or using a temp file during dev only

async function writeExpenses(expenses: any[]) {
  await fs.writeFile(EXPENSES_FILE, JSON.stringify({ expenses }, null, 2));
}

export async function GET() {
  try {
    const data = await readExpenses();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading expenses:', error);
    return NextResponse.json({ error: 'Failed to read expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, category, date, description } = body;

    if (!amount || !category || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = await readExpenses();
    const newExpense = {
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      date,
      description: description || '',
    };

    data.expenses.push(newExpense);
    await writeExpenses(data.expenses);

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}
