import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CustomUser } from '../../../../models/UserModel';

interface EditUserFormProps {
    user: CustomUser;
    onUpdate: (
        updateData: Partial<CustomUser>,
        password?: string,
        photo?: File | null
    ) => Promise<void>;
    onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUpdate, onCancel }) => {
    const [updatedUser, setUpdatedUser] = useState(user);
    const [password, setPassword] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<unknown>
    ) => {
        const { name, value } = event.target as { name: keyof CustomUser; value: unknown };

        setUpdatedUser(prev => ({
            ...prev,
            [name]: name === 'shift_group' ? Number(value) : value
        }));
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setSelectedPhoto(event.target.files[0]);
            setRemovePhoto(false);
        }
    };

    const handleRemovePhoto = () => {
        setSelectedPhoto(null);
        setRemovePhoto(true);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            // Crear objeto con datos actualizados
            const updateData = {
                ...updatedUser,
                // Incluir información de la foto actual si no se cambia
                currentPhoto: !selectedPhoto && !removePhoto ? user.photo : undefined
            };

            await onUpdate(
                updateData,
                password,
                removePhoto ? null : selectedPhoto
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Paper elevation={6} sx={{
            p: 3,
            borderRadius: 3,
            width: '90%',
            maxWidth: 800,
            margin: 'auto'
        }}>
            <Typography variant="h6" gutterBottom sx={{  }}>
                Editar Usuario
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nombre de Usuario"
                            name="username"
                            value={updatedUser.username}
                            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            name="email"
                            value={updatedUser.email || ''}
                            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="first_name"
                            value={updatedUser.first_name}
                            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Apellido"
                            name="last_name"
                            value={updatedUser.last_name}
                            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Carnet de Identidad"
                            name="identity_card"
                            value={updatedUser.identity_card}
                            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Número de Celular"
                            name="phone_number"
                            value={updatedUser.phone_number || ''}
                            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
                        />
                    </Grid>

                    {/* Selectores como en el formulario de creación */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel>Turno *</InputLabel>
                            <Select
                                name="shift_type"
                                value={updatedUser.shift_type}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Día">Día</MenuItem>
                                <MenuItem value="Noche">Noche</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel>Grupo *</InputLabel>
                            <Select
                                name="shift_group"
                                value={updatedUser.shift_group}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value={1}>Grupo 1</MenuItem>
                                <MenuItem value={2}>Grupo 2</MenuItem>
                                <MenuItem value={3}>Grupo 3</MenuItem>
                                <MenuItem value={4}>Grupo 4</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel>Rol *</InputLabel>
                            <Select
                                name="role"
                                value={updatedUser.role}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="jefe_area">Jefe de Área</MenuItem>
                                <MenuItem value="capataz">Capataz</MenuItem>
                                <MenuItem value="operador">Operador</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nueva Contraseña"
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Dejar en blanco para no cambiar"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            sx={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                textTransform: "none",
                                mr: 2
                            }}
                        >
                            {selectedPhoto ? "Cambiar Foto" : "Subir Foto"}
                            <input
                                type="file"
                                hidden
                                onChange={handlePhotoChange}
                                accept="image/*"
                            />
                        </Button>

                        {user.photo && !selectedPhoto && !removePhoto && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleRemovePhoto}
                            >
                                Eliminar Foto Actual
                            </Button>
                        )}

                        {selectedPhoto && (
                            <Typography variant="body2" sx={{ mt: 1,  }}>
                                Nueva foto seleccionada: {selectedPhoto.name}
                            </Typography>
                        )}
                        {removePhoto && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Foto actual será eliminada
                            </Typography>
                        )}
                    </Grid>

                    {/* Botones de acción */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            sx={{ mr: 2 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{ mr: 2 }}
                        >
                            {isSubmitting ? 'Actualizando...' : 'Actualizar Usuario'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default EditUserForm;