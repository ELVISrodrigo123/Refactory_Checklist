import React, { ReactNode } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/config/theme";
import AdminSideNav from "./AdminSideNav";
import { AdminAppHeader } from "./AdminAppHeader";
import { ProSidebarProvider } from "react-pro-sidebar";

interface LayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <React.Fragment>
            <ProSidebarProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AdminAppHeader />
                    <Box sx={styles.container}>
                        <AdminSideNav />
                        <Box component={"main"} sx={styles.mainSection}>
                            {children}
                        </Box>
                    </Box>
                </ThemeProvider>
            </ProSidebarProvider>
        </React.Fragment>
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