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
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const Levels = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [order, setOrder] = useState(0);
  const queryClient = useQueryClient();

  const { data: levels, isLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: () => adminAPI.getLevels().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: { code: string; order: number }) => adminAPI.createLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { code: string; order: number } }) =>
      adminAPI.updateLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setCode('');
    setOrder(0);
  };

  const handleEdit = (level: any) => {
    setEditingId(level.id);
    setCode(level.code);
    setOrder(level.order);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu seviyeyi silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { code, order } });
    } else {
      createMutation.mutate({ code, order });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Seviyeler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#6200ee', '&:hover': { bgcolor: '#5000d1' } }}
        >
          Yeni Seviye Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Kod</TableCell>
              <TableCell>Sıra</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : levels?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Henüz seviye eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              levels?.map((level: any) => (
                <TableRow key={level.id}>
                  <TableCell>{level.id}</TableCell>
                  <TableCell>{level.code}</TableCell>
                  <TableCell>{level.order}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(level)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(level.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingId ? 'Seviyeyi Düzenle' : 'Yeni Seviye Ekle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Kod (örn: A1, A2)"
            fullWidth
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Sıra"
            type="number"
            fullWidth
            variant="outlined"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
          >
            İptal
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!code}>
            {editingId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Levels;
