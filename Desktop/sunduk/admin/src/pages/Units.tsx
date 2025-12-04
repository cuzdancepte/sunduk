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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const Units = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [levelId, setLevelId] = useState('');
  const [order, setOrder] = useState(0);
  const [slug, setSlug] = useState('');
  const [trTitle, setTrTitle] = useState('');
  const [trDescription, setTrDescription] = useState('');
  const [ruTitle, setRuTitle] = useState('');
  const [ruDescription, setRuDescription] = useState('');
  const queryClient = useQueryClient();

  const { data: levels } = useQuery({
    queryKey: ['levels'],
    queryFn: () => adminAPI.getLevels().then((res) => res.data),
  });

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => adminAPI.getLanguages().then((res) => res.data),
  });

  const { data: units, isLoading } = useQuery({
    queryKey: ['units'],
    queryFn: () => adminAPI.getUnits().then((res) => res.data),
  });

  const trLanguage = languages?.find((l: any) => l.code === 'tr');
  const ruLanguage = languages?.find((l: any) => l.code === 'ru');

  const createMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setLevelId('');
    setOrder(0);
    setSlug('');
    setTrTitle('');
    setTrDescription('');
    setRuTitle('');
    setRuDescription('');
  };

  const handleEdit = (unit: any) => {
    setEditingId(unit.id);
    setLevelId(unit.levelId);
    setOrder(unit.order);
    setSlug(unit.slug);
    const trTranslation = unit.translations?.find((t: any) => t.languageId === trLanguage?.id);
    const ruTranslation = unit.translations?.find((t: any) => t.languageId === ruLanguage?.id);
    setTrTitle(trTranslation?.title || '');
    setTrDescription(trTranslation?.description || '');
    setRuTitle(ruTranslation?.title || '');
    setRuDescription(ruTranslation?.description || '');
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu üniteyi silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    const translations = [];
    if (trLanguage && trTitle) {
      translations.push({
        languageId: trLanguage.id,
        title: trTitle,
        description: trDescription || undefined,
      });
    }
    if (ruLanguage && ruTitle) {
      translations.push({
        languageId: ruLanguage.id,
        title: ruTitle,
        description: ruDescription || undefined,
      });
    }

    const data = {
      levelId,
      order,
      slug,
      translations,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Üniteler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#6200ee', '&:hover': { bgcolor: '#5000d1' } }}
        >
          Yeni Ünite Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Seviye</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Sıra</TableCell>
              <TableCell>Başlık (TR)</TableCell>
              <TableCell>Başlık (RU)</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : units?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Henüz ünite eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              units?.map((unit: any) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.id}</TableCell>
                  <TableCell>{unit.level?.code || '-'}</TableCell>
                  <TableCell>{unit.slug}</TableCell>
                  <TableCell>{unit.order}</TableCell>
                  <TableCell>
                    {unit.translations?.find((t: any) => t.languageId === trLanguage?.id)?.title || '-'}
                  </TableCell>
                  <TableCell>
                    {unit.translations?.find((t: any) => t.languageId === ruLanguage?.id)?.title || '-'}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(unit)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(unit.id)} size="small">
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingId ? 'Üniteyi Düzenle' : 'Yeni Ünite Ekle'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Seviye</InputLabel>
            <Select value={levelId} onChange={(e) => setLevelId(e.target.value)} label="Seviye">
              {levels?.map((level: any) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Slug"
            fullWidth
            variant="outlined"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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
            sx={{ mb: 2 }}
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Türkçe Çeviri
          </Typography>
          <TextField
            margin="dense"
            label="Başlık (TR)"
            fullWidth
            variant="outlined"
            value={trTitle}
            onChange={(e) => setTrTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Açıklama (TR)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={trDescription}
            onChange={(e) => setTrDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Rusça Çeviri
          </Typography>
          <TextField
            margin="dense"
            label="Başlık (RU)"
            fullWidth
            variant="outlined"
            value={ruTitle}
            onChange={(e) => setRuTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Açıklama (RU)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={ruDescription}
            onChange={(e) => setRuDescription(e.target.value)}
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
          <Button onClick={handleSubmit} variant="contained" disabled={!levelId || !slug}>
            {editingId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Units;

