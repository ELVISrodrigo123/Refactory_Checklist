"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, TextField, IconButton, Alert, InputAdornment, CircularProgress, Card, useTheme } from '@mui/material';
import { Person, Lock, Login } from "@mui/icons-material";
import { login } from '../../../services/auth';



const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const { user } = await login(username, password);
      router.push(user.is_superuser ? '/admin' :
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
      p: 0,
      m: 0
    }}>
      <Card component="form" variant="outlined" onSubmit={handleSubmit} sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        m: 0,
        background: `${theme.colors.alpha.black[5]}`
      }}>
        <IconButton sx={{
          mb: 2,
        }}>
          <Person fontSize="large" />
        </IconButton>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
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
            startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
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
            startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
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
            borderRadius: 2,
          }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </Card>
    </Box>
  );
};

export default LoginForm;