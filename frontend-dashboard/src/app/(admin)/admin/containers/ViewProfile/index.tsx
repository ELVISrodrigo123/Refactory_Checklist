import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, IconButton, Fade,
    Avatar, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Button, TableSortLabel,
    TextField, Tooltip, CircularProgress, useTheme
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { CustomUser } from '../../../models/UserModel';
import { getUsers, deleteUser, updateUser } from '../../../services/UserServices';
import EditUserForm from './EditForm';
import { visuallyHidden } from '@mui/utils';

const ViewProfile = () => {
    const theme = useTheme();
    const [users, setUsers] = useState<CustomUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<CustomUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<CustomUser | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof CustomUser>('username');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleEdit = (user: CustomUser) => {
        setSelectedUser(user);
        setIsEditing(true);
    };

    const handleDeleteClick = (id: number) => {
        setUserToDeleteId(id);
        setConfirmDeleteDialogOpen(true);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteDialogOpen(false);
        setUserToDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            if (userToDeleteId !== null) {
                await deleteUser(userToDeleteId);
                alert("Usuario eliminado exitosamente");
                setUsers(prev => prev.filter(user => user.id !== userToDeleteId));
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        } finally {
            setConfirmDeleteDialogOpen(false);
            setUserToDeleteId(null);
        }
    };

    const handleUpdate = async (updatedUser: any, password?: string, photo?: File | null) => {
        if (!selectedUser) return;

        try {
            const formData = new FormData();

            // 1. Agregar campos básicos
            const fields = [
                'username', 'email', 'first_name', 'last_name',
                'identity_card', 'phone_number', 'shift_type',
                'shift_group', 'role'
            ];

            fields.forEach(field => {
                if (updatedUser[field] !== undefined) {
                    formData.append(field, updatedUser[field]?.toString() || '');
                }
            });

            // 2. Agregar contraseña si existe
            if (password) formData.append('password', password);

            // 3. Manejo avanzado de la foto
            if (photo instanceof File) {
                formData.append('photo', photo);
            } else if (photo === null) {
                // Solicitud explícita para eliminar foto
                formData.append('photo', '');
            } else if (updatedUser.currentPhoto) {
                // Mantener foto existente
                formData.append('current_photo', updatedUser.currentPhoto);
            }

            console.log('Datos enviados al servidor:');
            for (const [key, value] of formData.entries()) {
                console.log(key, value instanceof File ? `File: ${value.name}` : value);
            }

            const updatedResponse = await updateUser(selectedUser.id, formData);

            // Actualizar estado con caché-busting para la foto
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === selectedUser.id ? {
                    ...user,
                    ...updatedResponse,
                    photo: updatedResponse.photo ?
                        `${updatedResponse.photo}?t=${Date.now()}` :
                        null
                } : user
            ));

            setIsEditing(false);
            setSelectedUser(null);
            alert("Usuario actualizado exitosamente");
        } catch (error: any) {
            console.error("Error completo:", error.response?.data || error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleRequestSort = (property: keyof CustomUser) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const stableSort = (array: CustomUser[], comparator: (a: CustomUser, b: CustomUser) => number) => {
        return array.slice().sort(comparator);
    };

    const getComparator = (order: 'asc' | 'desc', orderBy: keyof CustomUser) => {
        return order === 'desc'
            ? (a: CustomUser, b: CustomUser) => descendingComparator(a, b, orderBy)
            : (a: CustomUser, b: CustomUser) => -descendingComparator(a, b, orderBy);
    };

    const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T): number => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    };

    const headerCells = [
        { id: 'photo', label: 'Foto', sortable: false },
        { id: 'username', label: 'Usuario', sortable: true },
        { id: 'phone_number', label: 'Celular', sortable: true },
        { id: 'email', label: 'Correo', sortable: true },
        { id: 'first_name', label: 'Nombre', sortable: true },
        { id: 'last_name', label: 'Apellido', sortable: true },
        { id: 'identity_card', label: 'Carnet', sortable: true },
        { id: 'shift_type', label: 'Turno', sortable: true },
        { id: 'shift_group', label: 'Grupo', sortable: true },
        { id: 'role', label: 'Rol', sortable: true },
        { id: 'actions', label: 'Acciones', sortable: false }
    ];

    return (
        <Box sx={{
            bgcolor: theme.palette.background.default,
            minHeight: "100vh",
            p: 3,
            color: theme.palette.text.primary
        }}>
            {/* Título y Barra de Búsqueda */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: theme.palette.primary.main
                }}>
                    Gestión de Usuarios
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon sx={{
                                color: theme.palette.action.active,
                                mr: 1
                            }} />
                        ),
                        sx: {
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1
                        }
                    }}
                    sx={{ maxWidth: 500 }}
                />
            </Box>

            {/* Contenido Principal */}
            {loading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh'
                }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: theme.shadows[2],
                    border: `1px solid ${theme.palette.divider}`
                }}>
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
                        <Table stickyHeader size="medium">
                            <TableHead>
                                <TableRow>
                                    {headerCells.map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            sx={{
                                                backgroundColor: theme.palette.grey[100],
                                                fontWeight: 600,
                                                color: theme.palette.text.primary
                                            }}
                                        >
                                            {cell.sortable ? (
                                                <TableSortLabel
                                                    active={orderBy === cell.id}
                                                    direction={orderBy === cell.id ? order : 'asc'}
                                                    onClick={() => handleRequestSort(cell.id as keyof CustomUser)}
                                                >
                                                    {cell.label}
                                                    {orderBy === cell.id ? (
                                                        <Box component="span" sx={visuallyHidden}>
                                                            {order === 'desc' ? 'orden descendente' : 'orden ascendente'}
                                                        </Box>
                                                    ) : null}
                                                </TableSortLabel>
                                            ) : (
                                                cell.label
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(filteredUsers, getComparator(order, orderBy)).map((user) => (
                                    <TableRow
                                        key={user.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Avatar
                                                src={user.photo ? `${user.photo}?t=${Date.now()}` : "/default-avatar.png"}
                                                alt={user.username}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    border: `2px solid ${theme.palette.primary.main}`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.phone_number || '-'}</TableCell>
                                        <TableCell>{user.email || '-'}</TableCell>
                                        <TableCell>{user.first_name}</TableCell>
                                        <TableCell>{user.last_name}</TableCell>
                                        <TableCell>{user.identity_card}</TableCell>
                                        <TableCell>{user.shift_type}</TableCell>
                                        <TableCell>Grupo {user.shift_group}</TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 1,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                bgcolor:
                                                    user.role === 'jefe_area' ? theme.palette.success.light :
                                                        user.role === 'capataz' ? theme.palette.warning.light :
                                                            theme.palette.info.light,
                                                color: theme.palette.getContrastText(
                                                    user.role === 'jefe_area' ? theme.palette.success.light :
                                                        user.role === 'capataz' ? theme.palette.warning.light :
                                                            theme.palette.info.light
                                                ),
                                                fontWeight: 500,
                                                fontSize: '0.75rem'
                                            }}>
                                                {user.role}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Editar" arrow>
                                                    <IconButton
                                                        onClick={() => handleEdit(user)}
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.primary.light
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar" arrow>
                                                    <IconButton
                                                        onClick={() => handleDeleteClick(user.id)}
                                                        sx={{
                                                            color: theme.palette.error.main,
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.error.light
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Diálogo de Confirmación de Eliminación */}
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={handleCancelDelete}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: theme.palette.grey[100],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontWeight: 600
                }}>
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.grey[50]
                }}>
                    <Button
                        onClick={handleCancelDelete}
                        variant="outlined"
                        sx={{
                            mr: 2,
                            px: 3,
                            textTransform: 'none'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        sx={{
                            px: 3,
                            textTransform: 'none'
                        }}
                    >
                        Confirmar Eliminación
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Formulario de Edición */}
            {isEditing && selectedUser && (
                <Fade in>
                    <Box sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        zIndex: theme.zIndex.modal,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <EditUserForm
                            user={selectedUser}
                            onUpdate={handleUpdate}
                            onCancel={() => {
                                setIsEditing(false);
                                setSelectedUser(null);
                            }}
                        />
                    </Box>
                </Fade>
            )}
        </Box>
    );
};

export default ViewProfile;