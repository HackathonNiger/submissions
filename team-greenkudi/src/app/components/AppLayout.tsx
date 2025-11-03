'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import RecyclingIcon from '@mui/icons-material/Recycling';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { navItems } from '@/navigation';
import type { NavItem } from '@/navigation';

const iconMap: Record<string, React.ReactElement> = {
  Home: <HomeIcon />,
  Map: <MapIcon />,
  Recycling: <RecyclingIcon />,
  CardGiftcard: <CardGiftcardIcon />,
  Dashboard: <DashboardIcon />,
};

const drawerWidth = 280;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const currentNavIndex = navItems.findIndex(item => item.href === pathname);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {!isMobile ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ p: 3, pb: 2 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                  }}
                >
                  G
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    <Box component="span" sx={{ color: 'primary.main' }}>Green</Box>Kudi
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Waste to Energy
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Box>

          <List sx={{ px: 2, flex: 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                  sx={{
                    borderRadius: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {iconMap[item.muiIcon]}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    secondary={pathname !== item.href ? item.description : undefined}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2 }}>
            <Paper
              sx={{
                p: 2,
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1px solid',
                borderColor: 'primary.light',
              }}
            >
              <Typography variant="subtitle2" color="primary.main" fontWeight={600} gutterBottom>
                Make an Impact
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                Report waste hotspots and earn rewards for a cleaner city.
              </Typography>
              <Link href="/map" style={{ textDecoration: 'none' }}>
                <Box
                  component="button"
                  sx={{
                    width: '100%',
                    py: 1,
                    px: 2,
                    bgcolor: 'primary.main',
                    color: 'white',
                    border: 'none',
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Start Reporting
                </Box>
              </Link>
            </Paper>
          </Box>
        </Drawer>
      ) : (
        <AppBar 
          position="fixed" 
          color="inherit" 
          elevation={0}
          sx={{ 
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Toolbar>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                G
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  <Box component="span" sx={{ color: 'primary.main' }}>Green</Box>Kudi
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Waste to Energy
                </Typography>
              </Box>
            </Link>
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: isMobile ? 8 : 0,
          pb: isMobile ? 9 : 0,
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
          {children}
        </Box>
      </Box>

      {isMobile && (
        <>
          <Paper 
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0,
              zIndex: 1000,
            }} 
            elevation={3}
          >
            <BottomNavigation
              value={currentNavIndex}
              showLabels
            >
              {navItems.map((item) => (
                <BottomNavigationAction
                  key={item.href}
                  label={item.shortLabel || item.label}
                  icon={iconMap[item.muiIcon]}
                  component={Link}
                  href={item.href}
                />
              ))}
            </BottomNavigation>
          </Paper>

          {pathname === '/map' && (
            <Fab
              color="primary"
              aria-label="report waste"
              sx={{
                position: 'fixed',
                bottom: 80,
                right: 16,
                zIndex: 1001,
              }}
            >
              <AddLocationIcon />
            </Fab>
          )}
        </>
      )}
    </Box>
  );
}
