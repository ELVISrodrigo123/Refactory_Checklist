import React, { useState, useEffect, useCallback } from "react";
import {
    Box, TextField, Button, List, ListItem, ListItemText, 
    ListItemSecondaryAction, Divider, IconButton, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, useTheme
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { getSectores, createSector, updateSector, deleteSector } from "@/services/Sector";

interface Sector {
    id: number;
    nombre: string;
    descripcion: string;
}

const SectorComponent = () => {
    const theme = useTheme();
    const [sectores, setSectores] = useState<Sector[]>([]);
    const [sectorActual, setSectorActual] = useState<Partial<Sector>>({ 
        nombre: "", 
        descripcion: "" 
    });
    const [dialogoAbierto, setDialogoAbierto] = useState(false);
    const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

    // Cargar sectores
    useEffect(() => { 
        cargarSectores(); 
    }, []);

    const cargarSectores = useCallback(async () => {
        try { 
            const data = await getSectores();
            setSectores(data); 
        } catch (error) { 
            console.error("Error al obtener sectores:", error); 
        }
    }, []);

    const manejarCambio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSectorActual(prev => ({ ...prev, [name]: value }));
    }, []);

    const manejarAccionSector = useCallback(async () => {
        if (!sectorActual.nombre?.trim()) return;
    
        try {
            if (sectorActual.id) {
                const actualizado = await updateSector(sectorActual.id, {
                    nombre: sectorActual.nombre,
                    descripcion: sectorActual.descripcion || ""
                });
                setSectores(sectores.map(s => s.id === actualizado.id ? actualizado : s));
            } else {
                const nuevoSector = await createSector({
                    nombre: sectorActual.nombre,
                    descripcion: sectorActual.descripcion || ""
                });
                setSectores([...sectores, nuevoSector]);
            }
            cerrarDialogo();
        } catch (error) {
            console.error("Error al guardar sector:", error);
        }
    }, [sectorActual, sectores]);
    
    const confirmarEliminar = useCallback((id: number) => {
        setIdAEliminar(id);
        setConfirmacionAbierta(true);
    }, []);

    const manejarEliminar = useCallback(async () => {
        if (idAEliminar === null) return;
        try {
            await deleteSector(idAEliminar);
            setSectores(sectores.filter(s => s.id !== idAEliminar));
        } catch (error) {
            console.error("Error al eliminar sector:", error);
        }
        setConfirmacionAbierta(false);
        setIdAEliminar(null);
    }, [idAEliminar, sectores]);

    const abrirDialogo = useCallback((sector?: Sector) => {
        setSectorActual(sector ?? { nombre: "", descripcion: "" });
        setDialogoAbierto(true);
    }, []);

    const cerrarDialogo = useCallback(() => {
        setDialogoAbierto(false);
        setSectorActual({ nombre: "", descripcion: "" });
    }, []);

    return (
        <Box sx={{ 
            flex: 1, 
            p: 3, 
            m: 3, 
        }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Gestión de Sectores
            </Typography>
            
            <Button 
                variant="contained" 
                onClick={() => abrirDialogo()}
                sx={{ mb: 3 }}
            >
                Crear Nuevo Sector
            </Button>

            <Typography variant="h6" sx={{mb:4}}>
                Sectores Disponibles
            </Typography>
            
            <List sx={{ 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
            }}>
                {sectores.length === 0 ? (
                    <ListItem>
                        <ListItemText 
                            primary="No hay sectores creados." 
                        />
                    </ListItem>
                ) : (
                    sectores.map((sector, index) => (
                        <React.Fragment key={sector.id}>
                            <ListItem>
                                <ListItemText 
                                    primary={sector.nombre} 
                                    secondary={sector.descripcion} 
                                />
                                <ListItemSecondaryAction sx={{display:'flex',gap:1}}>
                                    <IconButton 
                                        edge="end" 
                                        onClick={() => abrirDialogo(sector)}
                                        color="warning"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        edge="end" 
                                        onClick={() => confirmarEliminar(sector.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < sectores.length - 1 && <Divider />}
                        </React.Fragment>
                    ))
                )}
            </List>

            {/* Diálogo para crear/editar sector */}
            <Dialog open={dialogoAbierto} onClose={cerrarDialogo} fullWidth maxWidth="sm">
                <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {sectorActual.id ? "Editar Sector" : "Crear Nuevo Sector"}
                </DialogTitle>
                <DialogContent sx={{ py: 2 }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nombre del Sector"
                        name="nombre"
                        value={sectorActual.nombre || ""}
                        onChange={manejarCambio}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Descripción"
                        name="descripcion"
                        value={sectorActual.descripcion || ""}
                        onChange={manejarCambio}
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Button onClick={cerrarDialogo}>Cancelar</Button>
                    <Button 
                        onClick={manejarAccionSector} 
                        variant="contained"
                        disabled={!sectorActual.nombre?.trim()}
                        color="primary"
                    >
                        {sectorActual.id ? "Actualizar" : "Crear"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmación para eliminar */}
            <Dialog open={confirmacionAbierta} onClose={() => setConfirmacionAbierta(false)}>
                <DialogTitle>¿Estás seguro de eliminar este sector?</DialogTitle>
                <DialogActions>
                    <Button sx={{ backgroundColor: '#1E293B', color: 'white' }} onClick={() => setConfirmacionAbierta(false)}>Cancelar</Button>
                    <Button 
                        onClick={manejarEliminar} 
                        color="error"
                        variant="contained"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default React.memo(SectorComponent);