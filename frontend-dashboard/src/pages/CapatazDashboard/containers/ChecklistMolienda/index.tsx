
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
    Divider
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getRespuestas, updateRespuesta, deleteRespuesta } from "../../../services/RespuestaChecklistService";
import { TareaChecklistService } from "../../../services/TareaChecklistService";
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

const ChecklistDomo: React.FC = () => {
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

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Obtener datos en paralelo
                const [respuestasData, estructuraCompleta] = await Promise.all([
                    getRespuestas(),
                    TareaChecklistService.getEstructuraCompleta()
                ]);

                // Enriquecer las respuestas con la estructura completa
                const respuestasEnriquecidas = respuestasData.map(respuesta => {
                    const formulario = estructuraCompleta.formularios.find(f => f.id === respuesta.formulario);

                    if (!formulario) {
                        return {
                            ...respuesta,
                            usuario_nombre: respuesta.usuario_username || `Usuario ${respuesta.usuario}`,
                            estructura: []
                        };
                    }

                    // Mapear las respuestas de tareas con la estructura completa
                    const estructura = formulario.titulos.map(titulo => {
                        const tareasRespuesta = respuesta.respuestas_tareas
                            .filter(rt => titulo.tareas.some(t => t.id === rt.tarea))
                            .map(rt => {
                                const tareaCompleta = titulo.tareas.find(t => t.id === rt.tarea);
                                return {
                                    ...rt,
                                    tarea_id: rt.tarea,
                                    descripcion: tareaCompleta?.descripcion || `Tarea ${rt.tarea}`
                                };
                            });

                        return {
                            titulo_id: titulo.id,
                            titulo_nombre: titulo.nombre,
                            tareas: tareasRespuesta
                        };
                    }).filter(titulo => titulo.tareas.length > 0);

                    return {
                        ...respuesta,
                        formulario_titulo: formulario.titulo,
                        usuario_nombre: respuesta.usuario_username || `Usuario ${respuesta.usuario}`,
                        estructura
                    };
                });

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

            // Preparar los datos para actualizar
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

            // Actualizar el estado con la respuesta actualizada (CORRECCIÓN AQUÍ)
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
            )); // <-- El paréntesis de cierre estaba mal colocado

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

    // Manejar cambios en las respuestas
    const handleRespuestaChange = (tituloId: number, tareaId: number, field: string, value: any) => {
        if (!editedRespuesta) return;

        // Hacer una copia profunda del estado para evitar mutaciones directas
        const nuevaRespuesta = JSON.parse(JSON.stringify(editedRespuesta));

        setEditedRespuesta({
            ...nuevaRespuesta,
            estructura: nuevaRespuesta.estructura.map(titulo => {
                if (titulo.titulo_id === tituloId) {
                    return {
                        ...titulo,
                        tareas: titulo.tareas.map(tarea => {
                            if (tarea.id === tareaId) {
                                // Para checkboxes SI/NO, asegurar que sean mutuamente excluyentes
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

    // Formatear fecha
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
    // Resto de las funciones (confirmDelete, handleDelete, formatDate) permanecen iguales
    // ... [Mantener las mismas funciones de eliminación y formato de fecha]

    return (
        <CapatazLayout>
            <Box sx={{ p: isMobile ? 2 : 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Checklist Domo - Respuestas
                </Typography>

                {/* Notificaciones */}
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
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" component="div">
                                                {respuesta.formulario_titulo}
                                            </Typography>
                                            <Box>
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
                                                label={`Usuario: ${respuesta.usuario_nombre}`}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={`Fecha: ${formatDate(respuesta.fecha_respuesta)}`}
                                                size="small"
                                                variant="outlined"
                                            />
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
                                                {respuesta.comentario_general || ""}
                                            </Typography>
                                        </Box>
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