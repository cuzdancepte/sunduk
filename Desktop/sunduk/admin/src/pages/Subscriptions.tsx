import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const Subscriptions = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminAPI.getUsers().then((res) => res.data),
  });

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => adminAPI.getSubscriptions().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setUserId('');
    setStartDate('');
    setEndDate('');
    setStatus('active');
  };

  const handleSubmit = () => {
    createMutation.mutate({
      userId,
      startDate,
      endDate,
      status,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Abonelikler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#6200ee', '&:hover': { bgcolor: '#5000d1' } }}
        >
          Yeni Abonelik Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Kullanıcı</TableCell>
              <TableCell>Başlangıç</TableCell>
              <TableCell>Bitiş</TableCell>
              <TableCell>Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : subscriptions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Henüz abonelik yok
                </TableCell>
              </TableRow>
            ) : (
              subscriptions?.map((sub: any) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.id}</TableCell>
                  <TableCell>{sub.user?.email || sub.userId}</TableCell>
                  <TableCell>{new Date(sub.startDate).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>{new Date(sub.endDate).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>{sub.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Abonelik Ekle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Kullanıcı</InputLabel>
            <Select value={userId} onChange={(e) => setUserId(e.target.value)} label="Kullanıcı">
              {users?.map((user: any) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email} ({user.username})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Başlangıç Tarihi"
            type="date"
            fullWidth
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Bitiş Tarihi"
            type="date"
            fullWidth
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Durum</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Durum">
              <MenuItem value="active">Aktif</MenuItem>
              <MenuItem value="expired">Süresi Dolmuş</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!userId || !startDate || !endDate}>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscriptions;

