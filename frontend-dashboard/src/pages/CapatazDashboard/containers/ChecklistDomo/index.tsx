
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
import CapatazLayout from "@/pages/components/CapatazLayout";

interface Respuesta {
    id: number;
    formulario: number;
    formulario_titulo: string;
    usuario: number;
    usuario_username: string;
    usuario_nombre?: string; // Nuevo campo para el nombre del usuario
    fecha_respuesta: string;
    comentario_general: string;
    respuestas_tareas: {
        id: number;
        tarea: number;
        tarea_descripcion: string;
        estado_bueno: boolean;
        estado_malo: boolean;
        comentario: string;
    }[];
}

const ChecklistDomo: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedRespuestas, setEditedRespuestas] = useState<Respuesta | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [respuestaToDelete, setRespuestaToDelete] = useState<number | null>(null);

    // Cargar respuestas al montar el componente
    useEffect(() => {
        const fetchRespuestas = async () => {
            try {
                setLoading(true);
                const data = await getRespuestas();
                // Mapear los datos para incluir nombre de usuario si está disponible
                const respuestasConNombres = data.map(respuesta => ({
                    ...respuesta,
                    usuario_nombre: respuesta.usuario_username || `Usuario ${respuesta.usuario}`
                }));
                setRespuestas(respuestasConNombres);
            } catch (err) {
                console.error("Error al cargar respuestas:", err);
                setError("No se pudieron cargar las respuestas. Intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchRespuestas();
    }, []);

    // Iniciar edición
    const handleEdit = (respuesta: Respuesta) => {
        setEditingId(respuesta.id);
        setEditedRespuestas({ ...respuesta });
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedRespuestas(null);
    };

    // Guardar cambios
    const handleSave = async () => {
        if (!editedRespuestas) return;

        try {
            setLoading(true);
            const updatedRespuesta = await updateRespuesta(editedRespuestas.id, {
                comentario_general: editedRespuestas.comentario_general,
                respuestas_tareas: editedRespuestas.respuestas_tareas.map(rt => ({
                    id: rt.id,
                    estado_bueno: rt.estado_bueno,
                    estado_malo: rt.estado_malo,
                    comentario: rt.comentario
                }))
            });

            setRespuestas(respuestas.map(r => 
                r.id === updatedRespuesta.id ? {
                    ...updatedRespuesta,
                    usuario_nombre: r.usuario_nombre // Mantener el nombre del usuario
                } : r
            ));
            setSuccess("Respuesta actualizada correctamente");
            setEditingId(null);
            setEditedRespuestas(null);
        } catch (err) {
            console.error("Error al actualizar respuesta:", err);
            setError("No se pudo actualizar la respuesta. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    // Confirmar eliminación
    const confirmDelete = (id: number) => {
        setRespuestaToDelete(id);
        setDeleteDialogOpen(true);
    };

    // Eliminar respuesta
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

    // Manejar cambios en las respuestas
    const handleRespuestaChange = (respuestaId: number, tareaId: number, field: string, value: any) => {
        if (!editedRespuestas) return;

        const updatedRespuestas = {
            ...editedRespuestas,
            respuestas_tareas: editedRespuestas.respuestas_tareas.map(rt => {
                if (rt.tarea === tareaId) {
                    // Para checkboxes SI/NO, asegurarse que sean mutuamente excluyentes
                    if (field === 'estado_bueno') {
                        return {
                            ...rt,
                            estado_bueno: value,
                            estado_malo: value ? false : rt.estado_malo
                        };
                    } else if (field === 'estado_malo') {
                        return {
                            ...rt,
                            estado_malo: value,
                            estado_bueno: value ? false : rt.estado_bueno
                        };
                    } else {
                        return {
                            ...rt,
                            [field]: value
                        };
                    }
                }
                return rt;
            })
        };

        setEditedRespuestas(updatedRespuestas);
    };

    // Manejar cambio en comentario general
    const handleComentarioGeneralChange = (value: string) => {
        if (!editedRespuestas) return;
        setEditedRespuestas({
            ...editedRespuestas,
            comentario_general: value
        });
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
                                                {respuesta.formulario_titulo || `Formulario ${respuesta.formulario}`}
                                            </Typography>
                                            <Box>
                                                {editingId !== respuesta.id ? (
                                                    <>
                                                        <IconButton 
                                                            onClick={() => handleEdit(respuesta)}
                                                            color="primary"
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
                                                label={`Usuario: ${respuesta.usuario_nombre || respuesta.usuario_username || `ID ${respuesta.usuario}`}`} 
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
                                            value={editedRespuestas?.comentario_general || ''}
                                            onChange={(e) => handleComentarioGeneralChange(e.target.value)}
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

                                    {/* Tabla de respuestas */}
                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Tarea</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }} align="center">SI</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', width: '100px' }} align="center">NO</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Comentario</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {respuesta.respuestas_tareas.map(tarea => (
                                                    <TableRow key={tarea.id}>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {tarea.tarea_descripcion || `Tarea ${tarea.tarea}`}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {editingId === respuesta.id ? (
                                                                <Checkbox
                                                                    checked={editedRespuestas?.respuestas_tareas.find(rt => rt.tarea === tarea.tarea)?.estado_bueno || false}
                                                                    onChange={(e) => 
                                                                        handleRespuestaChange(
                                                                            respuesta.id, 
                                                                            tarea.tarea, 
                                                                            'estado_bueno', 
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                    color="primary"
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
                                                                    checked={editedRespuestas?.respuestas_tareas.find(rt => rt.tarea === tarea.tarea)?.estado_malo || false}
                                                                    onChange={(e) => 
                                                                        handleRespuestaChange(
                                                                            respuesta.id, 
                                                                            tarea.tarea, 
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
                                                                    value={editedRespuestas?.respuestas_tareas.find(rt => rt.tarea === tarea.tarea)?.comentario || ''}
                                                                    onChange={(e) => 
                                                                        handleRespuestaChange(
                                                                            respuesta.id, 
                                                                            tarea.tarea, 
                                                                            'comentario', 
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <Typography variant="body2">
                                                                    {tarea.comentario || "Sin comentario"}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
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