import React, { useState, useEffect, useCallback } from "react";
import {
    Box, TextField, Button, List, ListItem, ListItemText, Divider, IconButton, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
    Grid, Paper, InputAdornment, CircularProgress, Pagination, Chip, useMediaQuery
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon
} from "@mui/icons-material";
import {
    getTitulosChecklist,
    createTituloChecklist,
    updateTituloChecklist,
    deleteTituloChecklist
} from "../../../../services/TitulosCkecklist";
import { getFormularios } from "../../../../services/Formulario";
import { TituloChecklistModel } from "../../../../models/TituloChecklist";

interface Formulario {
    id: number;
    titulo: string;
}

const ITEMS_PER_PAGE = 15;

const TituloChecklist = () => {
    const [titulos, setTitulos] = useState<TituloChecklistModel[]>([]);
    const [formularios, setFormularios] = useState<Formulario[]>([]);
    const [nuevoTitulo, setNuevoTitulo] = useState(new TituloChecklistModel());
    const [tituloEditando, setTituloEditando] = useState<TituloChecklistModel | null>(null);
    const [dialogoAbierto, setDialogoAbierto] = useState(false);
    const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [cargando, setCargando] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    const cargarFormularios = useCallback(async () => {
        try {
            const data: Formulario[] = await getFormularios();
            setFormularios(data);
        } catch (error) {
            console.error("Error al obtener formularios:", error);
        }
    }, []);

    const cargarTitulos = useCallback(async () => {
        setCargando(true);
        try {
            const data = await getTitulosChecklist();
            setTitulos(data.map(t => new TituloChecklistModel(t.id, t.nombre, t.formulario)));
            setPaginaActual(1);
        } catch (error) {
            console.error("Error al obtener títulos de checklist:", error);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarFormularios();
        cargarTitulos();
    }, [cargarFormularios, cargarTitulos]);

    const titulosFiltrados = titulos.filter(t =>
        terminoBusqueda ?
            t.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            formularios.find(f => f.id === t.formulario)?.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) :
            true
    );

    const totalPaginas = Math.ceil(titulosFiltrados.length / ITEMS_PER_PAGE);
    const inicio = (paginaActual - 1) * ITEMS_PER_PAGE;
    const fin = inicio + ITEMS_PER_PAGE;
    const titulosPagina = titulosFiltrados.slice(inicio, fin);

    const handleBuscar = () => {
        setPaginaActual(1);
    };

    const handleCrearTitulo = async () => {
        if (!nuevoTitulo.isValid()) return;
        try {
            const tituloCreado = await createTituloChecklist(nuevoTitulo);
            setTitulos(prev => [...prev, new TituloChecklistModel(
                tituloCreado.id,
                tituloCreado.nombre,
                tituloCreado.formulario
            )]);
            setNuevoTitulo(new TituloChecklistModel());
        } catch (error) {
            console.error("Error al crear título de checklist:", error);
        }
    };

    const handleEditarTitulo = async () => {
        if (!tituloEditando || !tituloEditando.isValid()) return;
        try {
            const tituloActualizado = await updateTituloChecklist(tituloEditando.id, tituloEditando);
            setTitulos(prev => prev.map(t =>
                t.id === tituloActualizado.id
                    ? new TituloChecklistModel(
                        tituloActualizado.id,
                        tituloActualizado.nombre,
                        tituloActualizado.formulario
                    )
                    : t
            ));
            setTituloEditando(null);
            setDialogoAbierto(false);
        } catch (error) {
            console.error("Error al editar título de checklist:", error);
        }
    };

    const handleEliminarTitulo = (id: number) => {
        setIdAEliminar(id);
        setConfirmacionAbierta(true);
    };

    const confirmarEliminacion = async () => {
        if (idAEliminar === null) return;
        try {
            await deleteTituloChecklist(idAEliminar);
            setTitulos(prev => prev.filter(t => t.id !== idAEliminar));
        } catch (error) {
            console.error("Error al eliminar título de checklist:", error);
        }
        setConfirmacionAbierta(false);
        setIdAEliminar(null);
    };

    const cancelarEliminacion = () => {
        setConfirmacionAbierta(false);
        setIdAEliminar(null);
    };

    const actualizarNuevoTitulo = (campo: keyof TituloChecklistModel, valor: string | number) => {
        setNuevoTitulo(prev => {
            const nuevo = new TituloChecklistModel(prev.id, prev.nombre, prev.formulario);
            nuevo[campo] = valor;
            return nuevo;
        });
    };

    const actualizarTituloEditando = (campo: keyof TituloChecklistModel, valor: string | number) => {
        setTituloEditando(prev => {
            if (!prev) return null;
            const nuevo = new TituloChecklistModel(prev.id, prev.nombre, prev.formulario);
            nuevo[campo] = valor;
            return nuevo;
        });
    };

    return (
        <Box sx={{ flex: 1, bgcolor: "#1E293B", p: 3, borderRadius: 2, color: "white" }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                Gestión de Títulos de Checklist
            </Typography>

            {/* Sección de creación */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#334155' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Crear Nuevo Título
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nombre del Título *"
                            value={nuevoTitulo.nombre}
                            onChange={(e) => actualizarNuevoTitulo("nombre", e.target.value)}
                            sx={{ bgcolor: "white", borderRadius: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ bgcolor: "white", borderRadius: 1 }}>
                            <InputLabel>Formulario *</InputLabel>
                            <Select
                                value={nuevoTitulo.formulario}
                                onChange={(e) => actualizarNuevoTitulo("formulario", Number(e.target.value))}
                                label="Formulario *"
                            >
                                <MenuItem value={0}>Seleccione un formulario</MenuItem>
                                {formularios.map((formulario) => (
                                    <MenuItem key={formulario.id} value={formulario.id}>
                                        {formulario.titulo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleCrearTitulo}
                            disabled={!nuevoTitulo.isValid()}
                            sx={{ height: '50px', bgcolor: '#2759ac', '&:hover': { bgcolor: '#1e3d8b' } }}
                        >
                            Crear Título
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Barra de búsqueda */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: '#334155' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={8} md={9}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar por nombre o formulario..."
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'white' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#64748B'
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleBuscar}
                            sx={{ height: '56px', bgcolor: '#2759ac', '&:hover': { bgcolor: '#1e3d8b' } }}
                        >
                            Buscar
                        </Button>
                    </Grid>
                </Grid>

                {terminoBusqueda && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                            label={`${titulosFiltrados.length} resultados`}
                            color="info"
                            sx={{ color: 'white' }}
                        />
                        <Button
                            variant="text"
                            onClick={() => {
                                setTerminoBusqueda('');
                                cargarTitulos();
                            }}
                            startIcon={<RefreshIcon />}
                            sx={{ color: 'white' }}
                        >
                            Limpiar
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Lista de títulos con paginación */}
            {cargando ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : titulosFiltrados.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#334155' }}>
                    <Typography>
                        {terminoBusqueda ?
                            "No se encontraron títulos" :
                            "No hay títulos creados"}
                    </Typography>
                </Paper>
            ) : (
                <>
                    <Grid container spacing={isMobile ? 0 : 2}>
                        <Grid item xs={12} md={isMobile ? 12 : 6}>
                            <List sx={{
                                maxHeight: '60vh',
                                overflowY: 'auto',
                                bgcolor: '#334155',
                                borderRadius: 2,
                                p: 1
                            }}>
                                {titulosPagina.slice(0, Math.ceil(titulosPagina.length / (isMobile ? 1 : 2))).map((titulo) => (
                                    <React.Fragment key={titulo.id}>
                                        <ListItem
                                            secondaryAction={
                                                <Box>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="editar"
                                                        onClick={() => {
                                                            setTituloEditando(titulo);
                                                            setDialogoAbierto(true);
                                                        }}
                                                        sx={{ color: "white" }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="eliminar"
                                                        onClick={() => handleEliminarTitulo(titulo.id)}
                                                        sx={{ color: "white" }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ fontWeight: 'bold' }}>
                                                        {titulo.nombre}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                                                        Formulario: {formularios.find(f => f.id === titulo.formulario)?.titulo || 'Desconocido'}
                                                    </Typography>
                                                }
                                                sx={{ color: 'white' }}
                                            />
                                        </ListItem>
                                        <Divider sx={{ bgcolor: '#64748B' }} />
                                    </React.Fragment>
                                ))}
                            </List>
                        </Grid>

                        {!isMobile && (
                            <Grid item xs={12} md={6}>
                                <List sx={{
                                    maxHeight: '60vh',
                                    overflowY: 'auto',
                                    bgcolor: '#334155',
                                    borderRadius: 2,
                                    p: 1
                                }}>
                                    {titulosPagina.slice(Math.ceil(titulosPagina.length / 2)).map((titulo) => (
                                        <React.Fragment key={titulo.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <Box>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="editar"
                                                            onClick={() => {
                                                                setTituloEditando(titulo);
                                                                setDialogoAbierto(true);
                                                            }}
                                                            sx={{ color: "white" }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="eliminar"
                                                            onClick={() => handleEliminarTitulo(titulo.id)}
                                                            sx={{ color: "white" }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography sx={{ fontWeight: 'bold' }}>
                                                            {titulo.nombre}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                                                            Formulario: {formularios.find(f => f.id === titulo.formulario)?.titulo || 'Desconocido'}
                                                        </Typography>
                                                    }
                                                    sx={{ color: 'white' }}
                                                />
                                            </ListItem>
                                            <Divider sx={{ bgcolor: '#64748B' }} />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Grid>
                        )}
                    </Grid>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPaginas}
                                page={paginaActual}
                                onChange={(_, page) => setPaginaActual(page)}
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'white'
                                    },
                                    '& .Mui-selected': {
                                        bgcolor: '#2759ac'
                                    }
                                }}
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Diálogos */}
            <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: '#334155', color: 'white' }}>Editar Título</DialogTitle>
                <DialogContent sx={{ bgcolor: '#334155' }}>
                    <TextField
                        fullWidth
                        label="Nombre del Título"
                        value={tituloEditando?.nombre || ""}
                        onChange={(e) => actualizarTituloEditando("nombre", e.target.value)}
                        sx={{ mt: 2, bgcolor: "white", borderRadius: 1 }}
                        required
                    />
                    <FormControl fullWidth sx={{ mt: 2, bgcolor: "white", borderRadius: 1 }}>
                        <InputLabel>Formulario</InputLabel>
                        <Select
                            value={tituloEditando?.formulario || 0}
                            onChange={(e) => actualizarTituloEditando("formulario", Number(e.target.value))}
                            label="Formulario"
                            required
                        >
                            <MenuItem value={0}>Seleccione un formulario</MenuItem>
                            {formularios.map((formulario) => (
                                <MenuItem key={formulario.id} value={formulario.id}>
                                    {formulario.titulo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#334155' }}>
                    <Button
                        onClick={() => setDialogoAbierto(false)}
                        sx={{ color: 'white', '&:hover': { bgcolor: '#64748B' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleEditarTitulo}
                        disabled={!tituloEditando?.isValid()}
                        sx={{ bgcolor: '#2759ac', color: 'white', '&:hover': { bgcolor: '#1e3d8b' } }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmacionAbierta} onClose={cancelarEliminacion} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: '#334155', color: 'white' }}>
                    ¿Confirmar eliminación?
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#334155', color: 'white' }}>
                    Esta acción no se puede deshacer. ¿Estás seguro de eliminar este título?
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#334155' }}>
                    <Button
                        onClick={cancelarEliminacion}
                        sx={{ color: 'white', '&:hover': { bgcolor: '#64748B' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmarEliminacion}
                        color="error"
                        sx={{ '&:hover': { bgcolor: '#7f1d1d' } }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TituloChecklist;