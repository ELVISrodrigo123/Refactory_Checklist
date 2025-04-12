import React from 'react';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Badge, Box, IconButton, Toolbar } from '@mui/material';
import { useProSidebar } from 'react-pro-sidebar';
import theme from '@/config/theme';

const styles = {
    appBar: {
        background: "#5569ff",
        width: '100%',
    },
    appLogo: {
        borderRadius: 2,
        width: 80,
        ml: 2,
        cursor: 'pointer',
    },
};
export const AdminAppHeader: React.FC = () => {
    const { collapseSidebar, toggleSidebar, broken } = useProSidebar();

    return (
        <AppBar position="sticky" sx={styles.appBar}>
            <Toolbar>
                <IconButton
                    onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
                    
                >
                    <MenuTwoToneIcon sx={{ color: theme.palette.primary.main }}/>
                </IconButton>
                <Box component="img" sx={styles.appLogo} src="/assets/img/logo.png" />
                <Box sx={{ flexGrow: 1 }} />
                <IconButton title="Notifications" >
                    <Badge badgeContent={4} color="primary">
                        <NotificationsIcon sx={{ color: theme.palette.primary.main }}/>
                    </Badge>
                </IconButton>
                <IconButton title="Settings" >
                    <SettingsIcon sx={{ color: theme.palette.primary.main }}/>
                </IconButton>
                <IconButton href="/" title="Sign Out" >
                    <LogoutIcon sx={{ color: theme.palette.primary.main }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AdminAppHeader;