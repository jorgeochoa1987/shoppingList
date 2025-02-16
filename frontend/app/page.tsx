"use client"
import { useProducts } from '../context/ProductContext';
import ShoppingList from '../components/ShoppingList';
import ActionFooter from '../components/ActionFooter';
import AddItemDrawer from '../components/AddItemDrawer';
import AIInputDrawer from '../components/AIInputDrawer';
import { Container, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

interface Item {
  name: string;
  quantity: string;
  store: string;
  expirationDate: string;
  price: string;
}

const HomePage = () => {
  const { items, addItem, updateItem, deleteItem } = useProducts();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: Item; index: number } | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleEditItem = (item: Item, index: number) => {
    setEditingItem({ item, index });
    setIsAddOpen(true);
  };

  const handleAddOrUpdateItem = async (newItem: Item) => {
    try {
      if (editingItem) {
        await updateItem(newItem, editingItem.index);
        setEditingItem(null);
      } else {
        await addItem(newItem);
      }
      setIsAddOpen(false);
      showSnackbar(
        editingItem ? 'Producto actualizado correctamente' : 'Producto guardado correctamente',
        'success'
      );
    } catch (error) {
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

  return (
    <Container sx={{ pb: 10 }}>
      <ShoppingList 
        items={items} 
        onEditItem={handleEditItem}
        onDeleteItem={deleteItem}
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
        onClose={() => setIsAIOpen(false)}
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
};

export default HomePage; 