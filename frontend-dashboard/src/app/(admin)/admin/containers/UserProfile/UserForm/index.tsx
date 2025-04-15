"use client"
import React, { useState } from 'react';
import { CustomUser } from '@/models/UserModel';
import { createUser } from '@/services/UserServices';
import {
    TextField, Button, Select, MenuItem, FormControl,
    InputLabel, Box, Grid, Paper, Fade, SelectChangeEvent,
    Typography, Avatar, IconButton, InputAdornment
} from '@mui/material';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    width: '90%',
    maxWidth: 800,
    margin: 'auto',
    padding: theme.spacing(4),
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
}));

const UserForm = () => {
    const [formData, setFormData] = useState<Omit<CustomUser, 'id'> & { photo: File | null }>({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        identity_card: '',
        phone_number: '',
        photo: null,
        shift_type: 'Día',
        shift_group: 1,
        role: 'operador',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CustomUser, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CustomUser, string>> = {};

        if (!formData.username.trim()) newErrors.username = "Nombre de usuario requerido";
        if (!formData.password) newErrors.password = "Contraseña requerida";
        if (!formData.first_name.trim()) newErrors.first_name = "Nombre requerido";
        if (!formData.last_name.trim()) newErrors.last_name = "Apellido requerido";
        if (!formData.identity_card.trim()) newErrors.identity_card = "Carnet de identidad requerido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> |
            SelectChangeEvent<unknown> |
        { target: { name?: string; value: unknown } }
    ) => {
        const { name, value } = e.target as { name: string; value: unknown };

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (name && errors[name as keyof CustomUser]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrors({});

        if (!validateForm()) {
            return;
        }

        try {
            const dataToSend: Partial<Omit<CustomUser, 'photo'>> & { photo?: File } = {
                username: formData.username,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                identity_card: formData.identity_card,
                shift_type: formData.shift_type,
                shift_group: formData.shift_group,
                role: formData.role,
                ...(formData.email && { email: formData.email }),
                ...(formData.phone_number && { phone_number: formData.phone_number }),
                ...(formData.photo && { photo: formData.photo })
            };

            const finalData = formData.photo
                ? (() => {
                    const formDataObj = new FormData();
                    Object.entries(dataToSend).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                            formDataObj.append(key, value instanceof Blob ? value : String(value));
                        }
                    });
                    return formDataObj;
                })()
                : dataToSend;

            await createUser(finalData);
            alert("Usuario creado exitosamente");
            setFormData({
                username: '',
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                identity_card: '',
                phone_number: '',
                photo: null,
                shift_type: 'Día',
                shift_group: 1,
                role: 'operador',
            });
        } catch (error: any) {
            if (error.response?.status === 400) {
                const errorData = error.response?.data;

                if (errorData?.message?.toLowerCase().includes('carnet') ||
                    errorData?.message?.toLowerCase().includes('identidad') ||
                    errorData?.message?.toLowerCase().includes('ya existe')) {
                    alert("Este número de carnet ya existe en el sistema");
                    return;
                }

                if (errorData?.errors?.identity_card) {
                    alert("Este número de carnet ya existe en el sistema");
                    return;
                }
            }
            alert("Este número de carnet u usuario ya existe en el sistema ");
        }
    };

    const handleRemovePhoto = () => {
        setFormData({ ...formData, photo: null });
    };

    return (
        <Fade in timeout={300}>
            <StyledPaper>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    Crear Nuevo Usuario
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                                Información Básica
                            </Typography>

                            <StyledTextField
                                label="Nombre de usuario"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.username}
                                helperText={errors.username}
                            />

                            <StyledTextField
                                label="Contraseña"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.password}
                                helperText={errors.password}
                            />

                            <StyledTextField
                                label="Nombre"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                            />

                            <StyledTextField
                                label="Apellido"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                            />

                            <StyledTextField
                                label="Carnet de Identidad"
                                name="identity_card"
                                value={formData.identity_card}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.identity_card}
                                helperText={errors.identity_card}
                                InputProps={{
                                    endAdornment: errors.identity_card && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={() => setErrors(prev => ({ ...prev, identity_card: '' }))}
                                                size="small"
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                                Información Adicional
                            </Typography>

                            <StyledTextField
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                            />

                            <StyledTextField
                                label="Número de Celular"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                fullWidth
                            />

                            <StyledFormControl fullWidth required>
                                <InputLabel>Turno</InputLabel>
                                <Select
                                    name="shift_type"
                                    value={formData.shift_type}
                                    onChange={handleChange}
                                    label="Turno"
                                >
                                    <MenuItem value="Día">Día</MenuItem>
                                    <MenuItem value="Noche">Noche</MenuItem>
                                </Select>
                            </StyledFormControl>

                            <StyledFormControl fullWidth required>
                                <InputLabel>Grupo</InputLabel>
                                <Select
                                    name="shift_group"
                                    value={formData.shift_group}
                                    onChange={handleChange}
                                    label="Grupo"
                                >
                                    <MenuItem value={1}>Grupo 1</MenuItem>
                                    <MenuItem value={2}>Grupo 2</MenuItem>
                                    <MenuItem value={3}>Grupo 3</MenuItem>
                                    <MenuItem value={4}>Grupo 4</MenuItem>
                                </Select>
                            </StyledFormControl>

                            <StyledFormControl fullWidth required>
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    label="Rol"
                                >
                                    <MenuItem value="jefe_area">Jefe de Área</MenuItem>
                                    <MenuItem value="capataz">Capataz</MenuItem>
                                    <MenuItem value="operador">Operador</MenuItem>
                                </Select>
                            </StyledFormControl>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Foto de perfil (Opcional)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ textTransform: 'none', bgcolor: "#6a6c77" }}
                                    >
                                        Subir foto
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFormData({ ...formData, photo: e.target.files[0] });
                                                }
                                            }}
                                        />
                                    </Button>

                                    {formData.photo && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: "#6a6c77", gap: 1 }}>
                                            <Avatar
                                                src={URL.createObjectURL(formData.photo)}
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {formData.photo.name}
                                            </Typography>
                                            <IconButton size="small" onClick={handleRemovePhoto}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                        >
                            Crear Usuario
                        </Button>
                    </Box>
                </Box>
            </StyledPaper>
        </Fade>
    );
};

export default UserForm;