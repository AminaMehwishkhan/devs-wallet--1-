import { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, LinearProgress, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Alert, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import SavingsIcon from '@mui/icons-material/Savings';
import { getGoals, createGoal, deleteGoal, contributeToGoal } from '../services/savingsService';

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '' });
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const load = () => getGoals().then((res) => setGoals(res.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createGoal(form);
      setCreateOpen(false);
      setForm({ title: '', targetAmount: '', deadline: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await contributeToGoal(contributeGoal.id, amount);
      setContributeGoal(null);
      setAmount('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to contribute');
    }
  };

  const handleDelete = async (id) => {
    await deleteGoal(id);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Savings Goals</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>New Goal</Button>
      </Box>

      <Grid container spacing={2.5}>
        {goals.map((g) => {
          const pct = Math.min(100, (Number(g.saved_amount) / Number(g.target_amount)) * 100);
          return (
            <Grid item xs={12} sm={6} md={4} key={g.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <SavingsIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight={700}>{g.title}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => handleDelete(g.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                  <Chip size="small" label={g.status} color={g.status === 'completed' ? 'success' : 'default'} sx={{ mt: 1, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Rs {Number(g.saved_amount).toLocaleString()} of Rs {Number(g.target_amount).toLocaleString()}
                  </Typography>
                  <LinearProgress variant="determinate" value={pct} sx={{ my: 1.5, height: 8, borderRadius: 4 }} />
                  <Button
                    size="small" variant="outlined" fullWidth
                    disabled={g.status === 'completed'}
                    onClick={() => setContributeGoal(g)}
                  >
                    Add Money
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        {goals.length === 0 && (
          <Grid item xs={12}><Typography color="text.secondary">No savings goals yet. Create your first one!</Typography></Grid>
        )}
      </Grid>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleCreate}>
          <DialogTitle>New Savings Goal</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Goal title" margin="normal" required
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField fullWidth label="Target amount (Rs)" type="number" margin="normal" required
              value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
            <TextField fullWidth label="Deadline" type="date" margin="normal" InputLabelProps={{ shrink: true }}
              value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={!!contributeGoal} onClose={() => setContributeGoal(null)} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleContribute}>
          <DialogTitle>Add Money to "{contributeGoal?.title}"</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Amount (Rs)" type="number" margin="normal" required autoFocus
              value={amount} onChange={(e) => setAmount(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setContributeGoal(null)}>Cancel</Button>
            <Button type="submit" variant="contained">Contribute</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
