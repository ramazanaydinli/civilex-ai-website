# Civilex.AI Web - Full Stack Website

Bu proje, Civilex.AI şirketinin resmi web sitesidir. Modern ve responsive tasarım ile kullanıcı dostu bir deneyim sunar. Frontend ve backend entegrasyonu ile çalışan iletişim formu içerir.

## 🚀 Kurulum

### 1. Projeyi İndirin
```bash
git clone [repository-url]
cd PilatesAIWeb
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables Ayarlayın
```bash
# .env dosyası oluşturun (env.example'dan kopyalayın)
cp env.example .env

# .env dosyasında şu değişkenleri ayarlayın:
BREVO_API_KEY=your_brevo_api_key_here
EMAIL_USER=noreply@civilex.ai
MAILTO=hazar.aliyazicioglu@civilex.ai
PORT=3000
```

### 4. Sunucuyu Başlatın
```bash
# Development mode
npm run dev

# Production mode  
npm start
```

## 🎯 Özellikler

### Frontend
- ✅ Responsive tasarım (Desktop, Tablet, Mobile)
- ✅ Modern CSS ve JavaScript
- ✅ Smooth scrolling (Lenis)
- ✅ Interactive form elements
- ✅ Team member pagination
- ✅ Case studies carousel
- ✅ Video integration
- ✅ Mobile-friendly navigation

### Backend
- ✅ Node.js/Express.js server
- ✅ Brevo API email integration
- ✅ Contact form processing
- ✅ CORS support
- ✅ Environment variables
- ✅ API endpoints (/api/contact, /api/health)
- ✅ Türkçe email konuları

## 📱 Sayfalar

- **Home** (`docs/index.html`) - Ana sayfa
- **About** (`docs/about.html`) - Hakkımızda
- **Projects** (`docs/projects.html`) - Projeler
- **Contact** (`docs/contact.html`) - İletişim
- **Blog** (`docs/blog.html`) - Blog

## 🔧 Teknik Detaylar

### Frontend
- **Framework**: Vanilla HTML, CSS, JavaScript
- **CSS**: Custom CSS with CSS Variables
- **JavaScript Libraries**: Lenis (smooth scroll)
- **Icons**: Font Awesome
- **Fonts**: Space Grotesk (Google Fonts)
- **Images**: Optimized PNG/WebP formats

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Email Service**: Brevo API (Transactional Email)
- **Dependencies**: 
  - `axios` - HTTP requests
  - `cors` - Cross-origin resource sharing
  - `dotenv` - Environment variables
  - `express-validator` - Input validation
  - `validator` - Data validation utilities

## 📁 Proje Yapısı

```
PilatesAIWeb/
├── docs/                 # Frontend dosyaları
│   ├── css/             # Stylesheet dosyaları
│   ├── js/              # JavaScript dosyaları
│   ├── images/          # Görsel dosyalar
│   ├── icons/           # İkon dosyaları
│   ├── team/            # Takım üyesi fotoğrafları
│   └── *.html           # HTML sayfaları
├── server.js            # Backend Node.js server
├── package.json         # Node.js bağımlılıkları
├── .env                 # Environment variables (local)
├── env.example          # Environment variables template
└── README.md            # Proje dokümantasyonu
```

## 🎨 Tasarım Özellikleri

- **Color Scheme**: Mavi tonları (#3F73D8, #191A23)
- **Typography**: Space Grotesk font family
- **Layout**: CSS Grid ve Flexbox
- **Animations**: CSS transitions ve transforms
- **Responsive**: Mobile-first approach

## 🔧 API Endpoints

### Contact Form API
- **POST** `/api/contact` - İletişim formu gönderimi
  ```json
  {
    "contactType": "say-hi|join-team|about-projects",
    "fullName": "Kullanıcı Adı",
    "email": "user@example.com", 
    "message": "Mesaj içeriği"
  }
  ```

### Health Check
- **GET** `/api/health` - Server durumu kontrolü

## 📧 Email Sistemi

### Brevo API Integration
- **Service**: Brevo (Transactional Email)
- **API Version**: v3
- **Endpoint**: `https://api.brevo.com/v3/smtp/email`
- **Authentication**: API Key

### Email Konuları (Türkçe)
- `say-hi` → "Merhaba - [Kullanıcı Adı]"
- `join-team` → "Ekibe Katılmak - [Kullanıcı Adı]"
- `about-projects` → "Projelerimiz Hakkında - [Kullanıcı Adı]"

## 🔒 Güvenlik

- **CORS**: Cross-origin resource sharing
- **Input Validation**: Form verisi doğrulama
- **Email Validation**: RFC compliant email kontrolü
- **Environment Variables**: Hassas bilgilerin korunması

## 🚀 Production Deployment

### Environment Variables
```env
BREVO_API_KEY=your_production_brevo_api_key
EMAIL_USER=noreply@civilex.ai
MAILTO=team@civilex.ai
PORT=3000
NODE_ENV=production
```

### Brevo Setup
1. **Brevo hesabı** oluşturun
2. **API Key** alın
3. **Domain authentication** yapın (`civilex.ai`)
4. **Sender email** doğrulayın

## 🛠️ Development Notes

### Contact Form Flow
1. Frontend form → `/api/contact` endpoint
2. Input validation ve sanitization
3. Türkçe konu belirleme
4. Brevo API ile email gönderimi
5. Success/error response

### Troubleshooting
- **Gmail SMTP sorunları**: VPN gerekebilir (ISP kısıtlaması)
- **Brevo 404 hatası**: API endpoint kontrolü
- **Sender validation**: Domain authentication gerekli

## 📞 İletişim

**Email**: info@civilex.ai  
**Website**: https://civilex.ai  
**Team**: Civilex.AI Development Team 
