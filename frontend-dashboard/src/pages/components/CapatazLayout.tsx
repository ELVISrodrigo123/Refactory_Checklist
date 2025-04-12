import React, { ReactNode } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/config/theme";
import { AppHeader } from "./AppHeader";
import { ProSidebarProvider } from "react-pro-sidebar";
import CapatazSideNav from "./CapatazSideNav";

interface LayoutProps {
    children: ReactNode;
    pendingUpdates?: boolean;
    notificationMessage?: string;
    showOnEntry?: boolean;
}

const CapatazLayout: React.FC<LayoutProps> = ({ children,
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
                        <CapatazSideNav/>
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

export default CapatazLayout;