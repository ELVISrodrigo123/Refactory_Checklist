import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Typography, Dialog,
    DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
    Select, MenuItem, CircularProgress, Accordion, AccordionSummary,
    AccordionDetails, Chip, InputAdornment
} from '@mui/material';
import { Edit, Delete, Add, ExpandMore, Search } from '@mui/icons-material';
import { TareaChecklist } from '@/pages/models/TareaChecklistModel';
import { TareaChecklistService } from '@/pages/services/TareaChecklistService';
import { getFormularios } from '@/pages/services/Formulario';

const TareaChecklistCRUD = () => {
    // Estados principales
    const [estructura, setEstructura] = useState<any>(null);
    const [formularios, setFormularios] = useState<any[]>([]);
    const [formularioFiltro, setFormularioFiltro] = useState<number | null>(null);
    const [tituloSeleccionado, setTituloSeleccionado] = useState<number | null>(null);
    const [descripcion, setDescripcion] = useState('');
    const [tareaEditando, setTareaEditando] = useState<TareaChecklist | null>(null);
    const [dialogoAbierto, setDialogoAbierto] = useState(false);
    const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
    const [cargando, setCargando] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            try {
                const [formData, estructuraData] = await Promise.all([
                    getFormularios(),
                    TareaChecklistService.getEstructuraCompleta()
                ]);
                setFormularios(formData);
                setEstructura(estructuraData);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    // Filtrar títulos según búsqueda y formulario seleccionado
    const titulosFiltrados = estructura?.formularios
        .filter((form: any) => formularioFiltro ? form.id === formularioFiltro : true)
        .flatMap((form: any) =>
            form.titulos.filter((tit: any) =>
                tit.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                form.titulo.toLowerCase().includes(busqueda.toLowerCase())
            )
        ) || [];

    // Handlers
    const handleCrearTarea = async () => {
        if (!descripcion.trim() || !tituloSeleccionado) {
            alert("La descripción y el título son obligatorios");
            return;
        }

        try {
            const nuevaTarea = new TareaChecklist(0, descripcion, tituloSeleccionado);
            const tareaCreada = await TareaChecklistService.create(nuevaTarea);

            setEstructura((prev: any) => ({
                formularios: prev.formularios.map((form: any) => ({
                    ...form,
                    titulos: form.titulos.map((tit: any) => ({
                        ...tit,
                        tareas: tit.id === tituloSeleccionado
                            ? [...tit.tareas, tareaCreada]
                            : tit.tareas
                    }))
                }))
            }));

            setDescripcion('');
        } catch (error) {
            console.error("Error al crear tarea:", error);
            alert(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error'}`);
        }
    };

    const handleEditarTarea = async () => {
        if (!tareaEditando?.descripcion.trim()) {
            alert("La descripción es obligatoria");
            return;
        }

        try {
            const tareaActualizada = await TareaChecklistService.update(
                tareaEditando.id,
                tareaEditando
            );

            setEstructura((prev: any) => ({
                formularios: prev.formularios.map((form: any) => ({
                    ...form,
                    titulos: form.titulos.map((tit: any) => ({
                        ...tit,
                        tareas: tit.tareas.map((t: any) =>
                            t.id === tareaActualizada.id ? tareaActualizada : t
                        )
                    }))
                }))
            }));

            setDialogoAbierto(false);
        } catch (error) {
            console.error("Error al editar tarea:", error);
            alert(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error'}`);
        }
    };

    const handleEliminarTarea = async () => {
        if (idAEliminar === null) return;

        try {
            await TareaChecklistService.delete(idAEliminar);

            setEstructura((prev: any) => ({
                formularios: prev.formularios.map((form: any) => ({
                    ...form,
                    titulos: form.titulos.map((tit: any) => ({
                        ...tit,
                        tareas: tit.tareas.filter((t: any) => t.id !== idAEliminar)
                    }))
                }))
            }));

            setConfirmacionAbierta(false);
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
            alert(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error'}`);
        }
    };

    return (
        <Box sx={{
            p: 3,
            bgcolor: '#334155',
            minHeight: '100vh',
            color: 'white'
        }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                Gestión de Checklist
            </Typography>

            {/* Filtros superiores */}
            <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3,
                flexWrap: 'wrap'
            }}>
                {/* Filtro por formulario */}
                <FormControl sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}>
                    <InputLabel>Filtrar por formulario</InputLabel>
                    <Select
                        value={formularioFiltro || ''}
                        onChange={(e) => setFormularioFiltro(Number(e.target.value))}
                        label="Filtrar por formulario"
                    >
                        <MenuItem value="">
                            <em>Todos los formularios</em>
                        </MenuItem>
                        {formularios.map((formulario) => (
                            <MenuItem key={formulario.id} value={formulario.id}>
                                {formulario.titulo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Barra de búsqueda */}
                <TextField
                    sx={{ 
                        flexGrow: 1,
                        bgcolor: 'white',
                        borderRadius: 1,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent'
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent'
                            }
                        }
                    }}
                    variant="outlined"
                    placeholder="Buscar títulos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            {/* Formulario para crear tarea */}
            <Box sx={{
                mb: 4,
                p: 3,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 3
            }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#334155' }}>
                    Agregar Nueva Tarea
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {/* Selector de formulario para creación */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Formulario</InputLabel>
                        <Select
                            value={formularioFiltro || ''}
                            onChange={(e) => {
                                setFormularioFiltro(Number(e.target.value));
                                setTituloSeleccionado(null); // Resetear título al cambiar formulario
                            }}
                            label="Formulario"
                        >
                            <MenuItem value="">
                                <em>Seleccione un formulario</em>
                            </MenuItem>
                            {formularios.map((formulario) => (
                                <MenuItem key={formulario.id} value={formulario.id}>
                                    {formulario.titulo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Selector de título con filtrado */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Título *</InputLabel>
                        <Select
                            value={tituloSeleccionado || ''}
                            onChange={(e) => setTituloSeleccionado(Number(e.target.value))}
                            label="Título *"
                            disabled={!formularioFiltro}
                        >
                            <MenuItem value="">
                                <em>{formularioFiltro ? 'Seleccione un título' : 'Primero seleccione un formulario'}</em>
                            </MenuItem>
                            {estructura?.formularios
                                .find(f => f.id === formularioFiltro)
                                ?.titulos.map(titulo => (
                                    <MenuItem key={titulo.id} value={titulo.id}>
                                        {titulo.nombre}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <TextField
                        sx={{ flexGrow: 1 }}
                        label="Descripción *"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCrearTarea}
                        disabled={!descripcion.trim() || !tituloSeleccionado}
                        sx={{
                            height: '56px',
                            bgcolor: '#4f46e5',
                            '&:hover': { bgcolor: '#4338ca' },
                            '&:disabled': { bgcolor: '#9ca3af' }
                        }}
                    >
                        Agregar
                    </Button>
                </Box>
            </Box>

            {/* Contenido principal */}
            {cargando ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress sx={{ color: 'white' }} />
                </Box>
            ) : (
                <Box sx={{ maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
                {busqueda || formularioFiltro ? (
                    // Vista de búsqueda/filtrada
                    titulosFiltrados.length > 0 ? (
                        titulosFiltrados.map((titulo: any) => {
                            const formularioPadre = estructura.formularios.find(
                                (f: any) => f.titulos.some((t: any) => t.id === titulo.id)
                            );
                            return (
                                <Accordion key={titulo.id} sx={{ mb: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography sx={{ color: '#334155', fontWeight: 'bold' }}>
                                            {formularioPadre?.titulo} → {titulo.nombre}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: '#e0e0e0' }}>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Acciones</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {titulo.tareas.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={2} align="center">
                                                                No hay tareas
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        titulo.tareas.map((tarea: any) => (
                                                            <TableRow key={tarea.id}>
                                                                <TableCell>{tarea.descripcion}</TableCell>
                                                                <TableCell>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setTareaEditando(tarea);
                                                                            setDialogoAbierto(true);
                                                                        }}
                                                                        sx={{
                                                                            color: '#2563eb',
                                                                            '&:hover': {
                                                                                color: '#1d4ed8',
                                                                                bgcolor: 'rgba(37, 99, 235, 0.1)',
                                                                                transform: 'scale(1.1)'
                                                                            },
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setIdAEliminar(tarea.id);
                                                                            setConfirmacionAbierta(true);
                                                                        }}
                                                                        sx={{
                                                                            color: '#dc2626',
                                                                            '&:hover': {
                                                                                color: '#b91c1c',
                                                                                bgcolor: 'rgba(220, 38, 38, 0.1)',
                                                                                transform: 'scale(1.1)'
                                                                            },
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })
                    ) : (
                        <Box sx={{
                            p: 3,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            textAlign: 'center'
                        }}>
                            <Typography>No se encontraron resultados</Typography>
                        </Box>
                    )
                ) : (
                    // Vista completa jerárquica
                    estructura?.formularios.map((formulario: any) => (
                        formulario.titulos.length > 0 && (
                            <Accordion key={formulario.id} defaultExpanded sx={{ mb: 3 }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography sx={{
                                        fontWeight: 'bold',
                                        color: '#334155',
                                        fontSize: '1.1rem'
                                    }}>
                                        {formulario.titulo}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {formulario.titulos.map((titulo: any) => (
                                        <Accordion
                                            key={titulo.id}
                                            sx={{ mb: 2, bgcolor: '#f8fafc' }}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '100%'
                                                }}>
                                                    <Typography sx={{
                                                        fontWeight: 'medium',
                                                        color: '#334155'
                                                    }}>
                                                        {titulo.nombre}
                                                    </Typography>
                                                    <Chip
                                                        label={`${titulo.tareas.length} tareas`}
                                                        size="small"
                                                        sx={{ ml: 2 }}
                                                    />
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <TableContainer component={Paper}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow sx={{ bgcolor: '#e0e0e0' }}>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                                                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Acciones</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {titulo.tareas.length === 0 ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={2} align="center">
                                                                        No hay tareas registradas
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                titulo.tareas.map((tarea: any) => (
                                                                    <TableRow key={tarea.id}>
                                                                        <TableCell>{tarea.descripcion}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton
                                                                                onClick={() => {
                                                                                    setTareaEditando(tarea);
                                                                                    setDialogoAbierto(true);
                                                                                }}
                                                                                sx={{
                                                                                    color: '#2563eb',
                                                                                    '&:hover': {
                                                                                        color: '#1d4ed8',
                                                                                        bgcolor: 'rgba(37, 99, 235, 0.1)',
                                                                                        transform: 'scale(1.1)'
                                                                                    },
                                                                                    transition: 'all 0.2s ease'
                                                                                }}
                                                                            >
                                                                                <Edit />
                                                                            </IconButton>
                                                                            <IconButton
                                                                                onClick={() => {
                                                                                    setIdAEliminar(tarea.id);
                                                                                    setConfirmacionAbierta(true);
                                                                                }}
                                                                                sx={{
                                                                                    color: '#dc2626',
                                                                                    '&:hover': {
                                                                                        color: '#b91c1c',
                                                                                        bgcolor: 'rgba(220, 38, 38, 0.1)',
                                                                                        transform: 'scale(1.1)'
                                                                                    },
                                                                                    transition: 'all 0.2s ease'
                                                                                }}
                                                                            >
                                                                                <Delete />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        )
                    ))
                )}
                </Box>
            )}

            {/* Diálogo de edición */}
            <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)} fullWidth maxWidth="sm">
                <DialogTitle>Editar Tarea</DialogTitle>
                <DialogContent>
                    {tareaEditando && (
                        <>
                            <Typography variant="subtitle2" gutterBottom>
                                Formulario: {
                                    estructura?.formularios.find(f =>
                                        f.titulos.some(t => t.id === tareaEditando.tituloId)
                                    )?.titulo
                                }
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
                                Título: {
                                    estructura?.formularios
                                        .flatMap(f => f.titulos)
                                        .find(t => t.id === tareaEditando.tituloId)?.nombre
                                }
                            </Typography>
                            <TextField
                                fullWidth
                                label="Descripción *"
                                value={tareaEditando.descripcion}
                                onChange={(e) => setTareaEditando({
                                    ...tareaEditando,
                                    descripcion: e.target.value
                                })}
                                variant="outlined"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
                    <Button
                        onClick={handleEditarTarea}
                        variant="contained"
                        color="primary"
                        disabled={!tareaEditando?.descripcion.trim()}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmación */}
            <Dialog open={confirmacionAbierta} onClose={() => setConfirmacionAbierta(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    ¿Está seguro que desea eliminar esta tarea permanentemente?
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setConfirmacionAbierta(false)}>Cancelar</Button>
                    <Button
                        onClick={handleEliminarTarea}
                        variant="contained"
                        color="error"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TareaChecklistCRUD;