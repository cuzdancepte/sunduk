import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { contentAPI } from '../../services/api';
import { getCompletedDialogs } from '../../services/dialogProgress';
import { Dialog } from '../../types';
import { useTheme } from '../../theme/useTheme';
import { LoadingSpinner, EmptyState } from '../../components/ui';
import Mascot from '../../components/Mascot';

const { width, height } = Dimensions.get('window');
const DIALOG_SPACING = height / 3.5;

const DialogPathScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const prevCompletedIdsRef = useRef<string[]>([]);
  const hasLoadedOnceRef = useRef(false);
  const justCompletedIdRef = useRef<string | null>(null);
  const jumpAnimX = useRef(new Animated.Value(0)).current;
  const jumpAnimY = useRef(new Animated.Value(0)).current;

  const [allDialogs, setAllDialogs] = useState<Dialog[]>([]);
  const [visibleDialogs, setVisibleDialogs] = useState<Dialog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jumpFromIndex, setJumpFromIndex] = useState<number | null>(null);

  const loadDialogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentAPI.getDialogs();
      const completedIds = await getCompletedDialogs();

      // Tamamlanan dialoglara göre status belirle
      const dialogsWithStatus = data.map((dialog) => {
        const isCompleted = completedIds.includes(dialog.id);
        return { ...dialog, status: isCompleted ? 'completed' as const : undefined };
      });

      // İlk tamamlanmamış dialog = current, geri kalanı = locked
      let foundCurrent = false;
      const finalDialogs = dialogsWithStatus.map((d) => {
        if (d.status === 'completed') return d;
        if (!foundCurrent) {
          foundCurrent = true;
          return { ...d, status: 'current' as const };
        }
        return { ...d, status: 'locked' as const };
      }) as Dialog[];

      const justCompletedId = completedIds.find(id => !prevCompletedIdsRef.current.includes(id));

      if (hasLoadedOnceRef.current && completedIds.length > prevCompletedIdsRef.current.length && justCompletedId) {
        justCompletedIdRef.current = justCompletedId;
      }
      hasLoadedOnceRef.current = true;
      prevCompletedIdsRef.current = [...completedIds];

      setAllDialogs(finalDialogs);
      setVisibleDialogs(finalDialogs);
    } catch (err: any) {
      const message = err.response?.data?.error || t('dialog.loadError');
      setError(message);
      console.error('Load dialogs error:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadDialogs();
  }, [loadDialogs]);

  useFocusEffect(
    useCallback(() => {
      loadDialogs();
    }, [loadDialogs])
  );

  // Dialoglar yüklendiğinde scroll: zıplama varsa from+to görünsün, yoksa current
  useEffect(() => {
    if (visibleDialogs.length === 0 || !scrollViewRef.current) return;

    const justCompletedId = justCompletedIdRef.current;
    const fromIndex = justCompletedId ? visibleDialogs.findIndex(d => d.id === justCompletedId) : -1;
    const toIndex = visibleDialogs.findIndex(d => d.status === 'current');
    const willJump = justCompletedId != null && fromIndex >= 0 && toIndex >= 0;

    const dialogContentHeight = visibleDialogs.length * DIALOG_SPACING + 200;
    const getMascotY = (idx: number) =>
      dialogContentHeight - (idx * DIALOG_SPACING) - 120 - 80;

    setTimeout(() => {
      let scrollY: number;

      if (willJump) {
        const fromY = getMascotY(fromIndex);
        const toY = getMascotY(toIndex);
        const MASCOT_HEIGHT = 180;
        const PADDING = 60;
        const viewportHeight = height - 200;
        const minY = Math.min(fromY, toY) - PADDING;
        const maxY = Math.max(fromY, toY) + MASCOT_HEIGHT + PADDING;
        const rangeHeight = maxY - minY;
        if (rangeHeight <= viewportHeight) {
          scrollY = minY - (viewportHeight - rangeHeight) / 2;
        } else {
          scrollY = minY;
        }
      } else if (toIndex !== -1) {
        const dialogY = dialogContentHeight - (toIndex * DIALOG_SPACING) - 120;
        const viewportHeight = height * 0.55;
        scrollY = dialogY - viewportHeight;
      } else {
        scrollViewRef.current?.scrollToEnd({ animated: false });
        return;
      }

      scrollViewRef.current?.scrollTo({
        y: Math.max(0, scrollY),
        animated: false,
      });
    }, 200);
  }, [visibleDialogs]);

  // Zıplama animasyonu - dialog tamamlandığında tetiklenir, çaprazlama yol izler
  useEffect(() => {
    const justCompletedId = justCompletedIdRef.current;
    if (!justCompletedId || visibleDialogs.length === 0) return;

    const fromIndex = visibleDialogs.findIndex(d => d.id === justCompletedId);
    const toIndex = visibleDialogs.findIndex(d => d.status === 'current');
    if (fromIndex < 0 || toIndex < 0) {
      justCompletedIdRef.current = null;
      return;
    }

    justCompletedIdRef.current = null;
    setJumpFromIndex(fromIndex);
    jumpAnimX.setValue(0);
    jumpAnimY.setValue(0);

    const fromPos = getMascotPosition(fromIndex);
    const toPos = getMascotPosition(toIndex);
    const jumpHeight = 40;
    const segmentDuration = 350;

    // Çapraz/diyagonal ilerleme: her waypoint hem X hem Y'de ilerler
    const waypoints = [0, 0.25, 0.5, 0.75, 1].map(t => ({
      x: fromPos.x + (toPos.x - fromPos.x) * t,
      y: fromPos.y + (toPos.y - fromPos.y) * t,
    }));

    const sequences = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const targetX = waypoints[i + 1].x - fromPos.x;
      const targetY = waypoints[i + 1].y - fromPos.y;
      sequences.push(
        Animated.parallel([
          Animated.timing(jumpAnimX, {
            toValue: targetX,
            duration: segmentDuration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(jumpAnimY, {
              toValue: targetY - jumpHeight,
              duration: segmentDuration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(jumpAnimY, {
              toValue: targetY,
              duration: segmentDuration / 2,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    }

    Animated.sequence(sequences).start(() => {
      jumpAnimX.setValue(0);
      jumpAnimY.setValue(0);
      setJumpFromIndex(null);
    });
  }, [visibleDialogs]);

  const handleDialogPress = (dialog: Dialog) => {
    if (dialog.status === 'locked') {
      // Locked dialoglar tıklanamaz
      return;
    }

    navigation.navigate('App', {
      screen: 'DialogDetail',
      params: { dialogId: dialog.id },
    });
  };

  // Dialog pozisyonlarını dinamik hesapla (çaprazlama - zikzak)
  const contentHeight = visibleDialogs.length * DIALOG_SPACING + 200;

  const getDialogPosition = (index: number) => {
    // Çaprazlama yerleşim: Sol-Sağ-Sol-Sağ
    const isLeft = index % 2 === 0;
    const x = isLeft ? width * 0.25 : width * 0.75;
    
    // Alttan yukarıya doğru (en alttaki dialog ekranın altına yakın)
    const y = contentHeight - (index * DIALOG_SPACING) - 120;
    
    return { x, y };
  };

  const getMascotPosition = (dialogIndex: number) => {
    const pos = getDialogPosition(dialogIndex);
    const x = pos.x - 25;
    const y = pos.y - 80;
    return { x, y };
  };

  // Status'e göre renk ve icon
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'completed':
        return { 
          color: '#4CAF50', 
          icon: 'checkmark-circle',
          bgColor: '#E8F5E9',
          borderColor: '#4CAF50',
        };
      case 'current':
        return { 
          color: '#0d9cdd', 
          icon: 'play-circle',
          bgColor: '#E3F2FD',
          borderColor: '#0d9cdd',
        };
      case 'locked':
      default:
        return { 
          color: '#BDBDBD', 
          icon: 'lock-closed',
          bgColor: '#F5F5F5',
          borderColor: '#E0E0E0',
        };
    }
  };

  const currentDialog = visibleDialogs.find(d => d.status === 'current');
  const allCompleted = allDialogs.length > 0 && allDialogs.every(d => d.status === 'completed');

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Ionicons name="trail-sign-outline" size={18} color="#0d9cdd" />
            </View>
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.bold,
                  },
                ]}
              >
                {t('dialog.pathTitle')}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  {
                    color: theme.colors.text.secondary,
                    fontFamily: theme.typography.fontFamily.regular,
                  },
                ]}
              >
                {t('dialog.subtitle')}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner fullScreen text={t('common.loading')} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || allDialogs.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Ionicons name="trail-sign-outline" size={18} color="#0d9cdd" />
            </View>
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.bold,
                  },
                ]}
              >
                {t('dialog.pathTitle')}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  {
                    color: theme.colors.text.secondary,
                    fontFamily: theme.typography.fontFamily.regular,
                  },
                ]}
              >
                {t('dialog.subtitle')}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState
            title={t('dialog.emptyTitle')}
            description={error || t('dialog.emptyDescription')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ zIndex: 100 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Ionicons name="trail-sign-outline" size={18} color="#0d9cdd" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.bold,
                  },
                ]}
              >
                {t('dialog.pathTitle')}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  {
                    color: theme.colors.text.secondary,
                    fontFamily: theme.typography.fontFamily.regular,
                  },
                ]}
              >
                {t('dialog.subtitle')}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Scrollable Dialog Container */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: contentHeight }}>
        {/* Dialoglar */}
        {visibleDialogs.map((dialog, index) => {
          const position = getDialogPosition(index);
          const config = getStatusConfig(dialog.status);
          const translation = dialog.translations?.[0];

          return (
            <Pressable
              key={`touch-${dialog.id}`}
              style={({ pressed }) => [
                styles.dialogStop,
                {
                  left: position.x - 40,
                  top: position.y - 40,
                  transform: [{ scale: pressed && dialog.status !== 'locked' ? 0.92 : 1 }],
                },
              ]}
              onPress={() => handleDialogPress(dialog)}
              disabled={dialog.status === 'locked'}
            >
              <View style={[
                styles.dialogStopInner, 
                { 
                  backgroundColor: config.bgColor, 
                  borderColor: config.borderColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  elevation: 8,
                }
              ]}>
                <Ionicons name={config.icon} size={24} color={config.color} />
                <Text style={[styles.dialogNumber, { color: config.color }]}>
                  {index + 1}
                </Text>
              </View>

              {/* Dialog info tooltip */}
              {translation && (
                <View style={[styles.dialogTooltip, { backgroundColor: theme.colors.background.paper }]}>
                  <Text
                    style={[
                      styles.dialogTooltipText,
                      {
                        color: theme.colors.text.primary,
                        fontFamily: theme.typography.fontFamily.semiBold,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {translation.title}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Maskot - Current dialog yanında, pointerEvents: none ile tıklama engeli yok */}
        {(() => {
          const currentDialogIndex = visibleDialogs.findIndex(d => d.status === 'current');
          if (currentDialogIndex < 0) return null;
          
          const baseIndex = jumpFromIndex !== null ? jumpFromIndex : currentDialogIndex;
          const basePos = getMascotPosition(baseIndex);
          
          return (
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: basePos.x,
                top: basePos.y,
                zIndex: 50,
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 8,
                transform: [
                  { translateX: jumpAnimX },
                  { translateY: jumpAnimY },
                ],
              }}
            >
              <Mascot size={180} animated={true} usePNG={true} />
              <View style={[styles.speechBubble, { marginBottom: 8 }]}>
                <Text style={[styles.speechText, { fontFamily: theme.typography.fontFamily.semiBold }]}>
                  Harika gidiyorsun! 🎉
                </Text>
              </View>
            </Animated.View>
          );
        })()}

        {/* Completion Badge */}
        {allCompleted && (
          <View
            style={[
              styles.completionBadge,
              { top: visibleDialogs.length * DIALOG_SPACING + 100, left: width / 2 - 120 },
            ]}
          >
            <Ionicons name="trophy" size={64} color="#FFD700" />
            <Text
              style={[
                styles.completionTitle,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
            >
              {t('dialog.congratulations')}
            </Text>
            <Text
              style={[
                styles.completionText,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {t('dialog.allCompleted')}
            </Text>
          </View>
        )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E4C1', // Kum rengi
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0d9cdd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0d9cdd',
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  speechText: {
    fontSize: 13,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    flex: 1,
    position: 'relative',
  },
  dialogStop: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogStopInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dialogNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  dialogTooltip: {
    position: 'absolute',
    top: 65,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 150,
  },
  dialogTooltipText: {
    fontSize: 11,
    textAlign: 'center',
  },
  lockedStop: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  lockedStopNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
  },
  lockedLabel: {
    position: 'absolute',
    top: 65,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedLabelText: {
    fontSize: 12,
    color: '#666',
  },
  lockedLabelSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  loadingMoreContainer: {
    position: 'absolute',
    alignItems: 'center',
    gap: 12,
  },
  loadingMoreText: {
    fontSize: 14,
  },
  completionBadge: {
    position: 'absolute',
    alignItems: 'center',
    gap: 12,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  completionTitle: {
    fontSize: 24,
  },
  completionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DialogPathScreen;
