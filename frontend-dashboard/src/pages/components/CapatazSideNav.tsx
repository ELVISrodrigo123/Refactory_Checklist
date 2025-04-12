import React, { useEffect, useState } from "react";
import ChecklistSharpIcon from "@mui/icons-material/ChecklistSharp";
import { Avatar, Box, Typography, Stack } from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import Link from "next/link";
import { useRouter } from "next/router";

type User = {
    first_name: string;
    last_name: string;
    role: string;
    photo: string;
};

type MenuItem = {
    path: string;
    label: string;
};

const MENU_ITEMS: MenuItem[] = [
    { path: "/CapatazDashboard/containers/RevisionChecklist", label: "Revision de checklist pedientes" },
    { path: "/CapatazDashboard/containers/ChecklistChancado", label: "Check List Chancado" },
    { path: "/CapatazDashboard/containers/ChecklistDomo", label: "Check List Domo" },
    { path: "/CapatazDashboard/containers/ChecklistMolienda", label: "Check List Molienda" },
    { path: "/CapatazDashboard/containers/ChecklistFlotacionPlomo", label: "Check List Flotación Plomo" },
    { path: "/CapatazDashboard/containers/ChecklistFlotacionZinc", label: "Check List Flotación Zinc" },
    { path: "/CapatazDashboard/containers/ChecklistReactivos", label: "Check List Reactivos" },
    { path: "/CapatazDashboard/containers/ChecklistEspesadores", label: "Check List Espesadores" },
    { path: "/CapatazDashboard/containers/ChecklistFiltro", label: "Check List Filtros" },
    { path: "/CapatazDashboard/containers/ChecklistCarguio", label: "Check List Carguío" },
];

const CapatazSideNav = () => {
    const { collapsed } = useProSidebar();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Sidebar
            style={{
                height: "100vh",
                backgroundColor: "#fff",
                boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
                transition: "width 0.3s ease",
            }}
            breakPoint="md"
        >
            <Box sx={styles.avatarContainer}>
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        border: "3px solid #5569ff",
                        boxShadow: "0 4px 10px #5569ff",
                        mb: 2
                    }}
                    alt={user?.first_name}
                    src={user?.photo || "/assets/img/admin.png"}
                />
                {!collapsed && (
                    <Stack alignItems="center" spacing={0.5}>
                        <Typography variant="h6" sx={styles.firstName}>
                            {user?.first_name}
                        </Typography>
                        <Typography variant="h6" sx={styles.lastName}>
                            {user?.last_name}
                        </Typography>
                        <Typography variant="subtitle1" sx={styles.userRole}>
                            {user?.role || "Rol de área"}
                        </Typography>
                    </Stack>
                )}
            </Box>

            <Menu>
                {MENU_ITEMS.map(({ path, label }) => (
                    <Link key={path} href={path} passHref legacyBehavior>
                        <MenuItem
                            active={router.pathname === path}
                            icon={<ChecklistSharpIcon style={{ color: "#1A233A" }} />}
                            style={styles.menuItem}
                        >
                            <Typography variant="body1" sx={styles.menuText}>
                                {label}
                            </Typography>
                        </MenuItem>
                    </Link>
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
        pt: 8,
        pb: 4,
        px: 2,
        color: "#1A233A",
    },
    firstName: {
        fontWeight: "bold",
        color: "#1A233A",
        fontSize: "1.2rem",
        lineHeight: 1.2,
        textAlign: "center"
    },
    lastName: {
        fontWeight: "bold",
        color: "#1A233A",
        fontSize: "1.1rem",
        lineHeight: 1.2,
        textAlign: "center",
        mb: 1
    },
    userRole: {
        color: "#1A233A",
        fontSize: "1rem",
        fontWeight: 500,
        textAlign: "center",
        backgroundColor: "rgba(85, 105, 255, 0.3)",
        px: 1.5,
        py: 0.5,
        borderRadius: "12px",
        lineHeight: 1.3
    },
    menuItem: {
        color: "#1A233A",
        margin: "3px 0",
        padding: "12px 16px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        "&:hover": {
            backgroundColor: "rgba(85, 105, 255, 0.4)",
            transform: "translateX(4px)"
        },
        "&.active": {
            backgroundColor: "rgba(85, 105, 255, 0.6)",
            fontWeight: "bold"
        }
    },
    menuText: {
        fontWeight: "500",
        color: "#1A233A",
        fontSize: ".8rem",
        ml: 1
    }
};

export default CapatazSideNav;