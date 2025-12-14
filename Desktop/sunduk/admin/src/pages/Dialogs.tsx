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
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import IconButton from '@mui/material/IconButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const Dialogs = () => {
  const [open, setOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [selectedDialogId, setSelectedDialogId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog form states
  const [unitId, setUnitId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [order, setOrder] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [trTitle, setTrTitle] = useState('');
  const [trDescription, setTrDescription] = useState('');
  const [trScenario, setTrScenario] = useState('');
  const [ruTitle, setRuTitle] = useState('');
  const [ruDescription, setRuDescription] = useState('');
  const [ruScenario, setRuScenario] = useState('');
  
  // Character states
  const [characters, setCharacters] = useState<Array<{
    id?: string;
    order: number;
    avatarUrl: string;
    trName: string;
    ruName: string;
  }>>([]);
  
  // Message states
  const [messages, setMessages] = useState<Array<{
    id?: string;
    characterId: string;
    order: number;
    audioUrl: string;
    trText: string;
    ruText: string;
  }>>([]);
  
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

  const { data: levels } = useQuery({
    queryKey: ['levels'],
    queryFn: () => adminAPI.getLevels().then((res) => res.data),
  });

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => adminAPI.getLanguages().then((res) => res.data),
  });

  const { data: dialogs, isLoading } = useQuery({
    queryKey: ['dialogs'],
    queryFn: () => adminAPI.getDialogs().then((res) => res.data),
  });

  const { data: selectedDialog } = useQuery({
    queryKey: ['dialog', selectedDialogId],
    queryFn: () => adminAPI.getDialog(selectedDialogId!).then((res) => res.data),
    enabled: !!selectedDialogId,
  });

  const trLanguage = languages?.find((l: any) => l.code === 'tr');
  const ruLanguage = languages?.find((l: any) => l.code === 'ru');

  const createMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createDialog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialogs'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateDialog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialogs'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteDialog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialogs'] });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createDialogQuestion(selectedDialogId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialog', selectedDialogId] });
      queryClient.invalidateQueries({ queryKey: ['dialogs'] });
      setQuestionDialogOpen(false);
      resetQuestionForm();
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateDialogQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialog', selectedDialogId] });
      queryClient.invalidateQueries({ queryKey: ['dialogs'] });
      setQuestionDialogOpen(false);
      resetQuestionForm();
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteDialogQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialog', selectedDialogId] });
      queryClient.invalidateQueries({ queryKey: ['dialogs'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setUnitId('');
    setLessonId('');
    setLevelId('');
    setOrder(0);
    setIsFree(false);
    setTrTitle('');
    setTrDescription('');
    setTrScenario('');
    setRuTitle('');
    setRuDescription('');
    setRuScenario('');
    setCharacters([]);
    setMessages([]);
    setActiveTab(0);
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

  const handleEdit = async (dialog: any) => {
    try {
      setEditingId(dialog.id);
      setUnitId(dialog.unitId || '');
      setLessonId(dialog.lessonId || '');
      setLevelId(dialog.levelId || '');
      setOrder(dialog.order);
      setIsFree(dialog.isFree || false);
      
      const trTranslation = dialog.translations?.find((t: any) => t.languageId === trLanguage?.id);
      const ruTranslation = dialog.translations?.find((t: any) => t.languageId === ruLanguage?.id);
      
      setTrTitle(trTranslation?.title || '');
      setTrDescription(trTranslation?.description || '');
      setTrScenario(trTranslation?.scenario || '');
      setRuTitle(ruTranslation?.title || '');
      setRuDescription(ruTranslation?.description || '');
      setRuScenario(ruTranslation?.scenario || '');
      
      // Load characters
      const loadedCharacters = dialog.characters?.map((char: any) => ({
        id: char.id,
        order: char.order,
        avatarUrl: char.avatarUrl || '',
        trName: char.translations?.find((t: any) => t.languageId === trLanguage?.id)?.name || '',
        ruName: char.translations?.find((t: any) => t.languageId === ruLanguage?.id)?.name || '',
      })) || [];
      setCharacters(loadedCharacters);
      
      // Load messages
      const loadedMessages = dialog.messages?.map((msg: any) => ({
        id: msg.id,
        characterId: msg.characterId,
        order: msg.order,
        audioUrl: msg.audioUrl || '',
        trText: msg.translations?.find((t: any) => t.languageId === trLanguage?.id)?.text || '',
        ruText: msg.translations?.find((t: any) => t.languageId === ruLanguage?.id)?.text || '',
      })) || [];
      setMessages(loadedMessages);
      
      setOpen(true);
    } catch (error) {
      console.error('Error loading dialog:', error);
    }
  };

  const handleOpenQuestions = (dialogId: string) => {
    setSelectedDialogId(dialogId);
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
    if (window.confirm('Bu dialogu silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      deleteQuestionMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    if (!trTitle || !ruTitle) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (characters.length === 0) {
      alert('Lütfen en az bir karakter ekleyin.');
      return;
    }

    if (messages.length === 0) {
      alert('Lütfen en az bir mesaj ekleyin.');
      return;
    }

    const data = {
      unitId: unitId || undefined,
      lessonId: lessonId || undefined,
      levelId: levelId || undefined,
      order: Number(order),
      isFree: isFree,
      translations: [
        {
          languageId: trLanguage?.id,
          title: trTitle,
          description: trDescription || null,
          scenario: trScenario || null,
        },
        {
          languageId: ruLanguage?.id,
          title: ruTitle,
          description: ruDescription || null,
          scenario: ruScenario || null,
        },
      ],
      characters: characters.map((char, idx) => ({
        id: char.id || `temp-${idx}`, // Include temp ID for mapping
        order: char.order || idx,
        avatarUrl: char.avatarUrl || undefined,
        translations: [
          {
            languageId: trLanguage?.id,
            name: char.trName,
          },
          {
            languageId: ruLanguage?.id,
            name: char.ruName,
          },
        ],
      })),
      messages: messages.map((msg, idx) => ({
        characterId: msg.characterId,
        order: msg.order || idx,
        audioUrl: msg.audioUrl || undefined,
        translations: [
          {
            languageId: trLanguage?.id,
            text: msg.trText,
          },
          {
            languageId: ruLanguage?.id,
            text: msg.ruText,
          },
        ],
      })),
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
      dialogId: selectedDialogId,
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

  // Character handlers
  const addCharacter = () => {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    setCharacters([...characters, { id: tempId, order: characters.length, avatarUrl: '', trName: '', ruName: '' }]);
  };

  const updateCharacter = (index: number, field: 'trName' | 'ruName' | 'avatarUrl', value: string) => {
    const newCharacters = [...characters];
    newCharacters[index] = { ...newCharacters[index], [field]: value };
    setCharacters(newCharacters);
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  // Message handlers
  const addMessage = () => {
    if (characters.length === 0) {
      alert('Önce karakter ekleyin.');
      return;
    }
    const firstCharId = characters[0].id || `temp-${characters[0].order}`;
    setMessages([...messages, { characterId: firstCharId, order: messages.length, audioUrl: '', trText: '', ruText: '' }]);
  };

  const updateMessage = (index: number, field: 'characterId' | 'trText' | 'ruText' | 'audioUrl', value: string) => {
    const newMessages = [...messages];
    newMessages[index] = { ...newMessages[index], [field]: value };
    setMessages(newMessages);
  };

  const removeMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  // Question handlers
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

  const handleCharacterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await adminAPI.uploadImage(file);
        updateCharacter(index, 'avatarUrl', `http://localhost:3001${result.url}`);
      } catch (error: any) {
        alert(error.response?.data?.error || 'Dosya yüklenirken bir hata oluştu');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dialoglar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Yeni Dialog
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
                <TableCell>Karakter Sayısı</TableCell>
                <TableCell>Mesaj Sayısı</TableCell>
                <TableCell>Soru Sayısı</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dialogs && dialogs.length > 0 ? (
                dialogs.map((dialog: any) => (
                  <TableRow key={dialog.id}>
                    <TableCell>{dialog.order}</TableCell>
                    <TableCell>{dialog.unitId ? getUnitName(dialog.unitId) : '-'}</TableCell>
                    <TableCell>
                      {dialog.translations?.find((t: any) => t.languageId === trLanguage?.id)?.title || '-'}
                    </TableCell>
                    <TableCell>
                      {dialog.translations?.find((t: any) => t.languageId === ruLanguage?.id)?.title || '-'}
                    </TableCell>
                    <TableCell>{dialog.characters?.length || 0}</TableCell>
                    <TableCell>{dialog.messages?.length || 0}</TableCell>
                    <TableCell>{dialog.questions?.length || 0}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenQuestions(dialog.id)}
                        size="small"
                        title="Sorular"
                      >
                        <QuestionAnswerIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(dialog)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(dialog.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Henüz dialog tanımlanmamış.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Dialog Düzenle' : 'Yeni Dialog'}</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Dialog Bilgileri" />
              <Tab label="Karakterler" />
              <Tab label="Mesajlar" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Ünite (Opsiyonel)</InputLabel>
                <Select
                  value={unitId}
                  onChange={(e) => {
                    setUnitId(e.target.value);
                    setLessonId('');
                  }}
                  label="Ünite (Opsiyonel)"
                >
                  <MenuItem value="">
                    <em>Seçiniz</em>
                  </MenuItem>
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
                  onChange={(e) => setLessonId(e.target.value)}
                  label="Ders (Opsiyonel)"
                  disabled={!unitId}
                >
                  <MenuItem value="">
                    <em>Seçiniz</em>
                  </MenuItem>
                  {lessons?.map((lesson: any) => (
                    <MenuItem key={lesson.id} value={lesson.id}>
                      {lesson.translations?.[0]?.title || `Ders ${lesson.order}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Seviye (Opsiyonel)</InputLabel>
                <Select
                  value={levelId}
                  onChange={(e) => setLevelId(e.target.value)}
                  label="Seviye (Opsiyonel)"
                >
                  <MenuItem value="">
                    <em>Seçiniz</em>
                  </MenuItem>
                  {levels?.map((level: any) => (
                    <MenuItem key={level.id} value={level.id}>
                      {level.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Sıra"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                fullWidth
                required
              />

              <FormControl fullWidth>
                <InputLabel>Ücretsiz mi?</InputLabel>
                <Select
                  value={isFree ? 'true' : 'false'}
                  onChange={(e) => setIsFree(e.target.value === 'true')}
                  label="Ücretsiz mi?"
                >
                  <MenuItem value="false">Hayır</MenuItem>
                  <MenuItem value="true">Evet</MenuItem>
                </Select>
              </FormControl>

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
              <TextField
                label="Senaryo (TR)"
                value={trScenario}
                onChange={(e) => setTrScenario(e.target.value)}
                fullWidth
                multiline
                rows={3}
                helperText="Dialog senaryosunun açıklaması"
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
              <TextField
                label="Senaryo (RU)"
                value={ruScenario}
                onChange={(e) => setRuScenario(e.target.value)}
                fullWidth
                multiline
                rows={3}
                helperText="Dialog senaryosunun açıklaması"
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addCharacter}
                sx={{ mb: 2 }}
              >
                Karakter Ekle
              </Button>
              {characters.map((char, idx) => (
                <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">Karakter {idx + 1}</Typography>
                    <IconButton size="small" onClick={() => removeCharacter(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <TextField
                    margin="dense"
                    label="Karakter Adı (TR)"
                    fullWidth
                    value={char.trName}
                    onChange={(e) => updateCharacter(idx, 'trName', e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    margin="dense"
                    label="Karakter Adı (RU)"
                    fullWidth
                    value={char.ruName}
                    onChange={(e) => updateCharacter(idx, 'ruName', e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ mb: 1 }}>
                    <TextField
                      margin="dense"
                      label="Avatar URL (opsiyonel)"
                      fullWidth
                      value={char.avatarUrl}
                      onChange={(e) => updateCharacter(idx, 'avatarUrl', e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={`character-image-upload-${idx}`}
                      type="file"
                      onChange={(e) => handleCharacterImageUpload(e, idx)}
                    />
                    <label htmlFor={`character-image-upload-${idx}`}>
                      <Button variant="outlined" component="span" size="small" fullWidth>
                        Dosya Seç
                      </Button>
                    </label>
                    {char.avatarUrl && (
                      <Box sx={{ mt: 2 }}>
                        <img
                          src={char.avatarUrl}
                          alt="Avatar Preview"
                          style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '8px' }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addMessage}
                sx={{ mb: 2 }}
                disabled={characters.length === 0}
              >
                Mesaj Ekle
              </Button>
              {characters.length === 0 && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  Önce karakter ekleyin.
                </Typography>
              )}
              {messages.map((msg, idx) => (
                <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">Mesaj {idx + 1}</Typography>
                    <IconButton size="small" onClick={() => removeMessage(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <FormControl fullWidth margin="dense" sx={{ mb: 1 }}>
                    <InputLabel>Karakter</InputLabel>
                    <Select
                      value={msg.characterId}
                      onChange={(e) => updateMessage(idx, 'characterId', e.target.value)}
                      label="Karakter"
                    >
                      {characters.map((char, charIdx) => {
                        const charId = char.id || `temp-${charIdx}`;
                        return (
                          <MenuItem key={charIdx} value={charId}>
                            {char.trName || `Karakter ${charIdx + 1}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    margin="dense"
                    label="Mesaj Metni (TR)"
                    fullWidth
                    value={msg.trText}
                    onChange={(e) => updateMessage(idx, 'trText', e.target.value)}
                    multiline
                    rows={2}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    margin="dense"
                    label="Mesaj Metni (RU)"
                    fullWidth
                    value={msg.ruText}
                    onChange={(e) => updateMessage(idx, 'ruText', e.target.value)}
                    multiline
                    rows={2}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    margin="dense"
                    label="Ses Dosyası URL (opsiyonel)"
                    fullWidth
                    value={msg.audioUrl}
                    onChange={(e) => updateMessage(idx, 'audioUrl', e.target.value)}
                  />
                </Box>
              ))}
            </Box>
          )}
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
          Sorular - {selectedDialog?.translations?.find((t: any) => t.languageId === trLanguage?.id)?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
            <Typography variant="body1">
              Toplam {selectedDialog?.questions?.length || 0} soru
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
                {selectedDialog?.questions?.length > 0 ? (
                  selectedDialog.questions.map((question: any) => {
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
                helperText={questionType === 'listening' ? 'Dinleme sorusu için ses dosyası URL\'si' : 'Görsel veya medya URL\'si'}
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
            disabled={!selectedDialogId || createQuestionMutation.isPending || updateQuestionMutation.isPending}
          >
            {editingQuestionId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dialogs;

