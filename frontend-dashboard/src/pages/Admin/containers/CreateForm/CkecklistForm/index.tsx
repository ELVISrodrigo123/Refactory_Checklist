import React, { useState, useEffect } from "react";
import {
    Box, TextField, Button, List, ListItem, ListItemText, Divider, IconButton, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid,
    Chip, Avatar, Paper, InputAdornment, Stack
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    getFormularios,
    createFormulario,
    updateFormulario,
    deleteFormulario,
    cambiarEstadoFormulario,
    buscarFormularioPorCodigo
} from "../../../../services/Formulario";
import { getSectores } from "../../../../services/Sector";
import { FormularioChecklist, ESTADOS_FORMULARIO } from "../../../../models/FormularioChecklist";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';

interface Sector {
    id: number;
    nombre: string;
}

const FormularioChecklistComponent = () => {
    const [formularios, setFormularios] = useState<FormularioChecklist[]>([]);
    const [sectores, setSectores] = useState<Sector[]>([]);
    const [nuevoFormulario, setNuevoFormulario] = useState<Partial<FormularioChecklist>>({
        titulo: '',
        sector: 0,
        item: '',
        aspecto_a_verificar: '',
        bueno: '',
        malo: '',
        comentarios: '',
        estado: 'pendiente',
        version: '1',
        codigo: ''
    });
    const [formularioEditando, setFormularioEditando] = useState<FormularioChecklist | null>(null);
    const [dialogoAbierto, setDialogoAbierto] = useState(false);
    const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [modoBusqueda, setModoBusqueda] = useState(false);
    const [errores, setErrores] = useState({
        codigo: '',
        version: '',
        titulo: '',
        sector: ''
    });

    useEffect(() => {
        cargarFormularios();
        cargarSectores();
    }, []);

    const cargarFormularios = async () => {
        try {
            const data = await getFormularios();
            setFormularios(data);
            setModoBusqueda(false);
        } catch (error) {
            console.error("Error al obtener formularios:", error);
        }
    };

    const cargarSectores = async () => {
        try {
            const data = await getSectores();
            setSectores(data);
        } catch (error) {
            console.error("Error al obtener sectores:", error);
        }
    };

    const handleBuscarPorCodigo = async () => {
        if (!terminoBusqueda.trim()) {
            cargarFormularios();
            return;
        }

        try {
            const resultados = await buscarFormularioPorCodigo(terminoBusqueda.trim());

            if (resultados.length === 0) {
                setFormularios([]);
            } else {
                setFormularios(resultados);
            }

            setModoBusqueda(true);
        } catch (error) {
            console.error("Error al buscar formularios:", error);
            setFormularios([]);
            setModoBusqueda(true);
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {
            codigo: !nuevoFormulario.codigo ? 'El código es requerido' : '',
            version: !nuevoFormulario.version ? 'La versión es requerida' : '',
            titulo: !nuevoFormulario.titulo ? 'El título es requerido' : '',
            sector: !nuevoFormulario.sector ? 'El sector es requerido' : ''
        };
        setErrores(nuevosErrores);
        return !Object.values(nuevosErrores).some(error => error !== '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNuevoFormulario(prev => ({
            ...prev,
            [name]: value
        }));
        if (errores[name as keyof typeof errores]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCrearFormulario = async () => {
        if (!validarFormulario()) return;

        try {
            const formularioCreado = await createFormulario(nuevoFormulario as FormularioChecklist);
            setFormularios([formularioCreado, ...formularios]);
            setNuevoFormulario({
                titulo: '',
                sector: 0,
                item: '',
                aspecto_a_verificar: '',
                bueno: '',
                malo: '',
                comentarios: '',
                estado: 'pendiente',
                version: '1',
                codigo: ''
            });
        } catch (error: any) {
            console.error("Error al crear formulario:", error);
            if (error.message.includes("código")) {
                setErrores(prev => ({ ...prev, codigo: error.message }));
            }
        }
    };

    const handleEditarFormulario = async () => {
        if (!formularioEditando) return;

        try {
            const formularioActualizado = await updateFormulario(formularioEditando.id, formularioEditando);
            setFormularios(formularios.map(f => f.id === formularioActualizado.id ? formularioActualizado : f));
            setFormularioEditando(null);
            setDialogoAbierto(false);
        } catch (error) {
            console.error("Error al editar formulario:", error);
        }
    };

    const handleEliminarFormulario = async (id: number) => {
        setIdAEliminar(id);
        setConfirmacionAbierta(true);
    };

    const confirmarEliminacion = async () => {
        if (idAEliminar === null) return;
        try {
            await deleteFormulario(idAEliminar);
            setFormularios(formularios.filter(f => f.id !== idAEliminar));
        } catch (error) {
            console.error("Error al eliminar formulario:", error);
        }
        setConfirmacionAbierta(false);
        setIdAEliminar(null);
    };

    const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
        try {
            const formularioActualizado = await cambiarEstadoFormulario(id, nuevoEstado);
            setFormularios(formularios.map(f =>
                f.id === id ? formularioActualizado : f
            ));
        } catch (error) {
            console.error("Error al cambiar estado del formulario:", error);
        }
    };

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'aprobado': return <CheckCircleIcon color="success" />;
            case 'pendiente': return <PendingIcon color="warning" />;
            case 'en_revision': return <AutorenewIcon color="info" />;
            case 'rechazado': return <CancelIcon color="error" />;
            default: return <PendingIcon />;
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'aprobado': return 'success';
            case 'pendiente': return 'warning';
            case 'en_revision': return 'info';
            case 'rechazado': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ flex: 1, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Crear Formulario Checklist</Typography>

            <FormControl fullWidth sx={{ mb: 2, borderRadius: 1 }} error={!!errores.sector}>
                <InputLabel id="sector-label">Sector *</InputLabel>
                <Select
                    labelId="sector-label"
                    name="sector"
                    value={nuevoFormulario.sector || 0}
                    onChange={(e) => {
                        setNuevoFormulario({ ...nuevoFormulario, sector: Number(e.target.value) });
                        if (errores.sector) setErrores({ ...errores, sector: '' });
                    }}
                    label="Sector *"
                >
                    <MenuItem value={0}>Seleccione un sector</MenuItem>
                    {sectores.map((sector) => (
                        <MenuItem key={sector.id} value={sector.id}>
                            {sector.nombre}
                        </MenuItem>
                    ))}
                </Select>
                {errores.sector && <Typography variant="caption" color="error">{errores.sector}</Typography>}
            </FormControl>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        name="titulo"
                        label="Título del Formulario *"
                        value={nuevoFormulario.titulo || ''}
                        onChange={handleInputChange}
                        error={!!errores.titulo}
                        helperText={errores.titulo}
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <TextField
                        fullWidth
                        name="codigo"
                        label="Código *"
                        value={nuevoFormulario.codigo || ''}
                        onChange={handleInputChange}
                        error={!!errores.codigo}
                        helperText={errores.codigo}
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <TextField
                        fullWidth
                        name="version"
                        label="Versión *"
                        value={nuevoFormulario.version || ''}
                        onChange={handleInputChange}
                        error={!!errores.version}
                        helperText={errores.version}

                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        fullWidth
                        name="item"
                        label="Ítem"
                        value={nuevoFormulario.item || ''}
                        onChange={handleInputChange}

                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        fullWidth
                        name="aspecto_a_verificar"
                        label="Aspecto a Verificar"
                        value={nuevoFormulario.aspecto_a_verificar || ''}
                        onChange={handleInputChange}

                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        fullWidth
                        name="bueno"
                        label="Condición Buena"
                        value={nuevoFormulario.bueno || ''}
                        onChange={handleInputChange}

                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        fullWidth
                        name="malo"
                        label="Condición Mala"
                        value={nuevoFormulario.malo || ''}
                        onChange={handleInputChange}

                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        fullWidth
                        name="comentarios"
                        label="Comentarios"
                        value={nuevoFormulario.comentarios || ''}
                        onChange={handleInputChange}

                    />
                </Grid>
            </Grid>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCrearFormulario}
            >
                Crear Formulario
            </Button>


            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Formularios Disponibles</Typography>

            <Paper sx={{ mb: 3, p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por código exacto..."
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleBuscarPorCodigo()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),

                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleBuscarPorCodigo}
                        disabled={!terminoBusqueda.trim()}
                    >
                        Buscar
                    </Button>
                </Stack>
                {modoBusqueda && (
                    <Button
                        fullWidth
                        variant="text"
                        onClick={cargarFormularios}
                        startIcon={<RefreshIcon />}
                    >
                        Mostrar todos
                    </Button>
                )}
            </Paper>

            <List>
                {formularios.length === 0 ? (
                    <ListItem>
                        <ListItemText
                            primary={modoBusqueda ? "No se encontraron formularios" : "No hay formularios creados"}
                        />
                    </ListItem>
                ) : (
                    formularios.map((formulario) => (
                        <Paper key={formulario.id} sx={{ mb: 2 }}>
                            <ListItem
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            edge="end"
                                            aria-label="editar"
                                            onClick={() => {
                                                setFormularioEditando(formulario);
                                                setDialogoAbierto(true);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="eliminar"
                                            onClick={() => handleEliminarFormulario(formulario.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {formulario.titulo}
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    sx={{ ml: 3 }}
                                                >
                                                    v{formulario.version} | {formulario.codigo}
                                                </Typography>
                                            </Typography>
                                            <Chip
                                                label={ESTADOS_FORMULARIO.find(e => e.value === formulario.estado)?.label}
                                                color={getEstadoColor(formulario.estado)}
                                                size="small" icon={getEstadoIcon(formulario.estado)}
                                                sx={{ mt: 0.5, mb: 1 }}
                                            />
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </Paper>
                    ))
                )}
            </List>

            <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} fullWidth maxWidth="md">
                <DialogTitle >Editar Formulario</DialogTitle>
                <DialogContent >
                    {formularioEditando && (
                        <>
                            <TextField
                                sx={{ mt: 2 }}
                                fullWidth
                                name="titulo"
                                label="Título del Formulario *"
                                value={formularioEditando.titulo}
                                onChange={(e) => setFormularioEditando({ ...formularioEditando, titulo: e.target.value })}
                            />

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="sector-edit-label">Sector *</InputLabel>
                                <Select
                                    labelId="sector-edit-label"
                                    value={formularioEditando.sector}
                                    onChange={(e) => setFormularioEditando({ ...formularioEditando, sector: Number(e.target.value) })}
                                    label="Sector *"
                                >
                                    {sectores.map((sector) => (
                                        <MenuItem key={sector.id} value={sector.id}>
                                            {sector.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        name="codigo"
                                        label="Código *"
                                        value={formularioEditando.codigo}
                                        onChange={(e) => setFormularioEditando({ ...formularioEditando, codigo: e.target.value })}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        name="version"
                                        label="Versión *"
                                        value={formularioEditando.version}
                                        onChange={(e) => setFormularioEditando({ ...formularioEditando, version: e.target.value })}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        name="item"
                                        label="Ítem"
                                        value={formularioEditando.item}
                                        onChange={(e) => setFormularioEditando({ ...formularioEditando, item: e.target.value })}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        name="aspecto_a_verificar"
                                        label="Aspecto a Verificar"
                                        value={formularioEditando.aspecto_a_verificar}
                                        onChange={(e) => setFormularioEditando({ ...formularioEditando, aspecto_a_verificar: e.target.value })}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        name="bueno"
                                        label="Bueno"
                                        value={formularioEditando.bueno}
                                        onChange={(e) => setFormularioEditando({ ...formularioEditando, bueno: e.target.value })}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        name="malo"
                                        label="Malo"
                                        value={formularioEditando.malo}
                                        onChange={(e) => setFormularioEditando({ ...formularioEditando, malo: e.target.value })}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        name="comentarios"
                                        label="Comentarios"
                                        value={formularioEditando.comentarios}
                                        onChange={(e) => setFormularioEditando({ ...formularioEditando, comentarios: e.target.value })}

                                    />
                                </Grid>
                            </Grid>

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="estado-edit-label">Estado</InputLabel>
                                <Select
                                    labelId="estado-edit-label"
                                    value={formularioEditando.estado}
                                    onChange={(e) => setFormularioEditando({ ...formularioEditando, estado: e.target.value as any })}
                                    label="Estado"
                                >
                                    {ESTADOS_FORMULARIO.map((estado) => (
                                        <MenuItem key={estado.value} value={estado.value}>
                                            {estado.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions >
                    <Button
                        onClick={() => setDialogoAbierto(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleEditarFormulario}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmacionAbierta} onClose={() => setConfirmacionAbierta(false)}>
                <DialogTitle sx={{ bgcolor: "#1E293B", color: "white" }}>Confirmar Eliminación</DialogTitle>
                <DialogContent sx={{ bgcolor: "#1E293B", color: "white" }}>
                    ¿Estás seguro de que deseas eliminar este formulario?
                </DialogContent>
                <DialogActions >
                    <Button
                        onClick={() => setConfirmacionAbierta(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmarEliminacion}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FormularioChecklistComponent;