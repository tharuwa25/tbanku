import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const INCOME_FILE = path.join(process.cwd(), 'public', 'data', 'income.json');

function ensureFileExists() {
  const dir = path.dirname(INCOME_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(INCOME_FILE)) {
    fs.writeFileSync(INCOME_FILE, JSON.stringify({ incomes: [] }));
  }
}

function readData() {
  ensureFileExists();
  try {
    const fileContent = fs.readFileSync(INCOME_FILE, 'utf8');
    let data = JSON.parse(fileContent);
    // Ensure data has the correct structure
    if (!data || typeof data !== 'object') {
      data = { incomes: [] };
    }
    if (!Array.isArray(data.incomes)) {
      data.incomes = [];
    }
    return data;
  } catch (error) {
    // If there's any error reading or parsing the file, return default structure
    return { incomes: [] };
  }
}

function writeData(data: any) {
  ensureFileExists();
  // Ensure data has the correct structure before writing
  if (!data || typeof data !== 'object') {
    data = { incomes: [] };
  }
  if (!Array.isArray(data.incomes)) {
    data.incomes = [];
  }
  fs.writeFileSync(INCOME_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.incomes);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to read income data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newIncome = await request.json();
    const data = readData();
    
    const newId = data.incomes.length > 0 
      ? Math.max(...data.incomes.map((i: any) => i.id)) + 1 
      : 1;
    
    const incomeWithId = { ...newIncome, id: newId };
    data.incomes.push(incomeWithId);
    
    writeData(data);
    return NextResponse.json(incomeWithId);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to add income' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const data = readData();
    
    data.incomes = data.incomes.filter((i: any) => i.id !== id);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedIncome = await request.json();
    const data = readData();
    
    const index = data.incomes.findIndex((i: any) => i.id === updatedIncome.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    data.incomes[index] = updatedIncome;
    writeData(data);
    
    return NextResponse.json(updatedIncome);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update income' }, { status: 500 });
  }
} 