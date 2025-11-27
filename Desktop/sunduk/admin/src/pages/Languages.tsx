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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const Languages = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [flagIcon, setFlagIcon] = useState('');
  const queryClient = useQueryClient();

  const { data: languages, isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: () => adminAPI.getLanguages().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: { code: string; name: string; flagIcon?: string }) =>
      adminAPI.createLanguage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { code: string; name: string; flagIcon?: string } }) =>
      adminAPI.updateLanguage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteLanguage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setFlagIcon('');
  };

  const handleEdit = (lang: any) => {
    setEditingId(lang.id);
    setCode(lang.code);
    setName(lang.name);
    setFlagIcon(lang.flag_icon || '');
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu dili silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { code, name, flagIcon } });
    } else {
      createMutation.mutate({ code, name, flagIcon });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Diller
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#6200ee', '&:hover': { bgcolor: '#5000d1' } }}
        >
          Yeni Dil Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Kod</TableCell>
              <TableCell>İsim</TableCell>
              <TableCell>Bayrak</TableCell>
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
            ) : languages?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Henüz dil eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              languages?.map((lang: any) => (
                <TableRow key={lang.id}>
                  <TableCell>{lang.id}</TableCell>
                  <TableCell>{lang.code}</TableCell>
                  <TableCell>{lang.name}</TableCell>
                  <TableCell>{lang.flag_icon || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(lang)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(lang.id)}
                      size="small"
                    >
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
        <DialogTitle>{editingId ? 'Dili Düzenle' : 'Yeni Dil Ekle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Kod (örn: tr, ru)"
            fullWidth
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="İsim"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Bayrak İkonu (opsiyonel)"
            fullWidth
            variant="outlined"
            value={flagIcon}
            onChange={(e) => setFlagIcon(e.target.value)}
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
          <Button onClick={handleSubmit} variant="contained" disabled={!code || !name}>
            {editingId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Languages;

