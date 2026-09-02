import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '0px' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
