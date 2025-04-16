import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const DATA_DIR = path.join(process.cwd(), 'public', 'data',);
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read properties from file
async function readProperties() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(PROPERTIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return { properties: [] };
  }
}

// Write properties to file
async function writeProperties(properties: any[]) {
  await ensureDataDirectory();
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify({ properties }, null, 2));
}

export async function GET() {
  try {
    const data = await readProperties();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading properties:', error);
    return NextResponse.json({ error: 'Failed to read properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    //const { name, value, date, usedtime, worth, description } = body;
    const { name, value, date, description, usedtime, worth } = body;

    //if (!name || !value || !date || !usedtime || !worth) {
      if (!name || !value || !date || !usedtime || !worth) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

    const data = await readProperties();
    const newProperty = {
      id: Date.now().toString(),
      name,
      value: Number(value),
      date,
      usedtime: Number(usedtime),
      worth: Number(worth),
      description: description || '',
    };

    data.properties.push(newProperty);
    await writeProperties(data.properties);

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error adding property:', error);
    return NextResponse.json(
      { error: 'Failed to add property' },
      { status: 500 }
    );
  }
} 