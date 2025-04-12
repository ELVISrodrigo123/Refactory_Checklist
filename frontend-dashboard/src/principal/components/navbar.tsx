import { useState } from 'react';
import { 
  AppBar, Box, CssBaseline, Divider, Drawer, 
  IconButton, ListItem, Toolbar, Button 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

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

const primaryColor = '#5569ff';
const whiteColor = '#fff';
const drawerTextColor = '#1a237e';

export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(prev => !prev);

  const renderNavItem = (item: typeof navItems[0], isMobile = false) => (
    <Link key={item.name} href={item.href} passHref legacyBehavior>
      {item.isButton ? (
        <Button
          variant="contained"
          sx={{
            backgroundColor: isMobile ? primaryColor : whiteColor,
            color: isMobile ? whiteColor : primaryColor,
            borderRadius: 4,
            fontSize: item.isButton ? '0.7rem' : '1rem',
            mx: 0.5,
            my: isMobile ? 1 : 0,
            width: isMobile ? '80%' : 'auto'
          }}
        >
          {item.name}
        </Button>
      ) : (
        <Button sx={{ 
          color: isMobile ? drawerTextColor : whiteColor, 
          fontSize: '1rem', 
          mx: 0.5,
          fontWeight: isMobile ? 600 : 'normal'
        }}>
          {item.name}
        </Button>
      )}
    </Link>
  );

  const drawerContent = (
    <Box onClick={toggleDrawer} sx={{ textAlign: 'center', py: 2 }}>
      <Divider />
      {navItems.map(item => (
        <ListItem key={item.name} disablePadding sx={{ 
          justifyContent: 'center',
          my: 1
        }}>
          {renderNavItem(item, true)}
        </ListItem>
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: primaryColor,
          color: whiteColor,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ display: { sm: 'none' }, mr: 2 }}
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
              backgroundColor: '#f5f5f5'
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