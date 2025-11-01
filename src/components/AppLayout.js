import React from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const AppLayout = ({ sidebarItems, children, onSidebarClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2ff 0%, #b3e5ff 50%, #e0f7ff 100%)',
      }}
    >
      <Sidebar items={sidebarItems} onItemClick={onSidebarClick} />
      <Box component="main" sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;
