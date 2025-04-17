import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');

// Define the Property type
interface Property {
  id: string;
  name: string;
  value: number;
  date: string;
  usedtime: number;
  worth: number;
  description?: string;
}

// Ensure the data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read properties from the file
async function readProperties(): Promise<{ properties: Property[] }> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(PROPERTIES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.properties)) {
      return { properties: [] };
    }
    return parsed;
  } catch (err) {
    console.error('readProperties Error:', err);
    return { properties: [] };
  }
}

// Write properties to the file
async function writeProperties(properties: Property[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify({ properties }, null, 2));
}

// GET /api/properties
export async function GET() {
  try {
    const data = await readProperties();
    return NextResponse.json(data.properties);
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Failed to read properties' }, { status: 500 });
  }
}

// POST /api/properties
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, value, date, description, usedtime, worth } = body;

    if (
      typeof name !== 'string' ||
      typeof value !== 'number' ||
      typeof date !== 'string' ||
      typeof usedtime !== 'number' || 
      typeof worth !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
    }

    const data = await readProperties();
    const newProperty: Property = {
      id: Date.now().toString(),
      name,
      value,
      date,
      usedtime,
      worth,
      description: typeof description === 'string' ? description : '',
    };

    data.properties.push(newProperty);
    await writeProperties(data.properties);

    return NextResponse.json(newProperty, { status: 201 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to add property' }, { status: 500 });
  }
}
