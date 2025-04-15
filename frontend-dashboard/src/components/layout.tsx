import React, { ReactNode } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/config/theme";
import SideNav from "./SideNav";
import { AppHeader } from "./AppHeader";
import { ProSidebarProvider } from "react-pro-sidebar";
import { Padding } from "@mui/icons-material";

interface LayoutProps {
    children: ReactNode;
    pendingUpdates?: boolean;
    notificationMessage?: string;
    showOnEntry?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children,
    pendingUpdates = false,
    notificationMessage,
    showOnEntry = false
}) => {
    return (
        <React.Fragment>
            <ProSidebarProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AppHeader
                        pendingUpdates={pendingUpdates}
                        notificationMessage={notificationMessage}
                        showOnEntry={showOnEntry}
                    />
                    <Box sx={styles.container}>
                        <SideNav />
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

export default Layout;