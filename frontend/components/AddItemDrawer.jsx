import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { grey } from '@mui/material/colors';
import { Box, TextField, Button, Typography } from '@mui/material';

const drawerBleeding = 56;

const StyledBox = styled('div')(() => ({
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

const AddItemDrawer = ({ open, onClose, onOpen, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      name: formData.get('name'),
      quantity: formData.get('quantity')
    });
    onClose();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      swipeAreaWidth={drawerBleeding}
      disableSwipeToOpen={false}
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
        }}
      >
        <Puller />
        <Typography sx={{ p: 2, color: 'text.secondary' }}>
          Agregar Producto
        </Typography>
      </StyledBox>
      <StyledBox
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          px: 2, 
          pb: 2, 
          height: '100%', 
          overflow: 'auto',
          pt: 6
        }}
      >
        <TextField
          fullWidth
          label="Nombre del producto"
          name="name"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Cantidad"
          name="quantity"
          type="number"
          margin="normal"
        />
        <Box sx={{ mt: 2 }}>
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
          >
            Guardar
          </Button>
        </Box>
      </StyledBox>
    </SwipeableDrawer>
  );
};

export default AddItemDrawer; 