import { useRouter } from "next/router";
import React, { useState } from "react";
import { Artactividad } from "../services/ArtactividadService";
import { 
  Button, 
  Box, 
  Typography, 
  Stack, 
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ArtactividadListProps {
  artactividades: Artactividad[];
  onEliminar: (id: number) => void;
  onEditar: (artactividad: Artactividad) => void;
}

const ArtactividadList = ({ 
  artactividades, 
  onEliminar, 
  onEditar 
}: ArtactividadListProps) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [artactividadToDelete, setArtactividadToDelete] = useState<number | null>(null);

  const handleMostrarActividades = (artactividadId: number) => {
    router.push(`/management/actividades/${artactividadId}`);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setArtactividadToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setArtactividadToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (artactividadToDelete) {
      onEliminar(artactividadToDelete);
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {artactividades.map((artactividad) => (
        <Paper 
          key={artactividad.id} 
          elevation={3}
          sx={{ 
            p: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {artactividad.nombre}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
              onClick={() => onEditar(artactividad)}
              sx={{ 
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenDeleteDialog(artactividad.id!)}
              sx={{ 
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Eliminar
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<VisibilityIcon />}
              onClick={() => handleMostrarActividades(artactividad.id!)}
              sx={{ 
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Mostrar Actividades
            </Button>
          </Stack>
        </Paper>
      ))}

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="primary" >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArtactividadList;