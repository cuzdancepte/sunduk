import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DocumentIcon } from './icons/HomeIcons';

interface LessonCardProps {
  lessonNumber: number;
  title: string;
  backgroundColor: string;
  onPress?: () => void;
  fullWidth?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lessonNumber,
  title,
  backgroundColor,
  onPress,
  fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        fullWidth && styles.fullWidth,
        fullWidth && styles.fullWidthPadding,
        { backgroundColor },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.lessonNumber}>Lesson {lessonNumber}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <DocumentIcon size={48} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 101,
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthPadding: {
    paddingHorizontal: 32,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  lessonNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
    lineHeight: 38.4,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Nunito-Medium',
    lineHeight: 25.2,
    letterSpacing: 0.2,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LessonCard;
