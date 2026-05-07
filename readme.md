# Infomedia Supplier

Hasil dari pengolahan wireframe menjadi mockup fungsional dengan arsitektur terpisah backend dan frontend.

## Struktur Proyek

Proyek ini terdiri dari dua folder utama:
- **backend**: Menggunakan Golang
- **frontend**: Menggunakan Next.js

## Prasyarat

Sebelum menjalankan aplikasi, pastikan sudah menginstal:
- Golang
- Node.js untuk menjalankan npm
- PostgreSQL
- Git Bash (opsional, namun disarankan)

Setelah siap semuanya, silahkan clone/unduh repository ini

## Konfigurasi

Sebelum menjalankan aplikasi, ubah password database di file `backend/config/database.go` dengan password PostgreSQL yang telah dipasang.

## Menjalankan Aplikasi

### Backend

Jalankan perintah berikut di folder `backend`:

```bash
go run main.go
```

Untuk API Documentation tersedia di http://localhost:8080/swagger/index.html

### Frontend

Jalankan perintah berikut di folder `frontend`:

```bash
npm i
npm run dev
```

Secara default akan berjalan di http://localhost:3000/