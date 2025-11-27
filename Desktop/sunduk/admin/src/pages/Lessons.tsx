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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const Lessons = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [unitId, setUnitId] = useState('');
  const [order, setOrder] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [trTitle, setTrTitle] = useState('');
  const [trContent, setTrContent] = useState('');
  const [ruTitle, setRuTitle] = useState('');
  const [ruContent, setRuContent] = useState('');
  const queryClient = useQueryClient();

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: () => adminAPI.getUnits().then((res) => res.data),
  });

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => adminAPI.getLanguages().then((res) => res.data),
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => adminAPI.getLessons().then((res) => res.data),
  });

  const trLanguage = languages?.find((l: any) => l.code === 'tr');
  const ruLanguage = languages?.find((l: any) => l.code === 'ru');

  const createMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setUnitId('');
    setOrder(0);
    setIsFree(false);
    setTrTitle('');
    setTrContent('');
    setRuTitle('');
    setRuContent('');
  };

  const handleEdit = (lesson: any) => {
    setEditingId(lesson.id);
    setUnitId(lesson.unitId);
    setOrder(lesson.order);
    setIsFree(lesson.isFree);
    const trTranslation = lesson.translations?.find((t: any) => t.languageId === trLanguage?.id);
    const ruTranslation = lesson.translations?.find((t: any) => t.languageId === ruLanguage?.id);
    setTrTitle(trTranslation?.title || '');
    setTrContent(trTranslation?.contentMd || '');
    setRuTitle(ruTranslation?.title || '');
    setRuContent(ruTranslation?.contentMd || '');
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu dersi silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    const translations = [];
    if (trLanguage && trTitle) {
      translations.push({
        languageId: trLanguage.id,
        title: trTitle,
        contentMd: trContent,
      });
    }
    if (ruLanguage && ruTitle) {
      translations.push({
        languageId: ruLanguage.id,
        title: ruTitle,
        contentMd: ruContent,
      });
    }

    const data = {
      unitId,
      order,
      isFree,
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
          Dersler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#6200ee', '&:hover': { bgcolor: '#5000d1' } }}
        >
          Yeni Ders Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ünite</TableCell>
              <TableCell>Başlık</TableCell>
              <TableCell>Sıra</TableCell>
              <TableCell>Ücretsiz</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : lessons?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Henüz ders eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              lessons?.map((lesson: any) => (
                <TableRow key={lesson.id}>
                  <TableCell>{lesson.id}</TableCell>
                  <TableCell>{lesson.unit?.slug || '-'}</TableCell>
                  <TableCell>
                    {lesson.translations?.[0]?.title || `Ders ${lesson.order}`}
                  </TableCell>
                  <TableCell>{lesson.order}</TableCell>
                  <TableCell>{lesson.isFree ? 'Evet' : 'Hayır'}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(lesson)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(lesson.id)} size="small">
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
        <DialogTitle>{editingId ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Ünite</InputLabel>
            <Select value={unitId} onChange={(e) => setUnitId(e.target.value)} label="Ünite">
              {units?.map((unit: any) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.slug}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <FormControlLabel
            control={<Checkbox checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />}
            label="Ücretsiz Ders"
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
            label="İçerik (TR) - Markdown"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={trContent}
            onChange={(e) => setTrContent(e.target.value)}
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
            label="İçerik (RU) - Markdown"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={ruContent}
            onChange={(e) => setRuContent(e.target.value)}
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
          <Button onClick={handleSubmit} variant="contained" disabled={!unitId}>
            {editingId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lessons;

