import React from 'react';
import { Box, Typography } from '@mui/material';
import UserForm from './UserForm';

const CreateUserForm: React.FC = () => {
    return (
        <Box sx={{ minHeight: "100vh", p: 3 }}>
            <Typography variant='h2'>Crear Nuevo Usuario</Typography>
            <UserForm />
        </Box>
    );
};

export default CreateUserForm;