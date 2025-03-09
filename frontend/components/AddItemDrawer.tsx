import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  SwipeableDrawer, 
  CssBaseline, 
  IconButton,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StoreIcon from '@mui/icons-material/Store';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useState, useEffect } from 'react';

interface Props {
  window?: () => Window;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSubmit: (item: {
    name: string;
    quantity: string;
    store: string;
    expirationDate: string;
    price: string;
  }) => Promise<void>;
  editingItem?: Item;
}

interface Store {
  name: string;
  type: string;
}

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
}));

const Puller = styled('div')(() => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const AddItemDrawer = (props: Props) => {
  const { window, open, onClose, onOpen, onSubmit, editingItem } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  
  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState({ 
    name: '',
    quantity: '',
    store: '',
    expirationDate: getCurrentDate(), // Inicializamos con la fecha actual
    price: ''
  });

  const [stores, setStores] = useState<Store[]>([]);
  
  // Cargar las tiendas al montar el componente
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores');
        const data = await response.json();
        setStores(data.stores);
      } catch (error) {
        console.error('Error al cargar tiendas:', error);
      }
    };
    
    fetchStores();
  }, []);

  // También necesitamos resetear el formulario con la fecha actual
  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      store: '',
      expirationDate: getCurrentDate(), // Reseteamos con la fecha actual
      price: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Botón clickeado');

    // Validación de campos requeridos
    if (!formData.name || !formData.quantity || !formData.store || !formData.price) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    console.log('Enviando datos:', formData);
    onSubmit(formData)
      .then(() => {
        console.log('Datos guardados exitosamente');
        resetForm(); // Usamos la función resetForm en lugar de setFormData directo
        onClose();
      })
      .catch((error) => {
        console.error('Error al guardar:', error);
        alert('Error al guardar el producto');
      });
  };

  // Actualizamos el formulario cuando se está editando un item
  React.useEffect(() => {
    if (editingItem && open) {
      setFormData(editingItem);
    } else if (!open) {
      resetForm();
    }
  }, [editingItem, open]);

  const handleStoreChange = async (newValue: string | Store | null) => {
    let storeName = '';
    
    if (typeof newValue === 'string') {
      // Es una nueva tienda ingresada manualmente
      storeName = newValue;
      
      try {
        // Guardar la nueva tienda
        const response = await fetch('/api/stores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: storeName }),
        });

        if (response.ok) {
          const data = await response.json();
          setStores(data.stores);
        }
      } catch (error) {
        console.error('Error al guardar nueva tienda:', error);
      }
    } else if (newValue && 'name' in newValue) {
      // Es una tienda existente seleccionada
      storeName = newValue.name;
    }

    setFormData(prev => ({
      ...prev,
      store: storeName
    }));
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(90% - ${drawerBleeding}px)`,
            overflow: 'visible',
            marginBottom: '80px',
          },
        }}
      />
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Puller />
            <Typography sx={{ p: 2, color: 'text.secondary' }}>
              {editingItem ? 'Editar Producto' : 'Agregar Producto'}
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            size="small"
            aria-label="cerrar"
          >
            <CloseIcon />
          </IconButton>
        </StyledBox>
        <StyledBox
          component="form"
          noValidate
          sx={{ 
            px: 3,
            pb: 3,
            pt: 4,
            height: '100%', 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <TextField
            fullWidth
            label="Nombre del producto"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ShoppingBagIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Cantidad"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
          <Autocomplete
            fullWidth
            options={stores}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              return option.name;
            }}
            value={stores.find(store => store.name === formData.store) || null}
            onChange={(_, newValue) => handleStoreChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tienda"
                name="store"
                required
                helperText="Selecciona una tienda o escribe una nueva"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <StoreIcon />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography>{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type}
                  </Typography>
                </Box>
              </li>
            )}
            freeSolo
            autoComplete
            includeInputInList
          />
          <TextField
            fullWidth
            label="Fecha de vencimiento"
            name="expirationDate"
            type="date"
            value={formData.expirationDate}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Precio"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
              inputProps: { 
                min: 0,
                step: "0.01"
              },
            }}
          />
          <Box sx={{ mt: 'auto', pt: 3, mb: 2 }}>
            <Button 
              fullWidth 
              variant="contained"
              onClick={handleButtonClick}
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                borderRadius: 2,
                height: 48,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                }
              }}
            >
              {editingItem ? 'Actualizar Producto' : 'Guardar Producto'}
            </Button>
          </Box>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
};

export default AddItemDrawer; 