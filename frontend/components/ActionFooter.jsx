import { 
  Paper, 
  Button, 
  Box 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const ActionFooter = ({ onAILoad, onAddItem }) => {
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
        gap: 2
      }}
      elevation={3}
    >
      <Button 
        variant="contained" 
        startIcon={<SmartToyIcon />}
        onClick={onAILoad}
        fullWidth
      >
        Cargar con IA
      </Button>
      <Button 
        variant="contained" 
        color="secondary"
        startIcon={<AddIcon />}
        onClick={onAddItem}
        fullWidth
      >
        + Agregar
      </Button>
    </Paper>
  );
};

export default ActionFooter; 