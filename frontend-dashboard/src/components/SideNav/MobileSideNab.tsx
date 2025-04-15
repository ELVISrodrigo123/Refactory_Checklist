"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { MenuItemProps } from "./types";
import { Avatar, IconButton, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

export function MobileSideNav({ items }: MenuItemProps) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
        }} role="presentation" onClick={toggleDrawer(false)}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
            }}>
                <Avatar alt="Admin" src="/assets/img/admin.png" />
                <>
                    <Typography >
                        Jefa de Operaciones
                    </Typography>
                    <Typography variant="overline">UsuarioAdmin</Typography>
                </>
            </Box>
            <Divider />
            <List>
                {
                    items.map(({ icon, label, path }, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <Button
                                    variant="text"
                                    component={Link}
                                    href={path}
                                    sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "space-between", 
                                        textDecoration: "none", 
                                        color: "inherit", 
                                        width: "100%", 
                                        borderRadius: "5px", 
                                        padding: "10px", 
                                        border: `1px solid ${theme.palette.primary.light}`, 
                                    }}
                                >
                                    <Box sx={{ mr: 2 }}>{icon}</Box>
                                    <Typography >
                                        {label}
                                    </Typography>
                                </Button>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton sx={{ display: { sm: "none", xs: "block" } }} onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
