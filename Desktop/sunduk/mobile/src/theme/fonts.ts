// Font yükleme için yardımcı fonksiyon
// Not: Font dosyaları assets/fonts/ klasörüne eklenecek
// Şimdilik sistem fontları kullanılacak, font dosyaları eklendikten sonra aktif edilecek

// import * as Font from 'expo-font';

// export const loadFonts = async () => {
//   await Font.loadAsync({
//     'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
//     'Nunito-Medium': require('../../assets/fonts/Nunito-Medium.ttf'),
//     'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
//     'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
//   });
// };

// Font yükleme fonksiyonu - font dosyaları eklendikten sonra aktif edilecek
export const loadFonts = async () => {
  // Font dosyaları eklendikten sonra bu fonksiyon aktif edilecek
  return Promise.resolve();
};

