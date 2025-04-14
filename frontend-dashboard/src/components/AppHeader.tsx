import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Badge, Box, IconButton, Toolbar, Popover, Typography } from '@mui/material';
import { Notifications, MenuTwoTone, Settings, Logout } from '@mui/icons-material';
import { useProSidebar } from 'react-pro-sidebar';

interface AppHeaderProps {
    pendingUpdates?: boolean;
    notificationMessage?: string;
    showOnEntry?: boolean; // Nueva prop para controlar apertura automática
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    pendingUpdates = false,
    notificationMessage = "Complete sus datos obligatorios",
    showOnEntry = false
}) => {
    const { collapseSidebar, toggleSidebar, broken } = useProSidebar();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const notificationRef = useRef<HTMLButtonElement>(null);

    // Abre automáticamente al montar el componente si showOnEntry es true
    useEffect(() => {
        if (showOnEntry && pendingUpdates && notificationRef.current) {
            setAnchorEl(notificationRef.current);

            // Cierra automáticamente después de 8 segundos
            const timer = setTimeout(() => {
                setAnchorEl(null);
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [showOnEntry, pendingUpdates]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <AppBar position="sticky" sx={{ bgcolor: "#5569ff", width: '100%' }}>
            <Toolbar>
                {/* Icono de menú */}
                <IconButton onClick={() => broken ? toggleSidebar() : collapseSidebar()}>
                    <MenuTwoTone />
                </IconButton>

                {/* Logo */}
                <Box component="img" src="/assets/img/logo.png" sx={{
                    borderRadius: 2,
                    width: 80,
                    ml: 2,
                    cursor: 'pointer'
                }} />

                <Box sx={{ flexGrow: 1 }} />

                {/* Icono de notificaciones con referencia */}
                <IconButton
                    ref={notificationRef}
                    onClick={handleClick}
                    sx={{ position: 'relative' }}
                    aria-describedby="notification-popover"
                >
                    <Badge
                        badgeContent={pendingUpdates ? "!" : 0}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                            }
                        }}
                    >
                        <Notifications />
                    </Badge>
                    {pendingUpdates && (
                        <Box sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 8,
                            height: 8,
                            bgcolor: 'red',
                            borderRadius: '50%',
                            animation: 'pulse 1.5s infinite',
                            '@keyframes pulse': {
                                '0%': { opacity: 1 },
                                '50%': { opacity: 0.3 },
                                '100%': { opacity: 1 }
                            }
                        }} />
                    )}
                </IconButton>

                {/* Panel de notificaciones */}
                <Popover
                    id="notification-popover"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={{
                        mt: 1,
                        '& .MuiPaper-root': {
                            width: 300,
                            p: 2,
                            bgcolor: '#2D3748',
                            color: 'white',
                            borderRadius: '10px',
                            animation: open ? '$fadeIn 0.3s ease-out' : '',
                        },
                        '@keyframes fadeIn': {
                            '0%': { opacity: 0, transform: 'translateY(-10px)' },
                            '100%': { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <Notifications sx={{ mr: 1, fontSize: '1.2rem' }} />
                            Aviso Importante
                        </Typography>

                        {pendingUpdates && (
                            <Box sx={{
                                bgcolor: '#4A5568',
                                borderRadius: '8px',
                                p: 2,
                                mb: 1,
                                borderLeft: '4px solid #FFA726'
                            }}>
                                <Typography variant="body2">
                                    {notificationMessage}
                                </Typography>
                            </Box>
                        )}

                        <Typography variant="caption" sx={{
                            display: 'block',
                            textAlign: 'right',
                            color: '#A0AEC0',
                            mt: 1
                        }}>
                            {new Date().toLocaleTimeString()}
                        </Typography>
                    </Box>
                </Popover>

                {/* Iconos adicionales */}
                <IconButton title="Settings">
                    <Settings />
                </IconButton>

                <IconButton href="/" title="Sign Out">
                    <Logout />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};