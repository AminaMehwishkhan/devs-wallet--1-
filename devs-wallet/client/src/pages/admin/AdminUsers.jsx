import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  TextField, Chip, Button, Pagination,
} from '@mui/material';
import { getUsers, updateUserStatus } from '../../services/adminService';

export default function AdminUsers() {
  const [data, setData] = useState({ users: [], pagination: { totalPages: 1 } });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = () => getUsers({ search, page, limit: 10 }).then((res) => setData(res.data));
  useEffect(() => { load(); }, [search, page]);

  const toggleStatus = async (u) => {
    await updateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active');
    load();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>Manage Users</Typography>
      <Card>
        <CardContent>
          <TextField
            label="Search by name or email" size="small" sx={{ mb: 2, width: 320 }}
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Wallet Balance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{u.role}</TableCell>
                  <TableCell align="right">Rs {Number(u.balance || 0).toLocaleString()}</TableCell>
                  <TableCell><Chip size="small" label={u.status} color={u.status === 'active' ? 'success' : 'error'} /></TableCell>
                  <TableCell align="right">
                    <Button size="small" color={u.status === 'active' ? 'error' : 'success'} onClick={() => toggleStatus(u)}>
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination count={data.pagination.totalPages || 1} page={page} onChange={(e, p) => setPage(p)} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
