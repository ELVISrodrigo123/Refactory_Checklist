import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Badge, Box, IconButton, Toolbar } from '@mui/material';
import { SideNav, menuItems } from '@/components/SideNav';


export const AdminAppHeader: React.FC = () => {


    return (
        <AppBar position='sticky' sx={{ p: 1 }} >
            <Toolbar>
                <SideNav items={menuItems} isMobile={true} />
                <Box component="img" sx={{ width: '5rem' }} src="/assets/img/logo.png" />
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
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AdminAppHeader;