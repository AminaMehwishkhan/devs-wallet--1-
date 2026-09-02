import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  MenuItem, TextField, Pagination, Chip,
} from '@mui/material';
import { getAllTransactions } from '../../services/adminService';

const TYPES = ['deposit', 'withdraw', 'transfer_in', 'transfer_out', 'bill_payment', 'package_purchase'];

export default function AdminTransactions() {
  const [data, setData] = useState({ transactions: [], pagination: { totalPages: 1 } });
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllTransactions({ type, page, limit: 12 }).then((res) => setData(res.data));
  }, [type, page]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>All Transactions</Typography>
      <Card>
        <CardContent>
          <TextField
            select label="Filter by type" size="small" sx={{ mb: 2, width: 240 }}
            value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            <MenuItem value="">All</MenuItem>
            {TYPES.map((t) => <MenuItem key={t} value={t}>{t.replace('_', ' ')}</MenuItem>)}
          </TextField>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>{tx.full_name}<br /><Typography variant="caption" color="text.secondary">{tx.email}</Typography></TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</TableCell>
                  <TableCell align="right">Rs {Number(tx.amount).toLocaleString()}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell><Chip size="small" label={tx.status} color={tx.status === 'success' ? 'success' : 'warning'} /></TableCell>
                  <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
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
