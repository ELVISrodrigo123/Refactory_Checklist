import React from "react";
import ArchiveIcon from '@mui/icons-material/Archive';
import ViewListIcon from '@mui/icons-material/ViewList';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import Link from "next/link";

const AdminSideNav: React.FC = () => {
    const { collapsed } = useProSidebar();


    const menuItems = [
        {
            path: "/Admin/containers/CreateExelFile",
            label: "Subir archivo Excel",
            icon: <ArchiveIcon />,
        },
        {
            path: "/Admin/containers/ListArt",
            label: "Lista de ART",
            icon: <ViewListIcon />,
        },
        {
            path: "/Admin/containers/UserProfile",
            label: "Crear Usuario",
            icon: <PersonAddAltIcon />,
        },
        {
            path: "/Admin/containers/ViewProfile",
            label: "Lista de Personal",
            icon: <SupervisorAccountIcon />,
        },
        {
            path: "/Admin/containers/CreateForm",
            label: "Creacion de formularios",
            icon: <ViewListIcon />,
        },
        {
            path: "/Admin/containers/TableFormulario",
            label: "Formularios",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistReactivos",
            label: "Form Domo",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistEspesadores",
            label: "Form Molienda",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistFiltro",
            label: "Form Flotacion Plomo",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistFlotacionZinc",
            label: "Form Flotación Zinc",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistReactivos",
            label: "Form Reactivos",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistEspesadores",
            label: "Form Espesadores",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistFiltro",
            label: "Form Filtros",
            icon: <EditNoteIcon />,
        },
        {
            path: "/OperatorDashboard/containers/ChecklistCarguio",
            label: "Form Carguío",
            icon: <EditNoteIcon />,
        },
    ];

    return (
        <Sidebar>
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
            <Menu>
                {menuItems.map(({ path, label, icon }, index) => (
                    <MenuItem
                        key={`${path}-${index}`}
                        className="icon-sidebar"
                        component={<Link href={path} passHref />}
                    >
                        <Box
                            sx={{ display: "flex" }}
                        >
                            <Box sx={{ mr: 2 }}>{icon}</Box>
                            <Typography  >
                                {label}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </Sidebar>
    );
};

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
};

export default AdminSideNav;