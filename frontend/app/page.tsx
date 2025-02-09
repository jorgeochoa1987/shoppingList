"use client"
import { useState, useEffect } from 'react';
import ShoppingList from '../components/ShoppingList';
import ActionFooter from '../components/ActionFooter';
import AddItemDrawer from '../components/AddItemDrawer';
import AIInputDrawer from '../components/AIInputDrawer';
import { Container } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';

interface Item {
  name: string;
  quantity: string;
  store: string;
  expirationDate: string;
  price: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: Item; index: number } | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Cargar items al iniciar
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Fetch error:', error);
      showSnackbar('Error al cargar los productos', 'error');
      setItems([]);
    }
  };

  const handleEditItem = (item: Item, index: number) => {
    setEditingItem({ item, index });
    setIsAddOpen(true);
  };

  const handleAddOrUpdateItem = async (newItem: Item) => {
    try {
      if (editingItem) {
        // Actualizar item existente
        const response = await fetch(`/api/products/${editingItem.index}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });

        if (!response.ok) throw new Error('Error al actualizar');

        const updatedItems = [...items];
        updatedItems[editingItem.index] = newItem;
        setItems(updatedItems);
        setEditingItem(null);
      } else {
        // Crear nuevo item
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
      }

      setIsAddOpen(false);
      showSnackbar(
        editingItem ? 'Producto actualizado correctamente' : 'Producto guardado correctamente',
        'success'
      );
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(
        error instanceof Error ? error.message : 'Error al procesar el producto',
        'error'
      );
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleAILoad = () => {
    setIsAddOpen(false);
    setIsAIOpen(true);
  };

  const handleAddItem = () => {
    setIsAIOpen(false);
    setIsAddOpen(true);
  };

  const handleAISubmit = (aiInput: string) => {
    console.log('Procesando con IA:', aiInput);
    setIsAIOpen(false);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
  };

  const handleCloseAI = () => {
    setIsAIOpen(false);
  };

  const handleDeleteItem = async (index: number) => {
    try {
      const response = await fetch(`/api/products/${index}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      showSnackbar('Producto eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(
        error instanceof Error ? error.message : 'Error al eliminar el producto',
        'error'
      );
    }
  };

  return (
    <Container sx={{ pb: 10 }}>
      <ShoppingList 
        items={items} 
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />
      <ActionFooter 
        onAILoad={handleAILoad}
        onAddItem={handleAddItem}
      />
      
      <AddItemDrawer
        open={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingItem(null);
        }}
        onOpen={() => setIsAddOpen(true)}
        onSubmit={handleAddOrUpdateItem}
        editingItem={editingItem?.item}
      />
      
      <AIInputDrawer
        open={isAIOpen}
        onClose={handleCloseAI}
        onOpen={() => setIsAIOpen(true)}
        onSubmit={handleAISubmit}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 