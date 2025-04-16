import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ASSETS_FILE = path.join(process.cwd(), 'public', 'data', 'assets.json');

interface Asset {
  id: number;
  name: string;
  value: number;
  // Add more fields as needed
  [key: string]: unknown;
}

function ensureFileExists() {
  const dir = path.dirname(ASSETS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ASSETS_FILE)) {
    fs.writeFileSync(ASSETS_FILE, JSON.stringify({ assets: [] }));
  }
}

function readData(): { assets: Asset[] } {
  ensureFileExists();
  try {
    const fileContent = fs.readFileSync(ASSETS_FILE, 'utf8');
    const data = JSON.parse(fileContent);
    if (!data || typeof data !== 'object' || !Array.isArray(data.assets)) {
      return { assets: [] };
    }
    return { assets: data.assets as Asset[] };
  } catch (err) {
    console.error('readData Error:', err);
    return { assets: [] };
  }
}

function writeData(data: { assets: Asset[] }) {
  ensureFileExists();
  fs.writeFileSync(ASSETS_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.assets);
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Failed to read assets data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation — make this stricter as needed
    if (typeof body.name !== 'string' || typeof body.value !== 'number') {
      return NextResponse.json({ error: 'Invalid asset data' }, { status: 400 });
    }

    const newId = readData().assets.length > 0
      ? Math.max(...readData().assets.map((i) => i.id)) + 1
      : 1;

    const assetWithId: Asset = { ...body, id: newId };
    const data = readData();
    data.assets.push(assetWithId);

    writeData(data);
    return NextResponse.json(assetWithId);
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to add asset' }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { id }: { id: number } = await request.json();
    const data = readData();

    data.assets = data.assets.filter((i) => i.id !== id);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete assets' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedAsset: Asset = await request.json();
    const data = readData();

    const index = data.assets.findIndex((i) => i.id === updatedAsset.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    data.assets[index] = updatedAsset;
    writeData(data);

    return NextResponse.json(updatedAsset);
  } catch (err) {
    console.error('PUT Error:', err);
    return NextResponse.json({ error: 'Failed to update assets' }, { status: 500 });
  }
}
