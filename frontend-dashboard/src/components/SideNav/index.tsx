// import type { MenuItemProps } from './types'
// import { MobileSideNav } from "./MobileSideNab"
// import { DesktopSideNav } from "./DesktopSideNav"
// import React from 'react'
// export { menuItems } from "./SideNavItemsData";

// export function SideNav({ items, isMobile }: MenuItemProps) {
//     if (isMobile) {
//         return <MobileSideNav items={items} />
//     }
//     return (
//         <DesktopSideNav items={items} />
//     )
// }


"use client"

import React from "react"
import { usePathname } from "next/navigation"
import {
    Box,
    Drawer,
    List,
    Typography,
    IconButton,
    Divider,
    useTheme,
    styled,
    AppBar,
    Toolbar,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Card,
} from "@mui/material"
import {
    Settings as SettingsIcon,
    Menu as MenuIcon,
    AccountCircle as AccountCircleIcon,
    Person as PersonIcon,
} from "@mui/icons-material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import ArchiveIcon from '@mui/icons-material/Archive';
import ViewListIcon from '@mui/icons-material/ViewList';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';


import { ModernMenuItem } from "./MenuItem"
import { Logo } from "../Logo"

const drawerWidth = 240

const LogoContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
})

const BottomActions = styled(Box)(({ theme }) => ({
    marginTop: "auto",
    borderTop: `1px solid ${theme.palette.divider}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
}))

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

// Mock notifications is id, title, description, date, and category(warning, error, info, success)
// You can use this data to display notifications in the sidebar or any other component
const mockNotifications = [
    {
        id: 1,
        title: "New File Uploaded",
        description: "A new Excel file has been uploaded successfully.",
        date: new Date().toISOString(),
        category: "success",
    },
    {
        id: 2,
        title: "User Created",
        description: "A new user has been created in the system.",
        date: new Date().toISOString(),
        category: "info",
    },
    {
        id: 3,
        title: "Error Occurred",
        description: "There was an error processing your request.",
        date: new Date().toISOString(),
        category: "error",
    },
    {
        id: 4,
        title: "Warning",
        description: "Please check your input values.",
        date: new Date().toISOString(),
        category: "warning",
    },
    {
        id: 5,
        title: "New Notification",
        description: "This is a new notification added to the list.",
        date: new Date().toISOString(),
        category: "info",
    },
    {
        id: 6,
        title: "Another Notification",
        description: "This is another notification for testing.",
        date: new Date().toISOString(),
        category: "info",
    },
]

interface ModernSidebarProps {
    window?: () => Window
}

export function ModernSidebar({ window }: ModernSidebarProps) {
    const theme = useTheme()
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null)
    const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setProfileMenuAnchor(event.currentTarget)
    }

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null)
    }

    const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget)
    }

    const handleNotificationMenuClose = () => {
        setNotificationAnchor(null)
    }

    const handleLogout = () => {
        // Implement logout functionality here
        console.log("Logging out...")
        handleProfileMenuClose()
    }

    const drawer = (
        <>
            <LogoContainer>
                <Logo />
                <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Minera
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        San Cristobal
                    </Typography>
                </Box>
            </LogoContainer>
            <Divider />
            <Box sx={{ p: 2 }}>
                <List sx={{ p: 0 }}>
                    {menuItems.map((item, index) => (
                        <ModernMenuItem
                            key={item.path + index}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={pathname === item.path}
                        />
                    ))}
                </List>
            </Box>

            <BottomActions sx={{
                py: 2,
                width: "100%",
                display: { xs: "none", md: "flex" }
            }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 36, height: 36 }}>JD</Avatar>
                    <Box sx={{ ml: 1.5 }}>
                        <Typography variant="body2" fontWeight="medium">
                            John Doe
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Admin
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mt: 2, alignItems: "center", justifyContent: "space-between", width: "90%" }}>
                    <IconButton size="medium" color="primary" onClick={handleNotificationMenuOpen}>
                        <Badge badgeContent={mockNotifications.length} color="error">
                            <NotificationsIcon fontSize="medium" />
                        </Badge>
                    </IconButton>
                    <IconButton size="medium" color="primary" onClick={handleProfileMenuOpen}>
                        <SettingsIcon fontSize="medium" />
                    </IconButton>
                    <IconButton size="medium" color="primary" onClick={handleLogout}>
                        <LogoutIcon fontSize="medium" />
                    </IconButton>
                </Box>
            </BottomActions>
        </>
    )

    const container = window !== undefined ? () => window().document.body : undefined

    return (
        <Box sx={{ display: "flex" }}>
            {/* AppBar for mobile view */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    display: { md: "none" },
                    p: 1,
                }}
                elevation={0}
            >
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Box component="img" sx={{ width: '5rem' }} src="/assets/img/logo.png" />
                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton size="large" color="inherit">
                        <Badge badgeContent={mockNotifications.length} color="error" onClick={handleNotificationMenuOpen}>
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton size="large" color="inherit" onClick={handleProfileMenuOpen}>
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleProfileMenuClose}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    overflowY: "auto",
                }}
            >
                {mockNotifications.map((notification) => (
                    <Box component={Card} key={notification.id} onClick={handleNotificationMenuClose} sx={{ display: "flex", flexDirection: "column", p: 2, m: 1, borderRadius: 2, cursor: "pointer", "&:hover": { boxShadow: 1 } }}>
                        <ListItemIcon>
                            <Chip
                                label={notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                                color={notification.category as "success" | "error" | "warning" | "info"}
                                size="small"
                                sx={{ mr: 1 }}
                                icon={
                                    notification.category === "success" ? <SettingsIcon fontSize="small" /> :
                                        notification.category === "info" ? <PersonIcon fontSize="small" /> :
                                            notification.category === "warning" ? <SupervisorAccountIcon fontSize="small" /> :
                                                notification.category === "error" ? <LogoutIcon fontSize="small" /> : undefined
                                }
                            />
                        </ListItemIcon>
                        <ListItemText primary={notification.title} secondary={notification.description} />
                        <Typography variant="caption" color="text.secondary">
                            {new Date(notification.date).toLocaleDateString()}
                        </Typography>
                    </Box>
                ))}
            </Menu>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                {/* Mobile drawer */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            borderRadius: 0,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            borderRight: `1px solid ${theme.palette.divider}`,
                            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    )
}
