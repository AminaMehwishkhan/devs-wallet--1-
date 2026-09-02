import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Typography } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import SimCardIcon from '@mui/icons-material/SimCardOutlined';
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 240;

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/wallet', label: 'Wallet', icon: <AccountBalanceWalletIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <ReceiptLongIcon /> },
  { to: '/savings-goals', label: 'Savings Goals', icon: <SavingsIcon /> },
  { to: '/bills', label: 'Bill Payments', icon: <BoltIcon /> },
  { to: '/packages', label: 'Mobile Packages', icon: <SimCardIcon /> },
  { to: '/beneficiaries', label: 'Beneficiaries', icon: <PeopleIcon /> },
  { to: '/profile', label: 'Profile & Security', icon: <PersonIcon /> },
];

const adminLinks = [
  { to: '/admin/users', label: 'Manage Users', icon: <PeopleIcon /> },
  { to: '/admin/transactions', label: 'All Transactions', icon: <ReceiptLongIcon /> },
  { to: '/admin/reports', label: 'Reports', icon: <AdminPanelSettingsIcon /> },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid #eef0f4' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" color="primary" fontWeight={800}>Devs Wallet</Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {userLinks.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      {isAdmin && (
        <>
          <Divider sx={{ mx: 2 }} />
          <Box sx={{ px: 3, pt: 1.5, pb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>ADMIN PANEL</Typography>
          </Box>
          <List sx={{ px: 1 }}>
            {adminLinks.map((item) => (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                selected={location.pathname === item.to}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
}
