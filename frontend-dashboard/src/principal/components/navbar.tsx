"use client"
import { useState } from 'react';
import {
  AppBar, Box, CssBaseline, Divider, Drawer,
  IconButton, ListItem, Toolbar, Button, styled,
  alpha,
  useTheme,
  lighten
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

const drawerWidth = 240;
const navItems = [
  { name: 'Home', href: '/' },
  { name: '210-CHANCADO', href: '/management/area/210' },
  { name: '220-DOMO', href: '/management/area/220' },
  { name: '230-MOLIENDA', href: '/management/area/230' },
  { name: '240-FLOTACION PLOMO', href: '/management/area/240' },
  { name: '250-FLOTACION ZINC', href: '/management/area/250' },
  { name: '270-REACTIVOS', href: '/management/area/270' },
  { name: '310-ESPESADORES', href: '/management/area/310' },
  { name: '320-FILTROS', href: '/management/area/320' },
  { name: '330-CARGUIO', href: '/management/area/330' },
  { name: 'Sign In', href: '/auth', isButton: true },
];



export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(prev => !prev);
  const theme = useTheme();

  const renderNavItem = (item: typeof navItems[0], isMobile = false) => (
    <Link key={item.name} href={item.href} passHref legacyBehavior>
      {item.isButton ? (
        (mobileOpen ? <Box sx={{
          width: mobileOpen ? "100%" : "auto",
          marginTop: 10
        }}>
          <Divider
            sx={{
              my: 2
            }}
          />
          <Button
            variant="outlined"
            sx={{
              width: mobileOpen ? "100%" : "auto",
            }}
          >
            {item.name}
          </Button>
        </Box> : <Button
          variant="outlined"
          sx={{
          }}
        >
          {item.name}
        </Button>)
      ) : (
        <Button sx={{
        }}>
          {item.name}
        </Button>
      )
      }
    </Link >
  );

  const drawerContent = (
    <Box onClick={toggleDrawer} sx={{ textAlign: 'center', py: 2, px: 1 }}>
      <Logo />
      <Divider
        sx={{
          my: 2
        }}
      />
      {navItems.map(item => (
        <ListItem key={item.name} disablePadding sx={{
          justifyContent: 'center',
        }}>
          {renderNavItem(item, true)}
        </ListItem>
      ))}
    </Box>
  );

  return (
    <Box display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
              lighten(theme.colors.primary.main, 0.7),
              0.15
            )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
              theme.colors.alpha.black[100],
              0.2
            )}, 0px 5px 22px -4px ${alpha(
              theme.colors.alpha.black[100],
              0.1
            )}`,
      }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          py: 1
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ display: { sm: 'none' }, m: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{
            display: { xs: 'none', sm: 'flex' },
            flexGrow: 1,
            justifyContent: 'center',
            gap: 1,
            px: 2
          }}>
            {navItems.map(item => renderNavItem(item))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Toolbar />
    </Box>
  );
}