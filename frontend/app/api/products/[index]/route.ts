import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

export async function PUT(
  request: Request,
  { params }: { params: { index: string } }
) {
  try {
    const index = parseInt(params.index);
    const updatedItem = await request.json();

    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    if (!Array.isArray(data.items) || index >= data.items.length) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    }

    data.items[index] = updatedItem;
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { index: string } }
) {
  try {
    const index = parseInt(params.index);
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    if (!Array.isArray(data.items) || index >= data.items.length) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    }

    data.items.splice(index, 1);
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json(data);
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
} 