import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Item {
  name: string;
  quantity: string;
  store: string;
  expirationDate: string;
  price: string;
}

interface Props {
  items: Item[];
  onEditItem: (item: Item, index: number) => void;
  onDeleteItem: (index: number) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.2s',
  '.MuiListItem-root:hover &': {
    opacity: 1,
  },
}));

const ShoppingList = ({ items, onEditItem, onDeleteItem }: Props) => {
  return (
    <StyledPaper elevation={2}>
      <Typography variant="h6" component="h2" gutterBottom>
        Lista de Compras
      </Typography>
      <List>
        {items.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
            No hay productos en la lista
          </Typography>
        ) : (
          items.map((item, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <StyledListItem>
                <ActionButtons>
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem(item, index);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('¿Está seguro de eliminar este producto?')) {
                          onDeleteItem(index);
                        }
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ActionButtons>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: 2,
                  width: '100%',
                  mt: 1
                }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Cantidad
                    </Typography>
                    <Typography>{item.quantity}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Tienda
                    </Typography>
                    <Typography>{item.store}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Precio
                    </Typography>
                    <Typography>${item.price}</Typography>
                  </Box>
                </Box>
              </StyledListItem>
              {index < items.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </List>
    </StyledPaper>
  );
};

export default ShoppingList; 