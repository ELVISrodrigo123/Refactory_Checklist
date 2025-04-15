import React, { ReactNode } from "react";
import { Box } from "@mui/material";
// import AdminSideNav from "./AdminSideNav";
import { ModernSidebar } from "@/components/SideNav"
import AppProviders from "@/providers/ThemeProvider";
import ArchiveIcon from '@mui/icons-material/Archive';
import ViewListIcon from '@mui/icons-material/ViewList';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import "../globals.css";

interface LayoutProps {
    children: ReactNode;
}

export const menuItems = [
    {
        path: "/admin/containers/CreateExelFile",
        label: "Subir archivo Excel",
        icon: ArchiveIcon,
    },
    {
        path: "/admin/containers/ListArt",
        label: "Lista de ART",
        icon: ViewListIcon,
    },
    {
        path: "/admin/containers/UserProfile",
        label: "Crear Usuario",
        icon: PersonAddAltIcon,
    },
    {
        path: "/admin/containers/ViewProfile",
        label: "Lista de Personal",
        icon: SupervisorAccountIcon,
    },
    {
        path: "/admin/containers/CreateForm",
        label: "Creacion de formularios",
        icon: ViewListIcon,
    },
    {
        path: "/admin/containers/TableFormulario",
        label: "Formularios",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistReactivos",
        label: "Form Domo",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistEspesadores",
        label: "Form Molienda",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistFiltro",
        label: "Form Flotacion Plomo",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistFlotacionZinc",
        label: "Form Flotación Zinc",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistReactivos",
        label: "Form Reactivos",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistEspesadores",
        label: "Form Espesadores",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistFiltro",
        label: "Form Filtros",
        icon: EditNoteIcon,
    },
    {
        path: "/OperatorDashboard/containers/ChecklistCarguio",
        label: "Form Carguío",
        icon: EditNoteIcon,
    },
];

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <AppProviders>
                    {/* <AdminAppHeader /> */}
                    <Box sx={styles.container}>
                        {/* <AdminSideNav /> */}
                        {/* <SideNav items={menuItems} isMobile={false} /> */}
                        <ModernSidebar menuItems={menuItems} window={undefined} />
                        <Box component={"main"} sx={styles.mainSection}>
                            {children}
                        </Box>
                    </Box>
                </AppProviders>
            </body>
        </html>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "calc(100% - 64px)",
    },
    mainSection: {
        width: "100%",
        height: "100%",
        overflow: "auto",
    },
};

export default AdminLayout;