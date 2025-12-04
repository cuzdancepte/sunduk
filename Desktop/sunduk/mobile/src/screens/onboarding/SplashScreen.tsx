import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import Logo from '../../components/Logo';
import LoadingSpinner from '../../components/LoadingSpinner';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  useEffect(() => {
    // 2 saniye sonra Welcome ekranına yönlendir
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Bar - Status Bar (44px height) */}
        <View style={styles.topBar}>
          <Text style={[styles.timeText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
            9:41
          </Text>
          {/* Status bar icons would be handled by system */}
        </View>

        {/* Main Content - Centered */}
        <View style={styles.content}>
          {/* Logo - 200x200px, rounded 1000px (fully rounded) */}
          <View style={styles.logoContainer}>
            <Logo width={200} height={200} style={styles.logo} />
          </View>

          {/* App Name - 48px, bold, #212121, 20px gap from logo */}
          <Text style={[styles.appName, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}>
            Sunduk
          </Text>
        </View>

        {/* Loading Spinner - 60x60px, bottom center */}
        <View style={styles.loadingContainer}>
          <LoadingSpinner width={60} height={60} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    height: 44, // Figma exact: 44px
    paddingHorizontal: 23, // Figma: left-[23px]
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16, // Figma: text-[16px]
    fontWeight: '600', // Figma: font-semibold
    letterSpacing: 0.2, // Figma: tracking-[0.2px]
    lineHeight: 22.4, // Figma: leading-[1.4]
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20, // Figma: gap-[20px] between logo and text
  },
  logoContainer: {
    width: 200, // Figma exact: 200px
    height: 200, // Figma exact: 200px
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200, // Figma exact: 200px
    height: 200, // Figma exact: 200px
  },
  appName: {
    fontSize: 48, // Figma: text-[48px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 76.8, // Figma: leading-[1.6] (48 * 1.6)
    textAlign: 'center',
  },
  loadingContainer: {
    width: 60, // Figma exact: 60px
    height: 60, // Figma exact: 60px
    alignSelf: 'center',
    marginBottom: 40, // Approximate bottom spacing
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;

