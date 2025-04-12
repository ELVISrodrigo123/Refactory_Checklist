import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/auth';
import {
    AppBar,
    Toolbar,
    Typography,
    Breadcrumbs,
    Link,
    Avatar,
    Box,
    IconButton,
    Button,
    TextField,
    Paper,
    Divider,
    Grid,
    InputAdornment,
    MenuItem
} from '@mui/material';
import {
    Edit as EditIcon,
    CloudUpload as CloudUploadIcon,
    Facebook as FacebookIcon,
    LinkedIn as LinkedInIcon,
    WhatsApp as WhatsAppIcon,
    Twitter as TwitterIcon,
    YouTube as YouTubeIcon,
    Lock as LockIcon,
    Phone as PhoneIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import CapatazLayout from '../components/CapatazLayout';

interface UserData {
    id: string;
    identity_card?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    shift_type?: string;
    shift_group?: string;
    photo?: string;
    username: string;
    is_superuser: boolean;
    role?: 'jefe_area' | 'capataz' | 'operador';
    [key: string]: any;
}

const CapatazDashboard = () => {
    const { user: authUser, loading: authLoading } = useAuth();
    const [user, setUser] = useState<UserData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<UserData>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const [pendingUpdates, setPendingUpdates] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useEffect(() => {
        if (authUser && !initialCheckDone) {
            const needsUpdate =
                !authUser.phone_number ||
                authUser.phone_number === 'Ninguno' ||
                !authUser.email;
            setPendingUpdates(needsUpdate);
            setInitialCheckDone(true);
        }
    }, [authUser, initialCheckDone]);

    useEffect(() => {
        if (authUser) {
            setUser(authUser);
            setFormData({
                identity_card: authUser.identity_card || 'Ninguno',
                first_name: authUser.first_name,
                last_name: authUser.last_name,
                email: authUser.email,
                phone_number: authUser.phone_number || 'Ninguno',
                shift_type: authUser.shift_type || 'Ninguno',
                shift_group: authUser.shift_group || 'Ninguno',
                username: authUser.username,
                role: authUser.role
            });
        }
    }, [authUser]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!user) return;

            const updateData: any = {
                email: formData.email,
                phone_number: formData.phone_number === 'Ninguno' ? '' : formData.phone_number,
                shift_type: formData.shift_type === 'Ninguno' ? '' : formData.shift_type,
                shift_group: formData.shift_group === 'Ninguno' ? '' : formData.shift_group
            };

            if (password) {
                updateData.password = password;
            }

            if (selectedFile) {
                const formDataObj = new FormData();
                formDataObj.append('photo', selectedFile);
                Object.keys(updateData).forEach(key => {
                    formDataObj.append(key, updateData[key]);
                });
                await updateUserProfile(user.id, formDataObj);
            } else {
                await updateUserProfile(user.id, updateData);
            }

            setSnackbar({
                open: true,
                message: 'Perfil actualizado correctamente',
                severity: 'success'
            });
            setEditMode(false);
            setPassword('');
            if (authUser) {
                setUser({
                    ...authUser,
                    ...updateData,
                    photo: selectedFile ? URL.createObjectURL(selectedFile) : authUser.photo
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Falta llenar algunos campos',
                severity: 'error'
            });
        }
    };

    if (authLoading || !user) {
        return (
            <CapatazLayout>
                <Box sx={{ bgcolor: "#10172A", minHeight: "100vh", color: "white", p: 2 }}>
                    <Typography>Cargando información del usuario...</Typography>
                </Box>
            </CapatazLayout>
        );
    }

    return (
        <CapatazLayout pendingUpdates={pendingUpdates}
        notificationMessage="¡Atención! Debe actualizar los siguientes datos de manera obligatoria : Numero de Telefono , Email y Contraseña para continuar"
        showOnEntry={pendingUpdates} >
            <Box sx={{ bgcolor: "#10172A", minHeight: "100vh", color: "white" }}>
                {/* Video Header */}
                <Box sx={{
                    height: { xs: '200px', md: '300px' },
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <video
                        autoPlay
                        loop
                        muted
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.7)'
                        }}
                    >
                        <source src="/assets/video/header.mp4" type="video/mp4" />
                    </video>

                    {/* Overlay Content */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 4,
                        background: 'linear-gradient(to top, rgba(16, 23, 42, 0.9), transparent)'
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            Bienvenido, {user.first_name}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1, fontSize: { xs: '0.8rem', md: '1rem' } }}>
                            Panel de Operador - Minera San Cristóbal S.A.
                        </Typography>
                    </Box>
                </Box>

                {/* Main Content */}
                <Box sx={{ p: { xs: 2, md: 3 }, mt: { xs: -6, md: -8 } }}>
                    {/* Profile Card */}
                    <Paper sx={{
                        borderRadius: 8,
                        bgcolor: '#1A233A',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden'
                    }}>
                        <Grid container spacing={3} sx={{ marginTop: '2em', p: { xs: 2, md: 4 } }}>
                            {/* Avatar Column */}
                            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{
                                    position: 'relative',
                                    mt: { xs: 0, md: -10 },
                                    mb: 2
                                }}>
                                    <Avatar
                                        src={
                                            selectedFile ? URL.createObjectURL(selectedFile) :
                                                user.photo || '/user-avatar.png'
                                        }
                                        sx={{
                                            width: { xs: 120, md: 150 },
                                            height: { xs: 120, md: 150 },
                                            border: '4px solid #1E3A8A',
                                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                                        }}
                                    />
                                    {editMode ? (
                                        <>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="photo-upload"
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="photo-upload">
                                                <IconButton
                                                    component="span"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 8,
                                                        right: 8,
                                                        bgcolor: '#1E3A8A',
                                                        '&:hover': { bgcolor: '#2A4365' },
                                                        width: 36,
                                                        height: 36
                                                    }}
                                                >
                                                    <CloudUploadIcon sx={{ color: 'white', fontSize: 18 }} />
                                                </IconButton>
                                            </label>
                                        </>
                                    ) : (
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                bottom: 8,
                                                right: 8,
                                                bgcolor: '#1E3A8A',
                                                '&:hover': { bgcolor: '#2A4365' },
                                                width: 36,
                                                height: 36
                                            }}
                                            onClick={() => setEditMode(true)}
                                        >
                                            <EditIcon sx={{ color: 'white', fontSize: 18 }} />
                                        </IconButton>
                                    )}
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    {user.first_name} {user.last_name}
                                </Typography>
                                <Typography variant="body2" color="#A0AEC0" sx={{ textAlign: 'center' }}>
                                    {user.is_superuser ? 'Administrador' : 'Operador'}
                                </Typography>

                                {/* Social Icons */}
                                <Box sx={{
                                    display: "flex",
                                    gap: 1,
                                    mt: 3,
                                    '& .MuiIconButton-root': {
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.1)'
                                        }
                                    }
                                }}>
                                    <IconButton href="https://x.com/MinSanCristobal" target="_blank" sx={{ color: "#1DA1F2" }}>
                                        <TwitterIcon />
                                    </IconButton>
                                    <IconButton href="https://www.facebook.com/minerasancristobal/" target="_blank" sx={{ color: "#1877F2" }}>
                                        <FacebookIcon />
                                    </IconButton>
                                    <IconButton href="https://www.linkedin.com/company/minerasancristobal/posts/?feedView=all" target="_blank" sx={{ color: "white" }}>
                                        <LinkedInIcon />
                                    </IconButton>
                                    <IconButton href="https://www.youtube.com/channel/UCOWuXIO5bawVPBhkd2vNEOg" target="_blank" sx={{ color: "#FF0000" }}>
                                        <YouTubeIcon />
                                    </IconButton>
                                    <IconButton href="https://wa.me/+59171425703" target="_blank" sx={{ color: "#25D366" }}>
                                        <WhatsAppIcon />
                                    </IconButton>
                                </Box>
                            </Grid>

                            {/* Info Column */}
                            <Grid item xs={12} md={8}>
                                {editMode ? (
                                    <Box component="form" onSubmit={handleSaveProfile}>
                                        <Grid container spacing={2}>
                                            {/* Non-editable fields */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="identity_card"
                                                    label="Carnet"
                                                    value={formData.identity_card || 'Ninguno'}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="first_name"
                                                    label="Nombre"
                                                    value={formData.first_name}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="last_name"
                                                    label="Apellido"
                                                    value={formData.last_name}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="shift_group"
                                                    label="Grupo"
                                                    value={formData.shift_group || 'Ninguno'}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                />
                                            </Grid>

                                            {/* Editable fields */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="email"
                                                    label="Correo electrónico"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="phone_number"
                                                    label="Celular"
                                                    value={formData.phone_number === 'Ninguno' ? '' : formData.phone_number}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PhoneIcon sx={{ color: '#A0AEC0', fontSize: 18 }} />
                                                            </InputAdornment>
                                                        ),
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    select
                                                    name="shift_type"
                                                    label="Turno"
                                                    value={formData.shift_type === 'Ninguno' ? '' : formData.shift_type}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <ScheduleIcon sx={{ color: '#A0AEC0', fontSize: 18 }} />
                                                            </InputAdornment>
                                                        ),
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                >
                                                    <MenuItem value="Día">Día</MenuItem>
                                                    <MenuItem value="Noche">Noche</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    type="password"
                                                    label="Nueva contraseña"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon sx={{ color: '#A0AEC0', fontSize: 18 }} />
                                                            </InputAdornment>
                                                        ),
                                                        sx: { color: 'white' }
                                                    }}
                                                    InputLabelProps={{ style: { color: '#A0AEC0' } }}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        sx={{
                                                            bgcolor: '#1E3A8A',
                                                            '&:hover': { bgcolor: '#2A4365' },
                                                            px: 3,
                                                            py: 1,
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        Guardar cambios
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{
                                                            color: 'white',
                                                            borderColor: '#4A5568',
                                                            '&:hover': { borderColor: '#718096' },
                                                            px: 3,
                                                            py: 1,
                                                            fontSize: '0.8rem'
                                                        }}
                                                        onClick={() => {
                                                            setEditMode(false);
                                                            setPassword('');
                                                        }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Carnet</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {formData.identity_card || 'Ninguno'}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Nombre</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {formData.first_name}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Apellido</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {formData.last_name}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Correo electrónico</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {formData.email}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Celular</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {formData.phone_number || 'Ninguno'}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Turno</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {formData.shift_type || 'Ninguno'}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Grupo</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {formData.shift_group || 'Ninguno'}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="#A0AEC0" sx={{ mb: 0.5 }}>Rol</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1rem', color: '#fff' }}>
                                                {user.role === 'jefe_area' ? 'Jefe de Área' :
                                                    user.role === 'capataz' ? 'Capataz' : 'Operador'}
                                            </Typography>
                                            <Divider sx={{ bgcolor: '#2D3748', my: 2 }} />
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* Snackbar */}
                {snackbar.open && (
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            p: 2,
                            bgcolor: snackbar.severity === 'success' ? '#38A169' : '#E53E3E',
                            color: 'white',
                            borderRadius: 1,
                            boxShadow: 3,
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: '0.9rem'
                        }}
                        onClick={() => setSnackbar({ ...snackbar, open: false })}
                    >
                        {snackbar.message}
                    </Box>
                )}
            </Box>
        </CapatazLayout>
    );
};

export default CapatazDashboard;