import React from 'react';
import { Box } from '@mui/material';
import UserForm from './UserForm';

const CreateUserForm: React.FC = () => {
    return (
        <Box sx={{ minHeight: "100vh", p: 3 }}>
            <h1>Crear Nuevo Usuario</h1>
            <UserForm />
        </Box>
    );
};

export default CreateUserForm;