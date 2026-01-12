import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemeContext } from '../../theme/useTheme';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import SplashMascot from '../../components/SplashMascot';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Welcome ekranındaki ile aynı hesaplama
  const safeAreaHeight = screenHeight - insets.top;
  const screenCenter = safeAreaHeight / 2;
  const contentCenter = screenCenter - 83.5; // Figma: calc(50% - 83.5px)
  const contentTop = contentCenter - 266.5; // translate-y-[-50%] = content height / 2
  const contentWidth = Math.min(382, screenWidth - 48); // 24px padding each side
  const textTop = contentTop + 388; // textContainer top position

  useEffect(() => {
    // 2 saniye sonra Welcome ekranına yönlendir
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Maskot - Welcome ekranındaki ile aynı konum */}
        <View style={[styles.logoContainer, { top: contentTop + 20, width: screenWidth }]}>
          <SplashMascot size={288} />
        </View>

        {/* App Name - Welcome ekranındaki ile aynı konum, boyut ve renk */}
        <View style={[styles.appNameContainer, { 
          top: textTop, 
          width: contentWidth, 
          left: (screenWidth - contentWidth) / 2 
        }]}>
          <Text style={[styles.appName, { color: isDarkMode ? '#FFFFFF' : '#000000', fontFamily: theme.typography.fontFamily.bold }]}>
            Sunduk
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 450, // Welcome ekranı ile aynı
    alignItems: 'center', // Center horizontally
    justifyContent: 'center',
  },
  appNameContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  appName: {
    fontSize: 48, // Welcome ekranı ile aynı
    fontWeight: '700', // Welcome ekranı ile aynı
    lineHeight: 76.8, // Welcome ekranı ile aynı
    letterSpacing: 0, // Welcome ekranı ile aynı
    textAlign: 'center',
    width: '100%', // Welcome ekranı ile aynı
    height: 77, // Welcome ekranı ile aynı
  },
});

export default SplashScreen;

