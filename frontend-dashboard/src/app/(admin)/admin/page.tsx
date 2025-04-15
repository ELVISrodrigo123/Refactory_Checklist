"use client";
import { AppBar, Toolbar, Typography, Breadcrumbs, Link, Avatar, Box, Tabs, Tab, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useState } from "react";

const Admin = () => {
    const [tabIndex, setTabIndex] = useState(0);
    return (
        <Box sx={{ bgcolor: "#10172A", minHeight: "100vh", color: "white", p: 2 }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: "#1E3A8A", borderRadius: 2 }}>
                <Toolbar>
                    <Typography variant="h6">Bienvenido al Sistema Administrador </Typography>
                </Toolbar>
            </AppBar>

            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ color: "white", mt: 2 }}>
                <Link href="/" underline="hover" color="inherit">Pagina Principal</Link>
                <Typography color="white">Perfil de Uusuario</Typography>
            </Breadcrumbs>

            {/* Background Video */}
            <Box sx={{
                mt: 2,
                height: 200,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative"
            }}>
                <video
                    autoPlay
                    loop
                    muted
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                >
                    <source src="/assets/video/header.mp4" type="video/mp4" />
                </video>
            </Box>

            {/* Profile Section */}
            <Box sx={{ textAlign: "center", mt: -6 }}>
                <Avatar
                    src="/user-avatar.png"
                    sx={{ width: 100, height: 100, border: "4px solid #1E3A8A", margin: "auto" }}
                />
                <Typography variant="h6">Gladys Salvatierra</Typography>
                <Typography variant="body2" color="gray">Administardora principal</Typography>
            </Box>

            {/* Social Icons & Button */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                <IconButton href="https://x.com/MinSanCristobal" target="_blank" sx={{ color: "#1DA1F2" }}>
                    <TwitterIcon />
                </IconButton>
                <IconButton href="https://www.facebook.com/minerasancristobal/" target="_blank" sx={{ color: "#1877F2" }}>
                    <FacebookIcon />
                </IconButton>
                <IconButton href="https://www.linkedin.com/company/minerasancristobal/posts/?feedView=all" target="_blank" sx={{ color: "white" }}>
                    <LinkedInIcon />
                </IconButton>
                <IconButton href="https://www.youtube.com/channel/UCOWuXIO5bawVPBhkd2vNEOg" target="_blank" sx={{ color: "#FF0000" }}>
                    <YouTubeIcon />
                </IconButton>
                <IconButton href="https://wa.me/+59171425703" target="_blank" sx={{ color: "#25D366" }}>
                    <WhatsAppIcon />
                </IconButton>
            </Box>

            {/* Tabs */}
            <Tabs
                value={tabIndex}
                onChange={(e: React.SyntheticEvent, newIndex: number) => setTabIndex(newIndex)}
                centered
                textColor="inherit"
                indicatorColor="primary"
                sx={{ mt: 2 }}
            >
                <Tab label="GRUPO 1" />
                <Tab label="GRUPO 2" />
                <Tab label="GRUPO 3" />
                <Tab label="GRUPO 4" />
            </Tabs>
        </Box>
    );
};

export default Admin;