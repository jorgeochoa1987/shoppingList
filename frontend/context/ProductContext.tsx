'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Item {
  name: string;
  quantity: string;
  store: string;
  expirationDate: string;
  price: string;
}

interface ProductContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
  addItem: (item: Item) => Promise<void>;
  updateItem: (item: Item, index: number) => Promise<void>;
  deleteItem: (index: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar items al iniciar
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (newItem: Item) => {
    try {
      setLoading(true);
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error('Error al guardar');

      const data = await response.json();
      setItems(data.items);
    } catch (err) {
      setError('Error al agregar el producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (updatedItem: Item, index: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      const data = await response.json();
      setItems(data.items);
    } catch (err) {
      setError('Error al actualizar el producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (index: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${index}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      const data = await response.json();
      setItems(data.items);
    } catch (err) {
      setError('Error al eliminar el producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        items,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
} 