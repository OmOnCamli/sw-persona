# Software Persona — İş İlanı & Başvuru Yönetim Platformu

![Software Persona](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Netlify](https://img.shields.io/badge/Netlify-Deploy-00C7B7?style=for-the-badge&logo=netlify)

##  Proje Hakkında

Bu proje, **Software Persona** stajı kapsamında geliştirilen modern bir iş ilanı ve başvuru yönetim web uygulamasıdır. Kullanıcılar iş ilanlarını inceleyip CV yükleyerek başvurabilir; yöneticiler ise admin panel üzerinden tüm ilan ve başvuruları CRUD işlemleriyle yönetebilir.

##  Özellikler

### Kullanıcı Tarafı
-  İş ilanlarını listeleme ve arama/filtreleme
-  İlan detay sayfası (açıklama, gereksinimler, maaş)
-  CV yükleme (drag & drop destekli)
-  CV'den otomatik email/telefon çıkarımı (Regex)
-  Başvuru formu (ön yazı dahil)

### Admin Paneli
-  Dashboard (başvuru istatistikleri)
-  Tüm başvuruları listeleme ve filtreleme
-  Başvuru durumu güncelleme (Beklemede / Kabul / Red)
-  Başvuru silme
-  Yeni iş ilanı ekleme
-  İlan düzenleme ve silme

##  Teknolojiler

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|---------|----------------|
| React | 18 | UI framework |
| React Router | 6 | Client-side routing |
| Tailwind CSS | 3 | Utility-first styling |
| Vite | 5 | Build tool |
| Context API | — | State management |
| localStorage | — | Veri kalıcılığı |
| FileReader API | — | CV okuma |
| Netlify | — | Deployment |

##  Proje Yapısı

```
src/
├── components/         # Tekrar kullanılabilir componentler
│   ├── Navbar.jsx
│   ├── JobCard.jsx
│   ├── ApplicationTable.jsx
│   ├── StatusBadge.jsx
│   ├── CVUploader.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Route sayfaları
│   ├── LoginPage.jsx
│   ├── JobsPage.jsx
│   ├── JobDetailPage.jsx
│   ├── ApplyPage.jsx
│   ├── AdminPage.jsx
│   └── AdminApplicationDetail.jsx
├── interfaces/         # JSDoc typedef tanımları
│   ├── Job.js
│   └── Application.js
├── context/            # Global state yönetimi
│   ├── AuthContext.jsx
│   └── DataContext.jsx
├── data/               # Mock başlangıç verisi
│   └── mockJobs.js
└── utils/              # Yardımcı fonksiyonlar
    └── cvParser.js
```

##  Sayfalar

| URL | Sayfa | Erişim |
|-----|-------|--------|
| `/jobs` | İş ilanları listesi | Herkese açık |
| `/jobs/:id` | İlan detayı | Herkese açık |
| `/apply` | Başvuru formu | Herkese açık |
| `/login` | Yönetici girişi | Herkese açık |
| `/admin` | Admin panel | Yalnızca Admin |
| `/admin/application/:id` | Başvuru detayı | Yalnızca Admin |

##  Admin Girişi (Demo)

```
E-posta : admin@persona.com
Şifre   : admin123
```

##  Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

##  Deployment (Netlify)

1. GitHub'a push yap
2. [netlify.com](https://netlify.com) → "New site from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. `public/_redirects` dosyası SPA routing'i sağlar

##  Ekran Görüntüleri

Proje arayüzüne ait tüm detaylı ekran görüntülerini repository içindeki `screenshots` klasöründen inceleyebilirsiniz:

* [ Ekran Görüntüleri Klasörüne Git](./screenshots/)
  
##  Geliştirici

**Software Persona Stajyer Projesi**  
TNC Group - Web Geliştirme Eğitimi

---

*Bu proje eğitim amaçlı geliştirilmiştir. Tüm veriler localStorage'da tutulmakta olup backend gerektirmemektedir.*
