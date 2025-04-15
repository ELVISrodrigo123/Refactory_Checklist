import React, { ReactNode } from "react";
import { Box } from "@mui/material";
// import AdminSideNav from "./AdminSideNav";
import { ModernSidebar } from "@/components/SideNav"
import AppProviders from "@/providers/ThemeProvider";
import ArchiveIcon from '@mui/icons-material/Archive';
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