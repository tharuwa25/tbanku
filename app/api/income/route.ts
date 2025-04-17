import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const INCOME_FILE = path.join(process.cwd(), 'public', 'data', 'income.json');

// Define the Income type
interface Income {
  id: number;
  amount: number;
  source: string;
  date: string;
  description?: string;
  [key: string]: unknown; // Optional: allows flexibility
}

// Ensure file and directory exist
function ensureFileExists() {
  const dir = path.dirname(INCOME_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(INCOME_FILE)) {
    fs.writeFileSync(INCOME_FILE, JSON.stringify({ incomes: [] }));
  }
}

// Read and validate data structure
function readData(): { incomes: Income[] } {
  ensureFileExists();
  try {
    const fileContent = fs.readFileSync(INCOME_FILE, 'utf8');
    const data = JSON.parse(fileContent);
    if (!data || typeof data !== 'object' || !Array.isArray(data.incomes)) {
      return { incomes: [] };
    }
    return { incomes: data.incomes as Income[] };
  } catch (err) {
    console.error('readData Error:', err);
    return { incomes: [] };
  }
}

// Write data to file
function writeData(data: { incomes: Income[] }) {
  ensureFileExists();
  fs.writeFileSync(INCOME_FILE, JSON.stringify(data, null, 2));
}

// GET /api/income
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.incomes);
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Failed to read income data' }, { status: 500 });
  }
}

// POST /api/income
export async function POST(request: Request) {
  try {
    const newIncome = await request.json();

    if (
      typeof newIncome.amount !== 'number' ||
      typeof newIncome.source !== 'string' ||
      typeof newIncome.date !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid income data' }, { status: 400 });
    }

    const data = readData();

    const newId = data.incomes.length > 0
      ? Math.max(...data.incomes.map((i) => i.id)) + 1
      : 1;

    const incomeWithId: Income = {
      id: newId,
      amount: newIncome.amount,
      source: newIncome.source,
      date: newIncome.date,
      description: newIncome.description || '',
    };

    data.incomes.push(incomeWithId);
    writeData(data);

    return NextResponse.json(incomeWithId);
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to add income' }, { status: 500 });
  }
}

// DELETE /api/income
export async function DELETE(request: Request) {
  try {
    const { id }: { id: number } = await request.json();
    const data = readData();

    data.incomes = data.incomes.filter((i) => i.id !== id);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 });
  }
}

// PUT /api/income
export async function PUT(request: Request) {
  try {
    const updatedIncome: Income = await request.json();
    const data = readData();

    const index = data.incomes.findIndex((i) => i.id === updatedIncome.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }

    data.incomes[index] = updatedIncome;
    writeData(data);

    return NextResponse.json(updatedIncome);
  } catch (err) {
    console.error('PUT Error:', err);
    return NextResponse.json({ error: 'Failed to update income' }, { status: 500 });
  }
}
