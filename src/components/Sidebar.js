import React, { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  Collapse,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

// Default icons map by key
const defaultIcons = {
  dashboard: <DashboardIcon />,
  reports: <ListAltIcon />,
  submit: <AddLocationAltIcon />,
  admin: <AdminPanelSettingsIcon />,
};

const Sidebar = ({ items = [], variant = 'permanent', onItemClick }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Drawer
      variant={variant}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.3)',
        },
      }}
      open
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        {/* Hamburger Menu Toggle Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <IconButton
            onClick={() => setMenuOpen(!menuOpen)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 170, 255, 0.2)',
                boxShadow: '0 0 12px rgba(0, 170, 255, 0.5)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Collapse in={menuOpen}>
          <List>
            {items.map((item) => {
              const active = item.to ? location.pathname === item.to : item.active;
              const color = active ? '#00aaff' : 'inherit';
              const glow = active ? `0 0 10px rgba(0,170,255,0.7)` : 'none';
              const Icon = item.icon || defaultIcons[item.key];

              const commonProps = {
                onClick: () => onItemClick?.(item.key),
                sx: {
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  color,
                  boxShadow: glow,
                  '&:hover': { boxShadow: `0 0 12px rgba(0,170,255,0.5)` },
                },
              };

              return (
                <ListItem key={item.key} disablePadding>
                  {item.to ? (
                    <ListItemButton component={RouterLink} to={item.to} {...commonProps}>
                      <ListItemIcon sx={{ color }}>{Icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ) : (
                    <ListItemButton {...commonProps}>
                      <ListItemIcon sx={{ color }}>{Icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
