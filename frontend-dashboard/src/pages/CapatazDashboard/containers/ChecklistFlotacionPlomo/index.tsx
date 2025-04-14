
import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Card,
    CardHeader,
    CardContent,
    Divider,
    ListItemText,
    List,
    ListItem,
    MenuItem
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getRespuestas, updateRespuesta, deleteRespuesta } from "../../../../services/RespuestaChecklistService";
import { TareaChecklistService } from "../../../../services/TareaChecklistService";
import { getRevisionesByRespuesta, crearRevision } from "../../../../services/RevisionChecklistService";
import CapatazLayout from "@/pages/components/CapatazLayout";

interface RespuestaEnriquecida {
    id: number;
    formulario: number;
    formulario_titulo: string;
    usuario: number;
    usuario_username: string;
    usuario_nombre: string;
    fecha_respuesta: string;
    comentario_general: string;
    revision?: {
        id: number;
        estado: 'pendiente' | 'revisado' | 'observado';
        observaciones: string;
        usuario_revisor: number;
        usuario_revisor_username: string;
        fecha_revision: string;
    };
    estructura: {
        titulo_id: number;
        titulo_nombre: string;
        tareas: {
            id: number;
            tarea_id: number;
            descripcion: string;
            estado_bueno: boolean;
            estado_malo: boolean;
            comentario: string;
        }[];
    }[];
}

/* const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.user_id || payload.sub,
            username: payload.username
        };
    } catch (error) {
        console.error("Error al decodificar token:", error);
        return null;
    }
};

const usuario = getCurrentUser();
if (!usuario) {
    throw new Error("No se pudo identificar al usuario revisor");
}
 */


const EstadoRevision =  ({ respuesta, onRevisionCreada }: { respuesta: RespuestaEnriquecida, onRevisionCreada: () => void }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [observaciones, setObservaciones] = useState("");
    const [estado, setEstado] = useState<'pendiente' | 'revisado' | 'observado'>(respuesta.revision?.estado || 'pendiente');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (openDialog) {
            setEstado(respuesta.revision?.estado || 'pendiente');
            setObservaciones(respuesta.revision?.observaciones || '');
        }
    }, [openDialog, respuesta.revision]);

    const handleGuardarRevision = async () => {
        try {
            const token = localStorage.getItem("token");
            const usuario = token ? JSON.parse(atob(token.split('.')[1])) : null;
            
            const revisionPayload = {
                respuesta: respuesta.id,
                estado,
                observaciones,
                usuario: usuario?.user_id || null
            };
            
            await crearRevision(revisionPayload);
            onRevisionCreada();
            setOpenDialog(false);
        } catch (error) {
            console.error("Error al guardar revisión:", error);
        }
    };

    const getEstadoColor = () => {
        if (!respuesta.revision) return 'default';
        switch (respuesta.revision.estado) {
            case 'pendiente': return 'info'; 
            case 'revisado': return 'success';
            case 'observado': return 'warning';
            default: return 'default';
        }
    };

    const getEstadoActual = () => {
        return respuesta.revision?.estado.toUpperCase() || 'PENDIENTE';
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
                label={getEstadoActual()}
                color={respuesta.revision ? getEstadoColor() : 'default'}
                onClick={() => setOpenDialog(true)}
            />
            
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Registrar Revisión</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        label="Estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value as any)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="revisado">Revisado</MenuItem>
                        <MenuItem value="observado">Observado</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        sx={{ mt: 2 }}
                        required={estado === 'observado'}
                        error={estado === 'observado' && !observaciones}
                        helperText={estado === 'observado' && !observaciones ? "Las observaciones son obligatorias para estado 'Observado'" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="error">Cancelar</Button>
                    <Button 
                        onClick={handleGuardarRevision}
                        color="success"
                        disabled={estado === 'observado' && !observaciones}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const ChecklistDomo = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [respuestas, setRespuestas] = useState<RespuestaEnriquecida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedRespuesta, setEditedRespuesta] = useState<RespuestaEnriquecida | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [respuestaToDelete, setRespuestaToDelete] = useState<number | null>(null);

    const cargarRevisiones = async (respuestaId: number) => {
        try {
            const revisiones = await getRevisionesByRespuesta(respuestaId);
            setRespuestas(prev => prev.map(r => 
                r.id === respuestaId ? { 
                    ...r, 
                    revision: revisiones.length > 0 ? revisiones[0] : undefined 
                } : r
            ));
        } catch (error) {
            console.error("Error cargando revisiones:", error);
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [respuestasData, estructuraCompleta] = await Promise.all([
                    getRespuestas(),
                    TareaChecklistService.getEstructuraCompleta()
                ]);

                // Enriquecer las respuestas con la estructura completa
                const respuestasEnriquecidas = await Promise.all(
                    respuestasData.map(async respuesta => {
                        const formulario = estructuraCompleta.formularios.find(f => f.id === respuesta.formulario);

                        // Cargar revisiones para cada respuesta
                        const revisiones = await getRevisionesByRespuesta(respuesta.id);

                        // Mapear las respuestas de tareas con la estructura completa
                        const estructura = formulario?.titulos.map(titulo => {
                            const tareasRespuesta = respuesta.respuestas_tareas
                                .filter(rt => titulo.tareas.some(t => t.id === rt.tarea))
                                .map(rt => {
                                    const tareaCompleta = titulo.tareas.find(t => t.id === rt.tarea);
                                    return {
                                        ...rt,
                                        id: rt.id || 0, // Asegurar que siempre tenga un id
                                        tarea_id: rt.tarea,
                                        descripcion: tareaCompleta?.descripcion || `Tarea ${rt.tarea}`
                                    };
                                });

                            return {
                                titulo_id: titulo.id,
                                titulo_nombre: titulo.nombre,
                                tareas: tareasRespuesta
                            };
                        }).filter(titulo => titulo?.tareas.length > 0) || [];

                        return {
                            ...respuesta,
                            revision: revisiones.length > 0 ? revisiones[0] : undefined,
                            formulario_titulo: formulario?.titulo || '',
                            usuario_nombre: respuesta.usuario_username || `Usuario ${respuesta.usuario}`,
                            estructura
                        };
                    })
                );

                setRespuestas(respuestasEnriquecidas);
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError("No se pudieron cargar los datos. Intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Iniciar edición
    const handleEdit = (respuesta: RespuestaEnriquecida) => {
        setEditingId(respuesta.id);
        setEditedRespuesta({ ...respuesta });
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedRespuesta(null);
    };

    // Guardar cambios
    const handleSave = async () => {
        if (!editedRespuesta) return;

        try {
            setLoading(true);
            const respuestasTareas = editedRespuesta.estructura.flatMap(titulo =>
                titulo.tareas.map(tarea => ({
                    id: tarea.id,
                    tarea: tarea.tarea_id,
                    estado_bueno: tarea.estado_bueno,
                    estado_malo: tarea.estado_malo,
                    comentario: tarea.comentario
                }))
            );

            const updatedRespuesta = await updateRespuesta(editedRespuesta.id, {
                comentario_general: editedRespuesta.comentario_general,
                respuestas_tareas: respuestasTareas
            });

            setRespuestas(respuestas.map(r =>
                r.id === updatedRespuesta.id ? {
                    ...r,
                    comentario_general: updatedRespuesta.comentario_general,
                    estructura: r.estructura.map(titulo => ({
                        ...titulo,
                        tareas: titulo.tareas.map(tarea => {
                            const updatedTarea = updatedRespuesta.respuestas_tareas.find(rt => rt.id === tarea.id);
                            return updatedTarea ? {
                                ...tarea,
                                estado_bueno: updatedTarea.estado_bueno,
                                estado_malo: updatedTarea.estado_malo,
                                comentario: updatedTarea.comentario
                            } : tarea;
                        })
                    }))
                } : r
            ));

            setSuccess("Respuesta actualizada correctamente");
            setEditingId(null);
            setEditedRespuesta(null);
        } catch (err) {
            console.error("Error al actualizar respuesta:", err);
            setError("No se pudo actualizar la respuesta. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleRespuestaChange = (tituloId: number, tareaId: number, field: string, value: any) => {
        if (!editedRespuesta) return;

        const nuevaRespuesta = JSON.parse(JSON.stringify(editedRespuesta));

        setEditedRespuesta({
            ...nuevaRespuesta,
            estructura: nuevaRespuesta.estructura.map(titulo => {
                if (titulo.titulo_id === tituloId) {
                    return {
                        ...titulo,
                        tareas: titulo.tareas.map(tarea => {
                            if (tarea.id === tareaId) {
                                if (field === 'estado_bueno') {
                                    return {
                                        ...tarea,
                                        estado_bueno: value,
                                        estado_malo: value ? false : tarea.estado_malo
                                    };
                                } else if (field === 'estado_malo') {
                                    return {
                                        ...tarea,
                                        estado_malo: value,
                                        estado_bueno: value ? false : tarea.estado_bueno
                                    };
                                } else {
                                    return {
                                        ...tarea,
                                        [field]: value
                                    };
                                }
                            }
                            return tarea;
                        })
                    };
                }
                return titulo;
            })
        });
    };

    const handleDelete = async () => {
        if (!respuestaToDelete) return;

        try {
            setLoading(true);
            await deleteRespuesta(respuestaToDelete);
            setRespuestas(respuestas.filter(r => r.id !== respuestaToDelete));
            setSuccess("Respuesta eliminada correctamente");
        } catch (err) {
            console.error("Error al eliminar respuesta:", err);
            setError("No se pudo eliminar la respuesta. Intente nuevamente.");
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setRespuestaToDelete(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const confirmDelete = (id: number) => {
        setRespuestaToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleRevisionCreada = (respuestaId: number) => {
        cargarRevisiones(respuestaId);
        setSuccess("Revisión registrada correctamente");
    };

    return (
        <CapatazLayout>
            <Box sx={{ p: isMobile ? 2 : 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Checklist Domo - Respuestas
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {loading && respuestas.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : respuestas.length === 0 ? (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        No hay respuestas registradas.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {respuestas.map(respuesta => (
                            <Card key={respuesta.id} elevation={3}>
                                <CardHeader
                                    title={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Typography variant="h6" component="div">
                                                {respuesta.formulario_titulo}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EstadoRevision 
                                                    respuesta={respuesta} 
                                                    onRevisionCreada={() => handleRevisionCreada(respuesta.id)} 
                                                />
                                                {editingId !== respuesta.id ? (
                                                    <>
                                                        <IconButton
                                                            onClick={() => handleEdit(respuesta)}
                                                            color="success"
                                                            disabled={loading}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => confirmDelete(respuesta.id)}
                                                            color="error"
                                                            disabled={loading}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconButton
                                                            onClick={handleSave}
                                                            color="success"
                                                            disabled={loading}
                                                        >
                                                            <Save />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={handleCancelEdit}
                                                            color="error"
                                                            disabled={loading}
                                                        >
                                                            <Cancel />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </Box>
                                        </Box>
                                    }
                                    subheader={
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            <Chip
                                                label={`Usuario: ${respuesta.usuario_nombre} (ID: ${respuesta.usuario})`}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={`Fecha: ${formatDate(respuesta.fecha_respuesta)}`}
                                                size="small"
                                                variant="outlined"
                                            />
                                            {respuesta.revision && (
                                                <>
                                                    <Chip
                                                        label={`Revisor ID: ${respuesta.revision.usuario_revisor}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={`Revisor: ${respuesta.revision.usuario_revisor_username || 'N/A'}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={`Estado: ${respuesta.revision.estado.toUpperCase()}`}
                                                        size="small"
                                                        variant="outlined"
                                                        color={
                                                            respuesta.revision.estado === 'revisado' ? 'success' :
                                                            respuesta.revision.estado === 'observado' ? 'warning' : 'info'
                                                        }
                                                    />
                                                </>
                                            )}
                                        </Box>
                                    }
                                />

                                <CardContent>
                                    {/* Comentario general */}
                                    {editingId === respuesta.id ? (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={editedRespuesta?.comentario_general || ''}
                                            onChange={(e) => setEditedRespuesta({
                                                ...editedRespuesta!,
                                                comentario_general: e.target.value
                                            })}
                                            label="Comentario general"
                                            variant="outlined"
                                            sx={{ mb: 3 }}
                                        />
                                    ) : (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Comentario general:
                                            </Typography>
                                            <Typography variant="body1">
                                                {respuesta.comentario_general || "Sin comentario"}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Observaciones de revisión */}
                                    {respuesta.revision && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Observaciones de revisión:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {respuesta.revision.observaciones || "Sin observaciones"}
                                                </Typography>
                                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                    {`Revisado el ${formatDate(respuesta.revision.fecha_revision)}`}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}

                                    <Divider sx={{ my: 2 }} />

                                    {/* Tabla de respuestas agrupadas por título */}
                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Tarea</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }} align="center">SI</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }} align="center">NO</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Comentario</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {respuesta.estructura.map(titulo => (
                                                    <React.Fragment key={titulo.titulo_id}>
                                                        {titulo.tareas.map((tarea, index) => (
                                                            <TableRow key={`${titulo.titulo_id}-${tarea.id}`}>
                                                                {index === 0 && (
                                                                    <TableCell
                                                                        rowSpan={titulo.tareas.length}
                                                                        sx={{
                                                                            fontWeight: 'bold',
                                                                            verticalAlign: 'top'
                                                                        }}
                                                                    >
                                                                        {titulo.titulo_nombre}
                                                                    </TableCell>
                                                                )}
                                                                <TableCell>
                                                                    {tarea.descripcion}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {editingId === respuesta.id ? (
                                                                        <Checkbox
                                                                            checked={tarea.estado_bueno}
                                                                            onChange={(e) =>
                                                                                handleRespuestaChange(
                                                                                    titulo.titulo_id,
                                                                                    tarea.id,
                                                                                    'estado_bueno',
                                                                                    e.target.checked
                                                                                )
                                                                            }
                                                                            color="success"
                                                                        />
                                                                    ) : (
                                                                        <Checkbox
                                                                            checked={tarea.estado_bueno}
                                                                            disabled
                                                                            color="primary"
                                                                        />
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {editingId === respuesta.id ? (
                                                                        <Checkbox
                                                                            checked={tarea.estado_malo}
                                                                            onChange={(e) =>
                                                                                handleRespuestaChange(
                                                                                    titulo.titulo_id,
                                                                                    tarea.id,
                                                                                    'estado_malo',
                                                                                    e.target.checked
                                                                                )
                                                                            }
                                                                            color="error"
                                                                        />
                                                                    ) : (
                                                                        <Checkbox
                                                                            checked={tarea.estado_malo}
                                                                            disabled
                                                                            color="error"
                                                                        />
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {editingId === respuesta.id ? (
                                                                        <TextField
                                                                            fullWidth
                                                                            size="small"
                                                                            value={
                                                                                editedRespuesta?.estructura
                                                                                    .find(t => t.titulo_id === titulo.titulo_id)?.tareas
                                                                                    .find(ta => ta.id === tarea.id)?.comentario || ''
                                                                            }
                                                                            onChange={(e) => {
                                                                                handleRespuestaChange(
                                                                                    titulo.titulo_id,
                                                                                    tarea.id,
                                                                                    'comentario',
                                                                                    e.target.value
                                                                                );
                                                                            }}
                                                                            inputProps={{
                                                                                'aria-label': 'Comentario de la tarea',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <Typography variant="body2">
                                                                            {tarea.comentario || ""}
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Diálogo de confirmación para eliminar */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Está seguro que desea eliminar esta respuesta? Esta acción no se puede deshacer.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </CapatazLayout>
    );
};

export default ChecklistDomo;