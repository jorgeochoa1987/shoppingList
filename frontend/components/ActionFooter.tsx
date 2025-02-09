import { Paper, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { styled } from '@mui/material/styles';

interface ActionFooterProps {
  onAILoad: () => void;
  onAddItem: () => void;
}

// Botón personalizado con efecto de hover y sombra
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const ActionFooter = ({ onAILoad, onAddItem }: ActionFooterProps) => {
  return (
    <Paper 
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 2,
        display: 'flex',
        justifyContent: 'space-around',
        gap: 2,
        zIndex: 1300, // Este valor es mayor que el del drawer por defecto
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
      elevation={3}
    >
      <StyledButton 
        variant="contained" 
        startIcon={<SmartToyIcon />}
        onClick={onAILoad}
        fullWidth
        sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)',
          }
        }}
      >
        Cargar con IA
      </StyledButton>
      <StyledButton 
        variant="contained" 
        startIcon={<AddIcon />}
        onClick={onAddItem}
        fullWidth
        sx={{
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)',
          }
        }}
      >
        Agregar
      </StyledButton>
    </Paper>
  );
};

export default ActionFooter; 