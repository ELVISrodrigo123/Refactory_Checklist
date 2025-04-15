import React, { ReactNode } from "react";
import { Box } from "@mui/material";
// import AdminSideNav from "./AdminSideNav";
import { ModernSidebar } from "@/components/SideNav"
import AppProviders from "@/providers/ThemeProvider";
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import "../globals.css";

interface LayoutProps {
    children: ReactNode;
}

export const menuItems = [
    {
        path: "/employee/containers/ChecklistChancado",
        label: "CheckList Chancado",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistDomo",
        label: "CheckList Domo",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistMolienda",
        label: "CheckList Molienda",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistFlotacionPlomo",
        label: "CheckList Flotacion Plomo",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistFlotacionZinc",
        label: "CheckList Flotacion Zinc",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistReactivos",
        label: "CheckList Reactivos",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistEspesadores",
        label: "CheckList Espesadores",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistFiltro",
        label: "CheckList Filtro",
        icon: DomainVerificationIcon,
    },
    {
        path: "/employee/containers/ChecklistCarguio",
        label: "CheckList Carguio",
        icon: DomainVerificationIcon,
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