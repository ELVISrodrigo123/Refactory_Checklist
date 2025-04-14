import React, { ReactNode } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/config/theme";
// import AdminSideNav from "./AdminSideNav";
import { AdminAppHeader } from "./AdminAppHeader";
import {SideNav, menuItems} from "../../components/SideNav"

interface LayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminAppHeader />
            <Box sx={styles.container}>
                {/* <AdminSideNav /> */}
                <SideNav items={menuItems} isMobile={false} />
                <Box component={"main"} sx={styles.mainSection}>
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
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