# Setup Database Supabase

## ⚠️ PENTING: Tabel Belum Dibuat!

Anda perlu menjalankan SQL untuk membuat tabel di Supabase.

## 📝 Langkah Setup Database:

### 1. Buka Supabase SQL Editor
1. Pergi ke: https://supabase.com/dashboard/project/tgbufizofchovmjkcnbc
2. Klik **"SQL Editor"** di sidebar kiri
3. Klik **"New Query"**

### 2. Copy SQL dari File
Buka file `db/supabase_setup.sql` di project ini dan copy SEMUA isinya.

### 3. Paste dan Run
1. Paste SQL ke SQL Editor
2. Klik **"Run"** atau tekan `Ctrl+Enter`
3. Tunggu sampai selesai (harusnya muncul "Success")

### 4. Verifikasi
Setelah run SQL, cek di **Table Editor**:
- ✅ Tabel `clients` harus ada (dengan 1 sample data)
- ✅ Tabel `products` harus ada (dengan 3 sample products)
- ✅ Tabel `conversations` harus ada (kosong)

## 🔍 Isi SQL yang Akan Dijalankan:

SQL akan membuat:
1. **3 tabel:** clients, products, conversations
2. **Indexes** untuk performa query
3. **Sample data:**
   - 1 client (Demo Client)
   - 3 products (Website Development, Social Media Management, SEO)

## ✅ Setelah Setup

Jalankan test lagi:
```bash
node test-db.js
```

Harusnya semua ✅ dan ada data sample!

## 🚨 Troubleshooting

### Error: "permission denied"
- Pastikan menggunakan service_role key yang benar
- Key sudah diupdate di `.env`

### Error: "relation already exists"
- Tabel sudah ada, skip error ini
- Atau drop table dulu: `DROP TABLE IF EXISTS clients CASCADE;`

### Tidak ada sample data
- Run bagian INSERT manual di SQL Editor
