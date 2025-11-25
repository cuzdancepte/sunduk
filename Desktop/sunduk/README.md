# Sunduk - Türkçe Öğrenme MVP

Rusça bilen kullanıcılara Türkçe öğreten mobil dil öğrenme uygulaması.

## Proje Yapısı

```
sunduk-app/
├── backend/          # Node.js + Express + TypeScript + Prisma
├── mobile/           # React Native Expo + TypeScript
└── README.md
```

## Teknoloji Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **JWT** authentication
- **Bcrypt** password hashing

### Mobile
- **React Native** (Expo Managed Workflow)
- **TypeScript**
- **React Navigation** (Native Stack)
- **Axios** HTTP client

## Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL (v14 veya üzeri)
- npm veya yarn
- Expo CLI (`npm install -g expo-cli`)

### Backend Kurulumu

1. Backend klasörüne gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. PostgreSQL veritabanını oluşturun ve `.env` dosyasını oluşturun:
```bash
# .env dosyası oluşturun
DATABASE_URL="postgresql://user:password@localhost:5432/sunduk_db?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3001
```

4. Prisma migration'ları çalıştırın:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. (Opsiyonel) Seed data eklemek için:
```bash
# İlk dil ve seviye verilerini manuel olarak eklemeniz gerekecek
# Prisma Studio ile: npx prisma studio
```

6. Backend sunucusunu başlatın:
```bash
npm run dev
```

Backend sunucusu `http://localhost:3001` adresinde çalışacaktır.

### Mobile Kurulumu

1. Mobile klasörüne gidin:
```bash
cd mobile
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. API base URL'ini kontrol edin:
`mobile/src/services/api.ts` dosyasında `API_BASE_URL` değerini kontrol edin (varsayılan: `http://localhost:3001/api`)

4. Uygulamayı başlatın:
```bash
npm start
```

5. Expo Go uygulaması ile QR kodu tarayın veya:
   - iOS için: `npm run ios`
   - Android için: `npm run android`

## API Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Content Endpoints (Auth gerekli)
- `GET /api/content/levels` - Tüm seviyeleri getir
- `GET /api/content/unit/:unitId` - Ünite detayı
- `GET /api/content/lesson/:lessonId` - Ders detayı
- `GET /api/content/progress` - Kullanıcı ilerlemesi
- `PUT /api/content/progress` - İlerleme güncelle

### Admin Endpoints (Admin auth gerekli)
- `GET /api/admin/languages` - Dilleri listele
- `POST /api/admin/languages` - Dil ekle
- `GET /api/admin/levels` - Seviyeleri listele
- `POST /api/admin/levels` - Seviye ekle
- `GET /api/admin/units` - Üniteleri listele
- `POST /api/admin/units` - Ünite ekle
- `GET /api/admin/lessons` - Dersleri listele
- `POST /api/admin/lessons` - Ders ekle
- `GET /api/admin/exercises` - Alıştırmaları listele
- `POST /api/admin/exercises` - Alıştırma ekle
- `GET /api/admin/users` - Kullanıcıları listele
- `GET /api/admin/subscriptions` - Abonelikleri listele
- `POST /api/admin/subscriptions` - Abonelik ekle

## Veritabanı Şeması

Proje aşağıdaki ana modelleri içerir:
- **Language**: Diller (tr, ru)
- **User**: Kullanıcılar (role: user/admin)
- **Level**: Seviyeler (A1, A2, vb.)
- **Unit**: Üniteler
- **UnitTranslation**: Ünite çevirileri
- **Lesson**: Dersler
- **LessonTranslation**: Ders çevirileri
- **Exercise**: Alıştırmalar
- **ExercisePrompt**: Alıştırma soruları (dil bazlı)
- **ExerciseOption**: Çoktan seçmeli şıklar
- **ExerciseOptionTranslation**: Şık çevirileri
- **UserProgress**: Kullanıcı ilerlemesi
- **UserSubscription**: Abonelikler

## Önemli Notlar

1. **Admin Kullanıcı Oluşturma**: İlk admin kullanıcıyı veritabanında manuel olarak `role: 'admin'` ile oluşturmanız gerekecek.

2. **Dil Verileri**: İlk dil verilerini (Türkçe ve Rusça) admin paneli üzerinden veya Prisma Studio ile eklemeniz gerekecek.

3. **Media Storage**: Şu anda medya dosyaları URL referansı olarak saklanıyor. Cloud storage entegrasyonu daha sonra eklenebilir.

4. **Token Storage**: Mobile uygulamada token storage için React Native'de `AsyncStorage` kullanılması önerilir (şu anda basit bir implementasyon var).

5. **CORS**: Backend'de CORS ayarları tüm origin'lere açık. Production'da sadece mobile app domain'ine izin verin.

## Geliştirme

### Backend Development
```bash
cd backend
npm run dev          # Development mode (watch)
npm run build        # Build for production
npm start            # Production mode
npx prisma studio    # Prisma Studio (DB GUI)
```

### Mobile Development
```bash
cd mobile
npm start            # Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
```

## Lisans

ISC

