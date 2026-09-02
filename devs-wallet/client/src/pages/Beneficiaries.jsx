import { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { getBeneficiaries, addBeneficiary, deleteBeneficiary } from '../services/beneficiaryService';

export default function Beneficiaries() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nickname: '', beneficiaryEmail: '', bankOrWallet: '' });
  const [error, setError] = useState('');

  const load = () => getBeneficiaries().then((res) => setList(res.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addBeneficiary(form);
      setOpen(false);
      setForm({ nickname: '', beneficiaryEmail: '', bankOrWallet: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add beneficiary');
    }
  };

  const handleDelete = async (id) => { await deleteBeneficiary(id); load(); };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Beneficiaries</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Beneficiary</Button>
      </Box>

      <Grid container spacing={2}>
        {list.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{b.nickname[0].toUpperCase()}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={700}>{b.nickname}</Typography>
                  <Typography variant="body2" color="text.secondary">{b.beneficiary_email}</Typography>
                  <Typography variant="caption" color="text.secondary">{b.bank_or_wallet}</Typography>
                </Box>
                <IconButton size="small" onClick={() => handleDelete(b.id)}><DeleteIcon fontSize="small" /></IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {list.length === 0 && <Grid item xs={12}><Typography color="text.secondary">No beneficiaries added yet.</Typography></Grid>}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleAdd}>
          <DialogTitle>Add Beneficiary</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Nickname" margin="normal" required
              value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            <TextField fullWidth label="Devs Wallet Email" type="email" margin="normal" required
              value={form.beneficiaryEmail} onChange={(e) => setForm({ ...form, beneficiaryEmail: e.target.value })} />
            <TextField fullWidth label="Bank / Wallet (optional)" margin="normal"
              value={form.bankOrWallet} onChange={(e) => setForm({ ...form, bankOrWallet: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
