import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, TextField, IconButton, Alert, InputAdornment, CircularProgress } from '@mui/material';
import { Person, Lock, Login } from "@mui/icons-material";
import { login } from '../services/auth';

const COLORS = {
  primary: '#5569ff',
  primaryDark: '#4558cc',
  background: '#f5f7ff',
  text: '#1A233A',
  error: '#d32f2f'
};

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
  
    try {
      const { user } = await login(username, password);
      router.push(user.is_superuser ? '/Admin' : 
                (user.role === 'jefe_area' || user.role === 'capataz') ? 
                '/CapatazDashboard' : '/OperatorDashboard');
    } catch (err) {
      setError('Credenciales incorrectas. Verifique sus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: COLORS.background,
      p: 0,
      m: 0
    }}>
      <Box component="form" onSubmit={handleSubmit} sx={{
        backgroundColor: "white",
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        m: 0
      }}>
        <IconButton sx={{
          mb: 2,
          color: COLORS.primary,
          backgroundColor: `${COLORS.primary}10`,
          '&:hover': { backgroundColor: `${COLORS.primary}20` }
        }}>
          <Person fontSize="large" />
        </IconButton>
        
        <Typography variant="h5" sx={{ mb: 3, color: COLORS.text, fontWeight: 'bold' }}>
          Minera Portal
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}

        <TextField
          fullWidth
          name="username"
          label="Usuario"
          variant="outlined"
          required
          disabled={loading}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Person sx={{ color: COLORS.primary }} /></InputAdornment>,
          }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        
        <TextField
          fullWidth
          type="password"
          name="password"
          label="Contraseña"
          variant="outlined"
          required
          disabled={loading}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock sx={{ color: COLORS.primary }} /></InputAdornment>,
          }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Login />}
          disabled={loading}
          fullWidth
          sx={{
            mt: 2,
            py: 1.5,
            backgroundColor: COLORS.primary,
            borderRadius: 2,
            '&:hover': { backgroundColor: COLORS.primaryDark },
            '&:disabled': { backgroundColor: `${COLORS.primary}80` }
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;