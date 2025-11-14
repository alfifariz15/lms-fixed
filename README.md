# LMS (Learning Management System)

Sistem pembelajaran interaktif dengan video dan kuis menggunakan Laravel + Next.js.

## 🚀 Deployment ke Railway

### Backend (Laravel)
1. Buka [railway.app](https://railway.app)
2. Login dengan GitHub
3. Pilih "Deploy from GitHub repo"
4. Pilih repository `alfifariz15/lms-fixed`
5. Pilih "Deploy Backend"
6. Set environment variables:
   - `APP_KEY`: Generate dengan `php artisan key:generate --show`
   - `APP_URL`: URL Railway yang diberikan
   - Database akan otomatis ter-setup

### Frontend (Next.js)
1. Deploy sebagai service terpisah
2. Pilih folder `lms-nextjs`
3. Set environment variable:
   - `BACKEND_URL`: URL backend Railway

### Database
Railway akan otomatis menyediakan MySQL database.

## 🔧 Environment Variables yang Diperlukan

### Backend:
- `APP_KEY`: Application key Laravel
- `APP_URL`: URL aplikasi backend
- `DB_*`: Database credentials (otomatis dari Railway)

### Frontend:
- `BACKEND_URL`: URL backend untuk API calls

## 📁 Struktur Project
```
├── backend-lms/     # Laravel Backend
├── lms-nextjs/      # Next.js Frontend
├── railway.toml     # Railway configuration
└── README.md
```

## 🎯 Demo Accounts
- **Guru**: guru1 / password
- **Siswa**: asap / password
