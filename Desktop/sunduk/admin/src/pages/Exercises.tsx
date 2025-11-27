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

const Exercises = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState('');
  const [type, setType] = useState('multiple_choice');
  const [order, setOrder] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [trQuestion, setTrQuestion] = useState('');
  const [ruQuestion, setRuQuestion] = useState('');
  const [options, setOptions] = useState<Array<{ order: number; trText: string; ruText: string }>>([]);
  const queryClient = useQueryClient();

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => adminAPI.getLessons().then((res) => res.data),
  });

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => adminAPI.getLanguages().then((res) => res.data),
  });

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => adminAPI.getExercises().then((res) => res.data),
  });

  const trLanguage = languages?.find((l: any) => l.code === 'tr');
  const ruLanguage = languages?.find((l: any) => l.code === 'ru');

  const createMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateExercise(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setLessonId('');
    setType('multiple_choice');
    setOrder(0);
    setCorrectAnswer('');
    setMediaUrl('');
    setTrQuestion('');
    setRuQuestion('');
    setOptions([]);
  };

  const handleEdit = async (exercise: any) => {
    try {
      // Fetch full exercise data with all relations
      const fullExercise = await adminAPI.getExercise(exercise.id).then((res) => res.data);
      
      setEditingId(fullExercise.id);
      setLessonId(fullExercise.lessonId);
      setType(fullExercise.type);
      setOrder(fullExercise.order);
      // correctAnswer is now stored as Turkish option text, not Option ID
      setCorrectAnswer(fullExercise.correctAnswer || '');
      setMediaUrl(fullExercise.mediaUrl || '');
      
      const trPrompt = fullExercise.prompts?.find((p: any) => p.languageId === trLanguage?.id);
      const ruPrompt = fullExercise.prompts?.find((p: any) => p.languageId === ruLanguage?.id);
      setTrQuestion(trPrompt?.questionText || '');
      setRuQuestion(ruPrompt?.questionText || '');

      // Load options with all translations
      const exerciseOptions: Array<{ order: number; trText: string; ruText: string }> = [];
      if (fullExercise.options && fullExercise.options.length > 0) {
        fullExercise.options.forEach((opt: any) => {
          const trTranslation = opt.translations?.find((t: any) => t.languageId === trLanguage?.id);
          const ruTranslation = opt.translations?.find((t: any) => t.languageId === ruLanguage?.id);
          exerciseOptions.push({
            order: opt.order,
            trText: trTranslation?.optionText || '',
            ruText: ruTranslation?.optionText || '',
          });
        });
        // Sort by order
        exerciseOptions.sort((a, b) => a.order - b.order);
      }
      setOptions(exerciseOptions);
      setOpen(true);
    } catch (error) {
      console.error('Error loading exercise:', error);
      alert('Alıştırma yüklenirken bir hata oluştu');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu alıştırmayı silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const addOption = () => {
    setOptions([...options, { order: options.length, trText: '', ruText: '' }]);
  };

  const updateOption = (index: number, field: 'trText' | 'ruText', value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    const prompts = [];
    if (trLanguage && trQuestion) {
      prompts.push({
        languageId: trLanguage.id,
        questionText: trQuestion,
      });
    }
    if (ruLanguage && ruQuestion) {
      prompts.push({
        languageId: ruLanguage.id,
        questionText: ruQuestion,
      });
    }

    const exerciseOptions = options.map((opt, idx) => ({
      order: idx,
      translations: [
        trLanguage && opt.trText
          ? { languageId: trLanguage.id, optionText: opt.trText }
          : null,
        ruLanguage && opt.ruText
          ? { languageId: ruLanguage.id, optionText: opt.ruText }
          : null,
      ].filter(Boolean),
    }));

    const data = {
      lessonId,
      type,
      order,
      correctAnswer: correctAnswer || undefined,
      mediaUrl: mediaUrl || undefined,
      prompts,
      options: exerciseOptions,
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
          Alıştırmalar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#6200ee', '&:hover': { bgcolor: '#5000d1' } }}
        >
          Yeni Alıştırma Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ders</TableCell>
              <TableCell>Tip</TableCell>
              <TableCell>Sıra</TableCell>
              <TableCell>Soru</TableCell>
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
            ) : exercises?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Henüz alıştırma eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              exercises?.map((exercise: any) => (
                <TableRow key={exercise.id}>
                  <TableCell>{exercise.id}</TableCell>
                  <TableCell>{exercise.lesson?.translations?.[0]?.title || '-'}</TableCell>
                  <TableCell>{exercise.type}</TableCell>
                  <TableCell>{exercise.order}</TableCell>
                  <TableCell>
                    {exercise.prompts?.[0]?.questionText || '-'}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(exercise)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(exercise.id)} size="small">
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
        <DialogTitle>{editingId ? 'Alıştırmayı Düzenle' : 'Yeni Alıştırma Ekle'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Ders</InputLabel>
            <Select value={lessonId} onChange={(e) => setLessonId(e.target.value)} label="Ders">
              {lessons?.map((lesson: any) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.translations?.[0]?.title || `Ders ${lesson.order}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Tip</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)} label="Tip">
              <MenuItem value="multiple_choice">Çoktan Seçmeli</MenuItem>
              <MenuItem value="listening">Dinleme</MenuItem>
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
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Doğru Cevap</InputLabel>
            <Select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              label="Doğru Cevap"
              disabled={options.length === 0}
            >
              {options.map((opt, idx) => (
                <MenuItem key={idx} value={opt.trText}>
                  {opt.trText || `Şık ${idx + 1}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mb: 2 }}>
            <TextField
              margin="dense"
              label="Media URL (opsiyonel)"
              fullWidth
              variant="outlined"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              veya
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const result = await adminAPI.uploadImage(file);
                    setMediaUrl(`http://localhost:3001${result.url}`);
                  } catch (error: any) {
                    alert(error.response?.data?.error || 'Dosya yüklenirken bir hata oluştu');
                  }
                }
              }}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" size="small" fullWidth>
                Dosya Seç
              </Button>
            </label>
            {mediaUrl && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={mediaUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </Box>
            )}
          </Box>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Soru Metni
          </Typography>
          <TextField
            margin="dense"
            label="Soru (TR)"
            fullWidth
            variant="outlined"
            value={trQuestion}
            onChange={(e) => setTrQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Soru (RU)"
            fullWidth
            variant="outlined"
            value={ruQuestion}
            onChange={(e) => setRuQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Şıklar</Typography>
            <Button onClick={addOption} variant="outlined" size="small">
              Şık Ekle
            </Button>
          </Box>
          {options.map((opt, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Şık {idx + 1}
              </Typography>
              <TextField
                margin="dense"
                label={`Şık Metni (TR)`}
                fullWidth
                variant="outlined"
                value={opt.trText}
                onChange={(e) => updateOption(idx, 'trText', e.target.value)}
                sx={{ mb: 1 }}
              />
              <TextField
                margin="dense"
                label={`Şık Metni (RU)`}
                fullWidth
                variant="outlined"
                value={opt.ruText}
                onChange={(e) => updateOption(idx, 'ruText', e.target.value)}
              />
            </Box>
          ))}
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
          <Button onClick={handleSubmit} variant="contained" disabled={!lessonId || !trQuestion}>
            {editingId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Exercises;

