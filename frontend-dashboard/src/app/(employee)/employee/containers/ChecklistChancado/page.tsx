"use client"
import React, { useState, useEffect } from "react";
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getFormularios } from "@/services/Formulario";
import { getSectores } from "@/services/Sector";
import { TareaChecklistService } from "@/services/TareaChecklistService";
import {
    createCompleteRespuesta,
    deleteRespuesta,
    getRespuestas
} from '@/services/RespuestaChecklistService';
import InformacionFormulario from "../InforUsers";
import GenerarPDF from "../GenerarPDF";

// Interfaces
interface Tarea {
    id: number;
    descripcion: string;
    si: boolean;
    no: boolean;
    observaciones: string;
    titulo: number;
}

interface Titulo {
    id: number;
    nombre: string;
    formulario: number;
}

interface Formulario {
    id: number;
    titulo: string;
    sector: number;
    fecha_creacion: string;
    comentario_final: string;
    item: string;
    aspecto_a_verificar: string;
    bueno: string;
    malo: string;
    comentarios: string;
}

interface UserInfo {
    id: number;
    nombre: string;
    username: string;
    rol: string;
    turno: string;
    grupo: string;
}

interface Sector {
    id: number;
    nombre: string;
}

const ChecklistChancado = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [formularios, setFormularios] = useState<Formulario[]>([]);
    const [formularioSeleccionado, setFormularioSeleccionado] = useState<Formulario | null>(null);
    const [estructuraCompleta, setEstructuraCompleta] = useState<any>(null);
    const [datosTemporales, setDatosTemporales] = useState<Tarea[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [fechaActual, setFechaActual] = useState<string>("");
    const [horaActual, setHoraActual] = useState<string>("");
    const [sectores, setSectores] = useState<Sector[]>([]);
    const [comentarioFinal, setComentarioFinal] = useState<string>("");
    const [respuestasChecklist, setRespuestasChecklist] = useState<any[]>([]);
    const [modoCreacion, setModoCreacion] = useState(false);
    const [todasLasRespuestas, setTodasLasRespuestas] = useState<any[]>([]);
    const [respuestaId, setRespuestaId] = useState<number | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);
    const [inicializando, setInicializando] = useState(true);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarTodo = async () => {
            try {
                // 1. Cargar primero el usuario
                const user = await cargarUserInfo();

                // 2. Cargar el resto de los datos
                await Promise.all([
                    cargarDatosIniciales(),
                    cargarTodasLasRespuestas()
                ]);

                // 3. Cargar datos temporales si existen
                const datosGuardados = localStorage.getItem(`checklistTemporal_${user.id}`);
                if (datosGuardados) {
                    const { formularioId, tareas, comentarioFinal } = JSON.parse(datosGuardados);
                    const formulario = formularios.find(f => f.id === formularioId);
                    if (formulario) {
                        setFormularioSeleccionado(formulario);
                        setDatosTemporales(tareas);
                        setComentarioFinal(comentarioFinal);
                        setModoCreacion(true);
                    }
                }

                setFechaActual(new Date().toLocaleDateString());
                setHoraActual(new Date().toLocaleTimeString());
            } catch (error) {
                console.error("Error al inicializar:", error);
                setError("Error al cargar datos iniciales");
            } finally {
                setInicializando(false);
            }
        };
        cargarTodo();
    }, []);

    // Cargar estructura cuando se selecciona un formulario
    useEffect(() => {
        if (formularioSeleccionado) {
            cargarEstructuraCompleta(formularioSeleccionado.id);
            setComentarioFinal(formularioSeleccionado.comentario_final || "");
            cargarRespuestasPorFormulario(formularioSeleccionado.id);
        }
    }, [formularioSeleccionado]);

    // Función para guardar temporalmente
    const guardarTemporalmente = () => {
        if (!formularioSeleccionado || !userInfo?.id) {
            setError('Datos incompletos para guardar temporalmente');
            return;
        }

        setCargando(true);
        setError(null);
        setExito(null);

        try {
            const datosTemporalesGuardar = {
                formularioId: formularioSeleccionado.id,
                tareas: datosTemporales,
                comentarioFinal,
                fechaGuardado: new Date().toISOString()
            };

            localStorage.setItem(`checklistTemporal_${userInfo.id}`, JSON.stringify(datosTemporalesGuardar));
            setExito('Progreso guardado temporalmente. Puedes continuar más tarde.');
        } catch (error: any) {
            console.error('Error al guardar temporalmente:', error);
            setError(error.message || 'Error al guardar temporalmente');
        } finally {
            setCargando(false);
        }
    };

    // Función para cargar datos iniciales
    const cargarDatosIniciales = async () => {
        try {
            const [formData, sectoresData] = await Promise.all([
                getFormularios(),
                getSectores()
            ]);
            setFormularios(formData);
            setSectores(sectoresData);
        } catch (error) {
            console.error("Error al cargar datos iniciales:", error);
            throw new Error("Error al cargar los datos iniciales");
        }
    };

    // Función para cargar todas las respuestas
    const cargarTodasLasRespuestas = async () => {
        try {
            const respuestas = await getRespuestas();
            setTodasLasRespuestas(respuestas);
        } catch (error) {
            console.error("Error al cargar todas las respuestas:", error);
            throw new Error("Error al cargar el historial de respuestas");
        }
    };

    // Función para cargar respuestas por formulario
    const cargarRespuestasPorFormulario = async (formularioId: number) => {
        try {
            const respuestas = await getRespuestas({ formulario: formularioId });
            setRespuestasChecklist(respuestas);
        } catch (error) {
            console.error("Error al cargar respuestas:", error);
            throw new Error("Error al cargar las respuestas del formulario");
        }
    };

    // Función para cargar estructura completa
    const cargarEstructuraCompleta = async (formularioId: number) => {
        try {
            const estructura = await TareaChecklistService.getEstructuraCompleta();
            setEstructuraCompleta(estructura);

            const formulario = estructura.formularios.find(f => f.id === formularioId);
            if (!formulario) return;

            const tareasTemp: Tarea[] = [];
            formulario.titulos.forEach(titulo => {
                titulo.tareas.forEach(tarea => {
                    tareasTemp.push({
                        id: tarea.id,
                        descripcion: tarea.descripcion,
                        titulo: titulo.id,
                        si: false,
                        no: false,
                        observaciones: ""
                    });
                });
            });

            setDatosTemporales(tareasTemp);
        } catch (error) {
            console.error("Error al cargar estructura completa:", error);
            throw new Error("Error al cargar la estructura del formulario");
        }
    };

    // Función para cargar información del usuario
    const cargarUserInfo = async (): Promise<UserInfo> => {
        try {
            // 1. Intenta obtener de localStorage
            const storedUser = localStorage.getItem("currentUser");
            let userData: any = storedUser ? JSON.parse(storedUser) : {};

            // 2. Si no hay ID, intenta del token JWT
            if (!userData?.id) {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        userData.id = payload.userId || payload.sub;
                        userData.username = payload.username || userData.username;
                        // Guarda en localStorage para futuras referencias
                        localStorage.setItem("currentUser", JSON.stringify(userData));
                    } catch (e) {
                        console.error("Error al decodificar token:", e);
                        throw new Error("No se pudo decodificar el token de autenticación");
                    }
                }
            }

            // 3. Validación final del ID
            if (!userData?.id) {
                throw new Error("No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.");
            }

            const userInfo = {
                id: userData.id,
                nombre: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                username: userData.username || '',
                rol: userData.role || "Operador",
                turno: userData.shift_type || "N/A",
                grupo: userData.shift_group || "Sin grupo",
            };

            setUserInfo(userInfo);
            return userInfo;
        } catch (error) {
            console.error("Error crítico al cargar información del usuario:", error);
            // Forzar recarga para limpiar estado inconsistente
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.reload();
            throw error;
        }
    };

    // Función para crear nueva respuesta
    const crearNuevaRespuesta = async () => {
        if (!formularioSeleccionado) {
            setError('Seleccione un formulario primero');
            return;
        }

        setCargando(true);
        setError(null);

        try {
            // Validar usuario
            if (!userInfo?.id) {
                const usuario = await cargarUserInfo();
                if (!usuario?.id) throw new Error('Usuario no autenticado');
                setUserInfo(usuario);
            }

            // Preparar payload con validación
            const payload = {
                formulario: Number(formularioSeleccionado.id),
                usuario: Number(userInfo.id),
                comentario_general: comentarioFinal || "Sin comentarios", // Aquí usamos comentarioFinal
                respuestas_tareas: datosTemporales.map(t => {
                    if (!t.si && !t.no) throw new Error(`Seleccione SI/NO para: ${t.descripcion}`);
                    return {
                        tarea: Number(t.id),
                        estado_bueno: Boolean(t.si),
                        estado_malo: Boolean(t.no),
                        comentario: t.observaciones?.trim() || ""
                    };
                })
            };

            console.log('Payload validado:', payload); // Para depuración

            const respuesta = await createCompleteRespuesta(payload);

            // Éxito
            setRespuestaId(respuesta.id);
            setExito('Checklist guardado correctamente!');
            localStorage.removeItem(`checklistTemporal_${userInfo.id}`);

        } catch (error: any) {
            console.error('Error en crearNuevaRespuesta:', error);
            setError(error.message.includes('Error al procesar')
                ? 'Error con el servidor. Intente más tarde.'
                : error.message);
        } finally {
            setCargando(false);
        }
    };
    // Función para manejar cambios en las tareas
    const handleCambioTarea = (id: number, campo: keyof Tarea, valor: any) => {
        setDatosTemporales(prev =>
            prev.map(tarea => {
                if (tarea.id === id) {
                    // Lógica para checkboxes exclusivos
                    if (campo === 'si') {
                        return {
                            ...tarea,
                            si: valor,
                            no: valor ? false : tarea.no
                        };
                    } else if (campo === 'no') {
                        return {
                            ...tarea,
                            no: valor,
                            si: valor ? false : tarea.si
                        };
                    } else {
                        return { ...tarea, [campo]: valor };
                    }
                }
                return tarea;
            })
        );
    };

    // Función para validar el formulario
    const validarFormulario = (): boolean => {
        try {
            // Validar que al menos un checkbox esté marcado en cada tarea
            const tareasIncompletas = datosTemporales.filter(t => !t.si && !t.no);
            if (tareasIncompletas.length > 0) {
                const nombresTareas = tareasIncompletas.map(t => `"${t.descripcion}"`).join(', ');
                throw new Error(`Complete las respuestas (SI/NO) para: ${nombresTareas}`);
            }

            // Validar que no haya tareas con ambos checkboxes marcados
            const tareasConflictivas = datosTemporales.filter(t => t.si && t.no);
            if (tareasConflictivas.length > 0) {
                const nombresConflictivas = tareasConflictivas.map(t => `"${t.descripcion}"`).join(', ');
                throw new Error(`Las siguientes tareas tienen ambas opciones marcadas: ${nombresConflictivas}`);
            }

            return true;
        } catch (error: any) {
            setError(error.message);
            return false;
        }
    };

    // Función para enviar el formulario
    const enviarFormulario = async () => {
        if (!formularioSeleccionado) {
            setError('Debe seleccionar un formulario');
            return;
        }
        
        // Si no tenemos userInfo, intentamos cargarlo
        if (!userInfo) {
            try {
                await cargarUserInfo();
            } catch (error) {
                setError('No se pudo identificar al usuario. Recargue la página.');
                return;
            }
        }

        if (!userInfo?.id) {
            setError('No se pudo identificar al usuario. Recargue la página.');
            return;
        }

        if (!validarFormulario()) {
            return;
        }

        setCargando(true);
        setError(null);
        setExito(null);

        try {
            const respuestasTareas = datosTemporales.map(t => ({
                tarea: t.id,
                estado_bueno: t.si,
                estado_malo: t.no,
                comentario: t.observaciones || ""
            }));

            if (respuestaId) {
                await updateCompleteRespuesta(
                    respuestaId,
                    comentarioFinal || "Sin comentarios", // Aquí pasamos comentarioFinal
                    respuestasTareas
                );
                setExito('¡Checklist actualizado correctamente!');
            } else {
                await crearNuevaRespuesta(); // Esta función ya usa comentarioFinal
            }

            // ... resto del código ...
        } catch (error: any) {
            console.error('Error al enviar formulario:', error);
            setError(error.message || 'Error al guardar el checklist');
        } finally {
            setCargando(false);
        }
    };

    // Función para vaciar el formulario
    const vaciarFormulario = async () => {
        if (respuestaId && window.confirm('¿Estás seguro de que deseas eliminar esta respuesta?')) {
            setCargando(true);
            try {
                await deleteRespuesta(respuestaId);
                setExito('Respuesta eliminada correctamente');
            } catch (error: any) {
                console.error('Error al eliminar respuesta:', error);
                setError(error.message || 'Error al eliminar la respuesta');
            } finally {
                setCargando(false);
            }
        }

        // Limpiar datos temporales
        if (userInfo?.id) {
            localStorage.removeItem(`checklistTemporal_${userInfo.id}`);
        }

        setDatosTemporales([]);
        setFormularioSeleccionado(null);
        setComentarioFinal("");
        setModoCreacion(false);
        setRespuestaId(null);
    };

    // Función para obtener nombre del sector
    const obtenerNombreSector = (sectorId: number) => {
        const sector = sectores.find(s => s.id === sectorId);
        return sector ? sector.nombre : "Desconocido";
    };

    // Función para obtener respuestas a mostrar
    const getRespuestasAMostrar = () => {
        if (!formularioSeleccionado) {
            return todasLasRespuestas;
        }
        return todasLasRespuestas.filter(r => r.formulario === formularioSeleccionado.id);
    };

    // Estilos responsivos
    const responsiveStyles = {
        title: {
            fontSize: isMobile ? '1.5rem' : '2rem',
            mb: isMobile ? 2 : 3
        },
        tableContainer: {
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
            width: '100%'
        },
        table: {
            minWidth: isMobile ? '800px' : '100%',
        },
        checkbox: {
            padding: isMobile ? '12px' : '8px',
            transform: isMobile ? 'scale(1.3)' : 'scale(1)',
        },
        cell: {
            padding: isMobile ? '12px 6px' : '16px',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minWidth: isMobile ? '150px' : undefined
        },
        headerCell: {
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            padding: isMobile ? '12px 6px' : '16px',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minWidth: isMobile ? '150px' : undefined
        },
        commentBox: {
            p: isMobile ? 2 : 3,
            '& .MuiTypography-h6': {
                fontSize: isMobile ? '1rem' : '1.25rem'
            }
        },
        buttonGroup: {
            flexDirection: isMobile ? 'column' : 'row',
            '& .MuiButton-root': {
                fontSize: isMobile ? '0.875rem' : '1rem',
                py: isMobile ? '10px' : '8px',
                width: isMobile ? '100%' : undefined
            }
        }
    };

    const titulos = estructuraCompleta?.formularios.find(f => f.id === formularioSeleccionado?.id)?.titulos || [];
    const sectorNombre = formularioSeleccionado ? obtenerNombreSector(formularioSeleccionado.sector) : "Sin información";

    if (inicializando) {
        return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress size={60} />
                </Box>
        );
    }

    return (
            <Box sx={{
                p: isMobile ? 2 : 4
            }}>
                <Typography variant="h4" sx={{ mb: 3, color: "#fff" }}>
                    Check List Chancado
                </Typography>

                {/* Notificaciones */}
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
                        <Typography variant="body1" fontWeight="bold">Error:</Typography>
                        <Typography variant="body2">{error}</Typography>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => window.location.reload()}
                            sx={{ mt: 1 }}
                        >
                            Recargar página
                        </Button>
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={!!exito}
                    autoHideDuration={3000}
                    onClose={() => setExito(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="success" sx={{ width: '100%' }} onClose={() => setExito(null)}>
                        {exito}
                    </Alert>
                </Snackbar>

                <InformacionFormulario
                    formularioSeleccionado={formularioSeleccionado}
                    fechaActual={fechaActual}
                    horaActual={horaActual}
                    userInfo={userInfo}
                    obtenerNombreSector={obtenerNombreSector}
                    isMobile={isMobile}
                />
                <Box sx={{ mt: 2, mb: 3}}>
                    <Typography sx={{mb:3}}>
                        {formularioSeleccionado
                            ? `Historial - ${formularioSeleccionado.titulo}`
                            : 'Historial completo'}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table size="small" sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Formulario</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha respuesta</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Última revisión</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getRespuestasAMostrar().length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            {formularioSeleccionado
                                                ? 'No hay respuestas para este formulario'
                                                : 'No hay respuestas registradas'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    getRespuestasAMostrar().map(respuesta => {
                                        const formulario = formularios.find(f => f.id === respuesta.formulario);
                                        const fecha = new Date(respuesta.fecha_respuesta);
                                        const fechaFormateada = fecha.toLocaleString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                                        return (
                                            <TableRow key={respuesta.id} >
                                                <TableCell>
                                                    {formulario ? formulario.titulo : `ID ${respuesta.formulario}`}
                                                </TableCell>
                                                <TableCell>
                                                    {respuesta.usuario_username || `${respuesta.usuario} - ${userInfo?.nombre || 'Usuario'}`}
                                                </TableCell>
                                                <TableCell>
                                                    {userInfo?.nombre}
                                                </TableCell>
                                                <TableCell>
                                                    {fechaFormateada}
                                                </TableCell>
                                                <TableCell>
                                                    {respuesta.estado } 
                                                </TableCell>
                                                
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    <FormControl fullWidth sx={{ flex: 3 }}>
                        <InputLabel
                            id="formulario-label"
                            sx={{
                                fontSize: isMobile ? '0.875rem' : '1rem'
                            }}
                        >
                            Seleccione un formulario
                        </InputLabel>
                        <Select
                            labelId="formulario-label"
                            value={formularioSeleccionado?.id || ""}
                            onChange={(e) => {
                                const formulario = formularios.find(f => f.id === Number(e.target.value));
                                setFormularioSeleccionado(formulario || null);
                            }}
                            label="Seleccione un formulario"
                        >
                            <MenuItem value="" sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                                Seleccione un formulario
                            </MenuItem>
                            {formularios.map(formulario => (
                                <MenuItem
                                    key={formulario.id}
                                    value={formulario.id}
                                    sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
                                >
                                    {formulario.titulo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={crearNuevaRespuesta}
                        disabled={!formularioSeleccionado || cargando}
                        startIcon={cargando ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {cargando ? 'Creando...' : 'Llenar Formulario'}
                    </Button>
                </Box>

                {formularioSeleccionado && estructuraCompleta && (
                    datosTemporales.length > 0 ? (
                        <>
                            <Box sx={responsiveStyles.tableContainer}>
                                <TableContainer
                                    component={Paper}
                                >
                                    <Table sx={responsiveStyles.table} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ ...responsiveStyles.headerCell, fontSize: '0.875rem', py: 1 }}>
                                                    {formularioSeleccionado.item || "Ítem"}
                                                </TableCell>
                                                <TableCell sx={{ ...responsiveStyles.headerCell, fontSize: '0.875rem', py: 1 }}>
                                                    {formularioSeleccionado.aspecto_a_verificar || "Aspecto a verificar"}
                                                </TableCell>
                                                <TableCell sx={{ ...responsiveStyles.headerCell, fontSize: '0.875rem', py: 1 }}>
                                                    {formularioSeleccionado.bueno || "Bien"}
                                                </TableCell>
                                                <TableCell sx={{ ...responsiveStyles.headerCell, fontSize: '0.875rem', py: 1 }}>
                                                    {formularioSeleccionado.malo || "Mal"}
                                                </TableCell>
                                                <TableCell sx={{ ...responsiveStyles.headerCell, fontSize: '0.875rem', py: 1 }}>
                                                    {formularioSeleccionado.comentarios || "Comentarios"}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {titulos.map(titulo => {
                                                const tareasTitulo = datosTemporales.filter(t => t.titulo === titulo.id);
                                                if (tareasTitulo.length === 0) return null;

                                                return (
                                                    <React.Fragment key={titulo.id}>
                                                        {tareasTitulo.map((tarea, index) => (
                                                            <TableRow key={tarea.id} sx={{ '& td': { py: 1 } }}>
                                                                {index === 0 && (
                                                                    <TableCell
                                                                        rowSpan={tareasTitulo.length}
                                                                        sx={{
                                                                            ...responsiveStyles.cell,
                                                                            fontWeight: "bold",
                                                                            minWidth: isMobile ? '180px' : undefined,
                                                                            fontSize: '0.875rem',
                                                                            py: 1
                                                                        }}
                                                                    >
                                                                        {titulo.nombre}
                                                                    </TableCell>
                                                                )}
                                                                <TableCell sx={{
                                                                    ...responsiveStyles.cell,
                                                                    minWidth: isMobile ? '200px' : undefined,
                                                                    fontSize: '0.875rem',
                                                                    py: 1
                                                                }}>
                                                                    {tarea.descripcion}
                                                                </TableCell>
                                                                <TableCell sx={{ ...responsiveStyles.cell, py: 1 }}>
                                                                    <Checkbox
                                                                        checked={tarea.si}
                                                                        onChange={(e) => handleCambioTarea(tarea.id, "si", e.target.checked)}
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{ ...responsiveStyles.cell, py: 1 }}>
                                                                    <Checkbox
                                                                        checked={tarea.no}
                                                                        onChange={(e) => handleCambioTarea(tarea.id, "no", e.target.checked)}
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{
                                                                    ...responsiveStyles.cell,
                                                                    minWidth: isMobile ? '200px' : undefined,
                                                                    py: 1
                                                                }}>
                                                                    <TextField
                                                                        value={tarea.observaciones}
                                                                        onChange={(e) => handleCambioTarea(tarea.id, "observaciones", e.target.value)}
                                                                        fullWidth
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            <Box sx={{
                                ...responsiveStyles.commentBox
                            }}>
                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", fontSize: '0.875rem' }}>
                                    Otras observaciones:
                                </Typography>
                                <TextField
                                    value={comentarioFinal}
                                    onChange={(e) => setComentarioFinal(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={isMobile ? 2 : 3}
                                    placeholder="Ingrese las observaciones generales sobre el checklist..."
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </>
                    ) : (
                        <Typography >
                            No hay tareas para este formulario.
                        </Typography>
                    )
                )}

                <Box sx={{
                    mt: 3,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    ...responsiveStyles.buttonGroup
                }}>
                    <Button
                        variant="outlined"
                        onClick={vaciarFormulario}
                        disabled={cargando}
                    >
                        Vaciar Formulario
                    </Button>

                    <GenerarPDF
                        datosTemporales={datosTemporales}
                        userInfo={userInfo}
                        formularioSeleccionado={formularioSeleccionado}
                        fechaActual={fechaActual}
                        horaActual={horaActual}
                        sectorNombre={sectorNombre}
                        titulos={titulos}
                        comentarioFinal={comentarioFinal}
                        onVaciarFormulario={vaciarFormulario}
                        isMobile={isMobile}
                    />
                </Box>
            </Box>
    );
};

export default ChecklistChancado;