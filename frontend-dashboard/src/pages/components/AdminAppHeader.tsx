import React from 'react';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Badge, Box, IconButton, Toolbar } from '@mui/material';
import { useProSidebar } from 'react-pro-sidebar';
import theme from '@/config/theme';

export const AdminAppHeader: React.FC = () => {
    const { collapseSidebar, toggleSidebar, broken } = useProSidebar();

    return (
        <AppBar position="sticky" sx={{p:1}} >
            <Toolbar>
                <IconButton
                    onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
                    
                >
                    <MenuTwoToneIcon />
                </IconButton>
                <Box component="img" sx={{width:'5rem'}} src="/assets/img/logo.png" />
                <Box sx={{ flexGrow: 1 }} />
                <IconButton title="Notifications" >
                    <Badge badgeContent={4} color="primary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <IconButton title="Settings" >
                    <SettingsIcon />
                </IconButton>
                <IconButton href="/" title="Sign Out" >
                    <LogoutIcon  />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AdminAppHeader;