import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

const storesFilePath = path.join(process.cwd(), 'data', 'stores.json');

// Asegurar que el archivo existe
async function ensureFileExists() {
  try {
    await fs.access(storesFilePath);
  } catch {
    await fs.writeFile(
      storesFilePath, 
      JSON.stringify({ stores: [] }, null, 2), 
      'utf8'
    );
  }
}

export async function GET() {
  try {
    await ensureFileExists();
    const jsonData = await fs.readFile(storesFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Stores Error:', error);
    return NextResponse.json({ stores: [] });
  }
}

export async function POST(request: Request) {
  try {
    await ensureFileExists();
    const newStore = await request.json();
    
    console.log('Intentando guardar nueva tienda:', newStore);

    const jsonData = await fs.readFile(storesFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Verificar si la tienda ya existe (ignorando mayúsculas/minúsculas)
    const storeExists = data.stores.some(
      (store: { name: string }) => 
      store.name.toLowerCase() === newStore.name.toLowerCase()
    );

    if (!storeExists) {
      // Capitalizar el nombre de la tienda
      const formattedName = newStore.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      const storeToAdd = {
        name: formattedName,
        type: "Otro" // Tipo por defecto para nuevas tiendas
      };

      data.stores.push(storeToAdd);
      
      console.log('Guardando nueva tienda:', storeToAdd);
      
      await fs.writeFile(
        storesFilePath, 
        JSON.stringify(data, null, 2), 
        'utf8'
      );
      
      console.log('Tienda guardada exitosamente');
    } else {
      console.log('La tienda ya existe');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('POST Stores Error:', error);
    return NextResponse.json(
      { error: 'Error al guardar la tienda' }, 
      { status: 500 }
    );
  }
} 