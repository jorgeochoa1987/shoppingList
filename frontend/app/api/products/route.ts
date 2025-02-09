import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

// Corregimos la ruta
const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

// Función auxiliar para asegurar que el archivo existe
async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    // Si el archivo no existe, lo creamos con una estructura inicial
    await fs.writeFile(dataFilePath, JSON.stringify({ items: [] }, null, 2), 'utf8');
  }
}

export async function GET() {
  console.log('GET Request recibido');
  console.log('Ruta del archivo:', dataFilePath);
  
  try {
    await ensureFileExists(); // Aseguramos que el archivo exista antes de leerlo
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    console.log('Datos leídos:', jsonData);
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: Request) {
  console.log('POST Request recibido');
  console.log('Ruta del archivo:', dataFilePath);
  
  try {
    await ensureFileExists(); // Aseguramos que el archivo exista antes de escribir
    
    const newItem = await request.json();
    console.log('Nuevo item recibido:', newItem);

    // Leer el contenido actual
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    if (!Array.isArray(data.items)) {
      data.items = [];
    }
    
    data.items.push(newItem);
    
    // Guardar los datos
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Datos guardados exitosamente');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ 
      error: 'Error al guardar los datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { 
      status: 500 
    });
  }
} 