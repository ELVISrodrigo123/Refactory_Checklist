import React, { useState } from "react";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { Menu, Sidebar, sidebarClasses } from "react-pro-sidebar";
import Link from "next/link";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { MenuItemProps } from './types'

export function DesktopSideNav({ items }: MenuItemProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Box sx={{ height: "100vh", display: { sm: "block", xs: "none" } }}>
            <Sidebar rootStyles={{
                [`.${sidebarClasses.container}`]: {
                    backgroundColor: 'transparent',
                    position: 'relative',
                    zIndex: 1,
                }
            }}
                collapsed={collapsed}
            >
                <IconButton
                    onClick={() => (collapsed ? setCollapsed(false) : setCollapsed(true))}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                        color: "#5569ff",
                    }}
                >
                    {collapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosNewIcon />}
                </IconButton>
                <Box sx={styles.avatarContainer}>
                    <Avatar sx={styles.avatar} alt="Admin" src="/assets/img/admin.png" />
                    {!collapsed && (
                        <>
                            <Typography >
                                Jefa de Operaciones
                            </Typography>
                            <Typography variant="overline">UsuarioAdmin</Typography>
                        </>
                    )}
                </Box>
                <Divider />
                <Menu>
                    {items.map(({ path, label, icon }, index) => (
                        <Box
                            key={`${path}-${index}`}
                            className="icon-sidebar"
                            component={Link}
                            href={path}
                            passHref
                            sx={styles.menuItem}
                        >
                            <Box
                                sx={{ display: "flex" }}
                            >
                                <Box sx={{ mr: 2 }}>{icon}</Box>
                                <Typography sx={{ display: collapsed ? 'none' : 'block' }} >
                                    {label}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Menu>
            </Sidebar>
        </Box>
    )
}

const styles = {
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        my: 5,
        color: "#5569ff",
        fontWeight: "bold",
    },
    avatar: {
        width: "40%",
        height: "auto",
    },
    yourDescription: {
        mt: 0,
    },
    menuItem: {
        display: "flex",
        alignItems: "center",
        padding: "10px 15px",
        transition: "background-color 0.3s",
    },
    icon: {
        marginRight: 2,
    },
    
};