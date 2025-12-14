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
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import IconButton from '@mui/material/IconButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const Exams = () => {
  const [open, setOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [unitId, setUnitId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [order, setOrder] = useState(0);
  const [passingScore, setPassingScore] = useState(70);
  const [trTitle, setTrTitle] = useState('');
  const [trDescription, setTrDescription] = useState('');
  const [ruTitle, setRuTitle] = useState('');
  const [ruDescription, setRuDescription] = useState('');
  
  // Question form states
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [questionOrder, setQuestionOrder] = useState(0);
  const [questionMediaUrl, setQuestionMediaUrl] = useState('');
  const [questionTrText, setQuestionTrText] = useState('');
  const [questionRuText, setQuestionRuText] = useState('');
  const [questionCorrectAnswer, setQuestionCorrectAnswer] = useState('');
  const [questionOptions, setQuestionOptions] = useState<Array<{ order: number; trText: string; ruText: string }>>([]);
  const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>(['']);
  const [matchingPairs, setMatchingPairs] = useState<Array<{ left: string; right: string }>>([{ left: '', right: '' }]);
  
  const queryClient = useQueryClient();

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: () => adminAPI.getUnits().then((res) => res.data),
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons', unitId],
    queryFn: () => adminAPI.getLessons(unitId).then((res) => res.data),
    enabled: !!unitId,
  });

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => adminAPI.getLanguages().then((res) => res.data),
  });

  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => adminAPI.getExams().then((res) => res.data),
  });

  const { data: selectedExam } = useQuery({
    queryKey: ['exam', selectedExamId],
    queryFn: () => adminAPI.getExam(selectedExamId!).then((res) => res.data),
    enabled: !!selectedExamId,
  });

  const trLanguage = languages?.find((l: any) => l.code === 'tr');
  const ruLanguage = languages?.find((l: any) => l.code === 'ru');

  const createMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateExam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createExamQuestion(selectedExamId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam', selectedExamId] });
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setQuestionDialogOpen(false);
      resetQuestionForm();
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateExamQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam', selectedExamId] });
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setQuestionDialogOpen(false);
      resetQuestionForm();
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteExamQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam', selectedExamId] });
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setUnitId('');
    setLessonId('');
    setOrder(0);
    setPassingScore(70);
    setTrTitle('');
    setTrDescription('');
    setRuTitle('');
    setRuDescription('');
  };

  const resetQuestionForm = () => {
    setEditingQuestionId(null);
    setQuestionType('multiple_choice');
    setQuestionOrder(0);
    setQuestionMediaUrl('');
    setQuestionTrText('');
    setQuestionRuText('');
    setQuestionCorrectAnswer('');
    setQuestionOptions([]);
    setFillBlankAnswers(['']);
    setMatchingPairs([{ left: '', right: '' }]);
  };

  const handleEdit = async (exam: any) => {
    try {
      setEditingId(exam.id);
      setUnitId(exam.unitId);
      setLessonId(exam.lessonId || '');
      setOrder(exam.order);
      setPassingScore(exam.passingScore || 70);
      
      const trTranslation = exam.translations?.find((t: any) => t.languageId === trLanguage?.id);
      const ruTranslation = exam.translations?.find((t: any) => t.languageId === ruLanguage?.id);
      
      setTrTitle(trTranslation?.title || '');
      setTrDescription(trTranslation?.description || '');
      setRuTitle(ruTranslation?.title || '');
      setRuDescription(ruTranslation?.description || '');
      
      setOpen(true);
    } catch (error) {
      console.error('Error loading exam:', error);
    }
  };

  const handleOpenQuestions = (examId: string) => {
    setSelectedExamId(examId);
    setQuestionsOpen(true);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestionId(question.id);
    setQuestionType(question.type);
    setQuestionOrder(question.order);
    setQuestionMediaUrl(question.mediaUrl || '');
    
    const trPrompt = question.prompts?.find((p: any) => p.languageId === trLanguage?.id);
    const ruPrompt = question.prompts?.find((p: any) => p.languageId === ruLanguage?.id);
    setQuestionTrText(trPrompt?.questionText || '');
    setQuestionRuText(ruPrompt?.questionText || '');
    
    if (question.type === 'multiple_choice' || question.type === 'listening') {
      const options = question.options?.map((opt: any) => ({
        order: opt.order,
        trText: opt.translations?.find((t: any) => t.languageId === trLanguage?.id)?.optionText || '',
        ruText: opt.translations?.find((t: any) => t.languageId === ruLanguage?.id)?.optionText || '',
      })) || [];
      setQuestionOptions(options);
      setQuestionCorrectAnswer(question.correctAnswer || '');
    } else if (question.type === 'fill_blank') {
      // Parse correctAnswer as JSON array or comma-separated
      try {
        const answers = JSON.parse(question.correctAnswer || '[]');
        setFillBlankAnswers(answers.length > 0 ? answers : ['']);
      } catch {
        const answers = question.correctAnswer?.split(',') || [''];
        setFillBlankAnswers(answers);
      }
    } else if (question.type === 'matching') {
      try {
        const pairs = JSON.parse(question.correctAnswer || '[]');
        setMatchingPairs(pairs.length > 0 ? pairs : [{ left: '', right: '' }]);
      } catch {
        setMatchingPairs([{ left: '', right: '' }]);
      }
    }
    
    setQuestionDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu sınavı silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      deleteQuestionMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    if (!unitId || !trTitle || !ruTitle) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const data = {
      unitId,
      lessonId: lessonId || undefined,
      order: Number(order),
      passingScore: Number(passingScore),
      translations: [
        {
          languageId: trLanguage?.id,
          title: trTitle,
          description: trDescription || null,
        },
        {
          languageId: ruLanguage?.id,
          title: ruTitle,
          description: ruDescription || null,
        },
      ],
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleQuestionSubmit = () => {
    if (!questionTrText || !questionRuText) {
      alert('Lütfen soru metinlerini doldurun.');
      return;
    }

    const prompts = [
      {
        languageId: trLanguage?.id,
        questionText: questionTrText,
      },
      {
        languageId: ruLanguage?.id,
        questionText: questionRuText,
      },
    ];

    let correctAnswer = '';
    let options: any[] = [];

    if (questionType === 'multiple_choice' || questionType === 'listening') {
      if (questionOptions.length === 0) {
        alert('Lütfen en az bir seçenek ekleyin.');
        return;
      }
      correctAnswer = questionCorrectAnswer;
      options = questionOptions.map((opt, idx) => ({
        order: idx,
        translations: [
          {
            languageId: trLanguage?.id,
            optionText: opt.trText,
          },
          {
            languageId: ruLanguage?.id,
            optionText: opt.ruText,
          },
        ],
      }));
    } else if (questionType === 'fill_blank') {
      const answers = fillBlankAnswers.filter(a => a.trim() !== '');
      if (answers.length === 0) {
        alert('Lütfen en az bir doğru cevap girin.');
        return;
      }
      correctAnswer = JSON.stringify(answers);
    } else if (questionType === 'matching') {
      const pairs = matchingPairs.filter(p => p.left.trim() !== '' && p.right.trim() !== '');
      if (pairs.length === 0) {
        alert('Lütfen en az bir eşleştirme çifti ekleyin.');
        return;
      }
      correctAnswer = JSON.stringify(pairs);
    }

    const data = {
      examId: selectedExamId,
      type: questionType,
      order: Number(questionOrder),
      correctAnswer: correctAnswer || undefined,
      mediaUrl: questionMediaUrl || undefined,
      prompts,
      options: options.length > 0 ? options : undefined,
    };

    if (editingQuestionId) {
      updateQuestionMutation.mutate({ id: editingQuestionId, data });
    } else {
      createQuestionMutation.mutate(data);
    }
  };

  const addOption = () => {
    setQuestionOptions([...questionOptions, { order: questionOptions.length, trText: '', ruText: '' }]);
  };

  const updateOption = (index: number, field: 'trText' | 'ruText', value: string) => {
    const newOptions = [...questionOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuestionOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setQuestionOptions(questionOptions.filter((_, i) => i !== index));
  };

  const addFillBlankAnswer = () => {
    setFillBlankAnswers([...fillBlankAnswers, '']);
  };

  const updateFillBlankAnswer = (index: number, value: string) => {
    const newAnswers = [...fillBlankAnswers];
    newAnswers[index] = value;
    setFillBlankAnswers(newAnswers);
  };

  const removeFillBlankAnswer = (index: number) => {
    setFillBlankAnswers(fillBlankAnswers.filter((_, i) => i !== index));
  };

  const addMatchingPair = () => {
    setMatchingPairs([...matchingPairs, { left: '', right: '' }]);
  };

  const updateMatchingPair = (index: number, field: 'left' | 'right', value: string) => {
    const newPairs = [...matchingPairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setMatchingPairs(newPairs);
  };

  const removeMatchingPair = (index: number) => {
    setMatchingPairs(matchingPairs.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await adminAPI.uploadImage(file);
        setQuestionMediaUrl(`http://localhost:3001${result.url}`);
      } catch (error: any) {
        alert(error.response?.data?.error || 'Dosya yüklenirken bir hata oluştu');
      }
    }
  };

  const getUnitName = (unitId: string) => {
    const unit = units?.find((u: any) => u.id === unitId);
    return unit?.translations?.[0]?.title || unitId;
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      multiple_choice: 'Çoktan Seçmeli',
      listening: 'Dinleme',
      fill_blank: 'Boşluk Doldurma',
      matching: 'Eşleştirme',
    };
    return labels[type] || type;
  };

  const renderQuestionForm = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Soru Bilgileri
        </Typography>
        <FormControl fullWidth required>
          <InputLabel id="question-type-label">Soru Tipi</InputLabel>
          <Select
            labelId="question-type-label"
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
              setQuestionOptions([]);
              setFillBlankAnswers(['']);
              setMatchingPairs([{ left: '', right: '' }]);
              setQuestionCorrectAnswer('');
            }}
            label="Soru Tipi"
          >
            <MenuItem value="multiple_choice">Çoktan Seçmeli</MenuItem>
            <MenuItem value="listening">Dinleme</MenuItem>
            <MenuItem value="fill_blank">Boşluk Doldurma</MenuItem>
            <MenuItem value="matching">Eşleştirme</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Sıra"
          type="number"
          value={questionOrder}
          onChange={(e) => setQuestionOrder(Number(e.target.value))}
          fullWidth
          required
        />

        <Box sx={{ mb: 2 }}>
          <TextField
            margin="dense"
            label="Media URL (opsiyonel)"
            fullWidth
            variant="outlined"
            value={questionMediaUrl}
            onChange={(e) => setQuestionMediaUrl(e.target.value)}
            sx={{ mb: 1 }}
            helperText={
              questionType === 'listening' 
                ? 'Dinleme sorusu için ses dosyası URL\'si' 
                : 'Görsel veya medya URL\'si'
            }
          />
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            veya
          </Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="question-image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="question-image-upload">
            <Button variant="outlined" component="span" size="small" fullWidth>
              Dosya Seç
            </Button>
          </label>
          {questionMediaUrl && (
            <Box sx={{ mt: 2 }}>
              <img
                src={questionMediaUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
              />
            </Box>
          )}
        </Box>

        <Typography variant="h6" sx={{ mt: 1 }}>
          Soru Metni
        </Typography>
        <TextField
          label="Soru Metni (TR)"
          value={questionTrText}
          onChange={(e) => setQuestionTrText(e.target.value)}
          fullWidth
          required
          multiline
          rows={3}
        />
        <TextField
          label="Soru Metni (RU)"
          value={questionRuText}
          onChange={(e) => setQuestionRuText(e.target.value)}
          fullWidth
          required
          multiline
          rows={3}
        />

        {(questionType === 'multiple_choice' || questionType === 'listening') && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Seçenekler</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addOption}
              sx={{ mb: 2 }}
            >
              Seçenek Ekle
            </Button>
            {questionOptions.map((opt, idx) => (
              <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">Seçenek {idx + 1}</Typography>
                  <IconButton size="small" onClick={() => removeOption(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  margin="dense"
                  label={`Seçenek Metni (TR)`}
                  fullWidth
                  value={opt.trText}
                  onChange={(e) => updateOption(idx, 'trText', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  margin="dense"
                  label={`Seçenek Metni (RU)`}
                  fullWidth
                  value={opt.ruText}
                  onChange={(e) => updateOption(idx, 'ruText', e.target.value)}
                />
              </Box>
            ))}
            {questionOptions.length > 0 && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Doğru Cevap</InputLabel>
                <Select
                  value={questionCorrectAnswer}
                  onChange={(e) => setQuestionCorrectAnswer(e.target.value)}
                  label="Doğru Cevap"
                >
                  {questionOptions.map((opt, idx) => (
                    <MenuItem key={idx} value={opt.trText}>
                      {opt.trText || `Seçenek ${idx + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}

        {questionType === 'fill_blank' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Doğru Cevaplar</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Soru metninde boşluklar için doğru cevapları girin. Her boşluk için bir cevap.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFillBlankAnswer}
              sx={{ mb: 2 }}
            >
              Cevap Ekle
            </Button>
            {fillBlankAnswers.map((answer, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label={`Cevap ${idx + 1}`}
                  value={answer}
                  onChange={(e) => updateFillBlankAnswer(idx, e.target.value)}
                  fullWidth
                />
                <IconButton onClick={() => removeFillBlankAnswer(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </>
        )}

        {questionType === 'matching' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Eşleştirme Çiftleri</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Sol ve sağ taraftaki eşleştirme çiftlerini girin.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addMatchingPair}
              sx={{ mb: 2 }}
            >
              Eşleştirme Ekle
            </Button>
            {matchingPairs.map((pair, idx) => (
              <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">Çift {idx + 1}</Typography>
                  <IconButton size="small" onClick={() => removeMatchingPair(idx)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  margin="dense"
                  label="Sol Taraf"
                  value={pair.left}
                  onChange={(e) => updateMatchingPair(idx, 'left', e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  margin="dense"
                  label="Sağ Taraf"
                  value={pair.right}
                  onChange={(e) => updateMatchingPair(idx, 'right', e.target.value)}
                  fullWidth
                />
              </Box>
            ))}
          </>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sınavlar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Yeni Sınav
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sıra</TableCell>
                <TableCell>Ünite</TableCell>
                <TableCell>Başlık (TR)</TableCell>
                <TableCell>Başlık (RU)</TableCell>
                <TableCell>Geçme Notu</TableCell>
                <TableCell>Soru Sayısı</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams && exams.length > 0 ? (
                exams.map((exam: any) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.order}</TableCell>
                    <TableCell>{getUnitName(exam.unitId)}</TableCell>
                    <TableCell>
                      {exam.translations?.find((t: any) => t.languageId === trLanguage?.id)?.title || '-'}
                    </TableCell>
                    <TableCell>
                      {exam.translations?.find((t: any) => t.languageId === ruLanguage?.id)?.title || '-'}
                    </TableCell>
                    <TableCell>{exam.passingScore || 70}%</TableCell>
                    <TableCell>{exam.questions?.length || 0}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenQuestions(exam.id)}
                        size="small"
                        title="Sorular"
                      >
                        <QuestionAnswerIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(exam)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(exam.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Henüz sınav tanımlanmamış.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Exam Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Sınav Düzenle' : 'Yeni Sınav'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Ünite</InputLabel>
              <Select
                value={unitId}
                onChange={(e) => {
                  setUnitId(e.target.value);
                  setLessonId(''); // Unit değişince lesson'ı sıfırla
                }}
                label="Ünite"
              >
                {units?.map((unit: any) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.translations?.[0]?.title || `Unit ${unit.order}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Ders (Opsiyonel)</InputLabel>
              <Select
                value={lessonId}
                onChange={(e) => {
                  const selectedLessonId = e.target.value;
                  setLessonId(selectedLessonId);
                  // Eğer ders seçildiyse, o dersin order'ından sonra bir değer hesapla
                  if (selectedLessonId && lessons) {
                    const selectedLesson = lessons.find((l: any) => l.id === selectedLessonId);
                    if (selectedLesson) {
                      // O dersin order'ından sonra (örneğin order + 0.5 mantığıyla, ama order Int olduğu için order + 1)
                      // Aynı lesson'a bağlı diğer exam'leri kontrol et
                      const sameLessonExams = exams?.filter((e: any) => e.lessonId === selectedLessonId && e.id !== editingId) || [];
                      const maxOrder = sameLessonExams.length > 0 
                        ? Math.max(...sameLessonExams.map((e: any) => e.order))
                        : selectedLesson.order;
                      setOrder(maxOrder + 1);
                    }
                  }
                }}
                label="Ders (Opsiyonel)"
                disabled={!unitId}
              >
                <MenuItem value="">
                  <em>Ders seçilmezse unit sonuna yerleşir</em>
                </MenuItem>
                {lessons?.map((lesson: any) => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.translations?.[0]?.title || `Ders ${lesson.order}`} (Sıra: {lesson.order})
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Ders seçilirse sınav o dersin sonrasına, seçilmezse unit'in sonuna yerleşir
              </Typography>
            </FormControl>

            <TextField
              label="Sıra"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              fullWidth
              required
              helperText={lessonId 
                ? "Aynı derse bağlı sınavlar arasındaki sıralama" 
                : "Unit sonundaki sınavlar arasındaki sıralama"}
            />

            <TextField
              label="Geçme Notu (%)"
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              fullWidth
              required
              inputProps={{ min: 0, max: 100 }}
              helperText="0-100 arası bir değer girin"
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Türkçe Çeviri
            </Typography>
            <TextField
              label="Başlık (TR)"
              value={trTitle}
              onChange={(e) => setTrTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Açıklama (TR)"
              value={trDescription}
              onChange={(e) => setTrDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Rusça Çeviri
            </Typography>
            <TextField
              label="Başlık (RU)"
              value={ruTitle}
              onChange={(e) => setRuTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Açıklama (RU)"
              value={ruDescription}
              onChange={(e) => setRuDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingId ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Questions Dialog */}
      <Dialog open={questionsOpen} onClose={() => setQuestionsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Sorular - {selectedExam?.translations?.find((t: any) => t.languageId === trLanguage?.id)?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
            <Typography variant="body1">
              Toplam {selectedExam?.questions?.length || 0} soru
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                resetQuestionForm();
                setQuestionDialogOpen(true);
              }}
            >
              Yeni Soru Ekle
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sıra</TableCell>
                  <TableCell>Tip</TableCell>
                  <TableCell>Soru Metni (TR)</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedExam?.questions?.length > 0 ? (
                  selectedExam.questions.map((question: any) => {
                    const trPrompt = question.prompts?.find((p: any) => p.languageId === trLanguage?.id);
                    return (
                      <TableRow key={question.id}>
                        <TableCell>{question.order}</TableCell>
                        <TableCell>
                          <Chip label={getQuestionTypeLabel(question.type)} size="small" />
                        </TableCell>
                        <TableCell>{trPrompt?.questionText || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditQuestion(question)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteQuestion(question.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Henüz soru eklenmemiş.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionsOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Question Form Dialog */}
      <Dialog 
        open={questionDialogOpen} 
        onClose={() => {
          setQuestionDialogOpen(false);
          resetQuestionForm();
        }} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '500px' }
        }}
      >
        <DialogTitle>
          {editingQuestionId ? 'Soru Düzenle' : 'Yeni Soru Ekle'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minHeight: '400px' }}>
          {renderQuestionForm()}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setQuestionDialogOpen(false);
              resetQuestionForm();
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleQuestionSubmit}
            variant="contained"
            disabled={!selectedExamId || createQuestionMutation.isPending || updateQuestionMutation.isPending}
          >
            {editingQuestionId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Exams;
