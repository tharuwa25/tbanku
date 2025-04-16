import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ASSETS_FILE = path.join(process.cwd(),'public', 'data','assets.json');

function ensureFileExists() {
  const dir = path.dirname(ASSETS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ASSETS_FILE)) {
    fs.writeFileSync(ASSETS_FILE, JSON.stringify({ assets: [] }));
  }
}


function readData() {
  ensureFileExists();
  try {
    const fileContent = fs.readFileSync(ASSETS_FILE, 'utf8');
    let data = JSON.parse(fileContent);
    // Ensure data has the correct structure
    if (!data || typeof data !== 'object') {
      data = { assets: [] };
    }
    if (!Array.isArray(data.assets)) {
      data.assets = [];
    }
    return data;
  } catch (error) {
    // If there's any error reading or parsing the file, return default structure
    return { assets: [] };
  }
}

function writeData(data: any) {
  ensureFileExists();
  // Ensure data has the correct structure before writing
  if (!data || typeof data !== 'object') {
    data = { assets: [] };
  }
  if (!Array.isArray(data.assets)) {
    data.assets = [];
  }
  fs.writeFileSync(ASSETS_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.assets);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to read assets data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newAssets = await request.json();
    const data = readData();
    
    const newId = data.assets.length > 0 
      ? Math.max(...data.assets.map((i: any) => i.id)) + 1 
      : 1;
    
    const assetsWithId = { ...newAssets, id: newId };
    data.assets.push(assetsWithId);
    
    writeData(data);
    return NextResponse.json(assetsWithId);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to add assets' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const data = readData();
    
    data.assets = data.assets.filter((i: any) => i.id !== id);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete assets' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedAssets = await request.json();
    const data = readData();
    
    const index = data.assets.findIndex((i: any) => i.id === updatedAssets.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    data.assets[index] = updatedAssets;
    writeData(data);
    
    return NextResponse.json(updatedAssets);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update assets' }, { status: 500 });
  }
} 


