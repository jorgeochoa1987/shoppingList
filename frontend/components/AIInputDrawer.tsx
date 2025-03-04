import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Box, TextField, Button, Typography, SwipeableDrawer, CssBaseline, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  window?: () => Window;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const drawerBleeding = 56;

const Root = styled('div')(() => ({
  height: '100%',
  backgroundColor: grey[100],
}));

const StyledBox = styled(Box)(() => ({
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

const AIInputDrawer = (props: Props) => {
  const { window, open, onClose, onOpen } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('cargando...');
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const inputValue = formData.get('aiInput') as string;
    console.log('inputValue--->:', inputValue);
    try {
      const response = await fetch('http://localhost:8000/api/ai-shopping', {  // Reemplaza con tu URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),
      });

      if (!response.ok) throw new Error('Error al procesar la solicitud');

      const data = await response.json();
      console.log('Respuesta de la API--->:', data);

      onClose(); // Cierra el modal solo si la solicitud fue exitosa
    } catch (err: any) {
      setError(err.message);
      console.error('Error en la API:', err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
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
              Cargar con IA
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
          onSubmit={handleSubmit}
          sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}
        >
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Describe tu lista de compras"
            name="aiInput"
            margin="normal"
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              disabled={loading}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 2,
                height: 48,
                '&:hover': {
                  background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }
              }}
            > 
              {loading ? 'Procesando...' : 'Procesar con IA'}
            </Button>
          </Box>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
};

export default AIInputDrawer;