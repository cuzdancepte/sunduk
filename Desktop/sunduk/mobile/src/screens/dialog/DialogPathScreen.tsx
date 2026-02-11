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
import TreasureChestIcon from '../../components/TreasureChestIcon';
import DialogPathBackground from '../../components/DialogPathBackground';

const { width, height } = Dimensions.get('window');
const CONTENT_SCALE = 1.2;
const layoutWidth = width / CONTENT_SCALE;
const layoutHeight = height / CONTENT_SCALE;
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
      if (!hasLoadedOnceRef.current) setLoading(true);
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
      const willJump = hasLoadedOnceRef.current && completedIds.length > prevCompletedIdsRef.current.length && justCompletedId;

      if (willJump) {
        justCompletedIdRef.current = justCompletedId;
        const fromIdx = finalDialogs.findIndex((d: Dialog) => d.id === justCompletedId);
        const toIdx = finalDialogs.findIndex((d: Dialog) => d.status === 'current');
        if (fromIdx >= 0 && toIdx >= 0) {
          setJumpFromIndex(fromIdx);
        }
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

    const fromPos = getDialogPosition(fromIndex);
    const toPos = getDialogPosition(toIndex);
    const jumpHeight = 40;
    const segmentDuration = 550;

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
      setJumpFromIndex(null);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          jumpAnimX.setValue(0);
          jumpAnimY.setValue(0);
        });
      });
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
    const x = isLeft ? layoutWidth * 0.25 : layoutWidth * 0.75;
    
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

  // Status'e göre hazine sandığı config
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'completed':
        return {
          variant: 'open' as const,
          color: '#B8860B',
          accentColor: '#8B6914',
          bgColor: '#F5E6C8',
          borderColor: '#B8860B',
          showPlayIcon: false,
        };
      case 'current':
        return {
          variant: 'open' as const,
          color: '#0d9cdd',
          accentColor: '#0a7bb5',
          bgColor: '#E3F2FD',
          borderColor: '#0d9cdd',
          showPlayIcon: true,
        };
      case 'locked':
      default:
        return {
          variant: 'closed' as const,
          color: '#9E9E9E',
          accentColor: '#757575',
          bgColor: '#F5F5F5',
          borderColor: '#E0E0E0',
          showPlayIcon: false,
        };
    }
  };

  const currentDialog = visibleDialogs.find(d => d.status === 'current');
  const allCompleted = allDialogs.length > 0 && allDialogs.every(d => d.status === 'completed');

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: theme.colors.background.paper }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.logoBox, { backgroundColor: theme.colors.background.paper, borderColor: theme.colors.secondary.main }]}>
              <Ionicons name="trail-sign-outline" size={18} color={theme.colors.secondary.main} />
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
        <View style={[styles.header, { backgroundColor: theme.colors.background.paper }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.logoBox, { backgroundColor: theme.colors.background.paper, borderColor: theme.colors.secondary.main }]}>
              <Ionicons name="trail-sign-outline" size={18} color={theme.colors.secondary.main} />
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
    <View style={[styles.container, { overflow: 'hidden' }]}>
      <View
        style={{
          width: layoutWidth,
          height: layoutHeight,
          transform: [
            { translateX: layoutWidth * (CONTENT_SCALE - 1) / 2 },
            { translateY: layoutHeight * (CONTENT_SCALE - 1) / 2 },
            { scale: CONTENT_SCALE },
          ],
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
      <SafeAreaView edges={['top']} style={{ zIndex: 100 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.background.paper }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.logoBox, { backgroundColor: theme.colors.background.paper, borderColor: theme.colors.secondary.main }]}>
              <Ionicons name="trail-sign-outline" size={18} color={theme.colors.secondary.main} />
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
        <View style={[styles.scrollContent, { height: contentHeight }]}>
        {/* Sonsuz düzlem arka planı: gökyüzü, çimen, bulutlar, göletler */}
        <DialogPathBackground
          width={layoutWidth}
          height={contentHeight}
          dialogCount={visibleDialogs.length}
          dialogSpacing={DIALOG_SPACING}
        />
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
                  left: position.x - 36,
                  top: position.y - 36,
                  transform: [{ scale: pressed && dialog.status !== 'locked' ? 0.92 : 1 }],
                },
              ]}
              onPress={() => handleDialogPress(dialog)}
              disabled={dialog.status === 'locked'}
            >
              <View style={styles.chestWrapper}>
                <TreasureChestIcon
                  variant={config.variant}
                  size={72}
                  color={config.color}
                  accentColor={config.accentColor}
                />
                {config.showPlayIcon && (
                  <View style={styles.playOverlay}>
                    <Ionicons name="play" size={18} color="#FFF" />
                  </View>
                )}
              </View>

              {/* Dialog adı - sadece başlık */}
              {translation && (
                <View style={[styles.dialogTooltip, { backgroundColor: 'transparent' }]}>
                  <Text
                    style={[
                      styles.dialogTooltipText,
                      {
                        color: theme.colors.text.primary,
                        fontFamily: theme.typography.fontFamily.bold,
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

        {/* Maskot - Current dialog yanında */}
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
            </Animated.View>
          );
        })()}

        {/* Completion Badge */}
        {allCompleted && (
          <View
            style={[
              styles.completionBadge,
              { top: visibleDialogs.length * DIALOG_SPACING + 100, left: layoutWidth / 2 - 120 },
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7CB342', // Çimen rengi (arka plan yüklenene kadar)
  },
  scrollContent: {
    position: 'relative',
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
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chestWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 156, 221, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  dialogTooltip: {
    position: 'absolute',
    top: 62,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
