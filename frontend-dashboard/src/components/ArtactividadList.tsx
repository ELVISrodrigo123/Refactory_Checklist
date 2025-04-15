"use client";
import React, { useState } from "react";
import { Artactividad } from "../services/ArtactividadService";
import { Box, Button, Card, Container, Dialog, DialogProps, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Actividad210Service from "@/services/Actividad210Service";
import { DetailsDialog } from "./test/DetailsDialog";

interface ArtactividadListProps {
  artactividades: Artactividad[];
  onEliminar: (id: number) => void;
  onEditar: (artactividad: Artactividad) => void;
}

const ArtactividadList: React.FC<ArtactividadListProps> = ({ artactividades, onEliminar,
  onEditar }) => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [artactividadToDelete, setArtactividadToDelete] = useState<number | null>(null);

  const handleMostrarActividades = (artactividadId: number) => {
    router.push(`/management/actividad210/${artactividadId}`);
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
    <Container component={Card} maxWidth="lg" sx={{ marginTop: "2em", padding: "2em", display: "grid", gridTemplateColumns: { sm: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(2, 1fr)" }, gap: "1em" }}>
      {artactividades.map((artactividad) => (
        <Card
          key={artactividad.id}
          className="border p-4 mb-2 rounded shadow"
          sx={{ padding: "1em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
        >
          <Typography variant="h3" component="h3" sx={{ fontSize: "1.5em", fontWeight: "bold", textAlign: "center" }}>
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
           {/*  <DetailsDialog id={'1'} /> */}

          </Stack>

          {/* // details Dialog */}


          {/* // on delete confirmation dialog */}
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
        </Card>
      ))}
    </Container>
  );
};

export default ArtactividadList;