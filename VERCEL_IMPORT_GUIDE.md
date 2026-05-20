# Cara Import Environment Variables ke Vercel

## Metode 1: Import via File (RECOMMENDED)

1. **Buka Vercel Dashboard**
   - Pergi ke: https://vercel.com/altmiles-projects
   - Pilih project Anda

2. **Pergi ke Settings → Environment Variables**
   - Klik tab "Settings" di menu atas
   - Klik "Environment Variables" di sidebar kiri

3. **Import dari File**
   - Scroll ke bawah, cari tombol **"Import .env"** atau **"Bulk Import"**
   - Klik tombol tersebut
   - Copy semua isi dari file `vercel-env-import.txt` di project ini
   - Paste ke dalam text area yang muncul
   - Pilih environment: **Production, Preview, Development** (centang semua)
   - Klik **"Import"** atau **"Add"**

4. **Jangan lupa update SUPABASE_URL**
   - Setelah import, edit variable `SUPABASE_URL`
   - Ganti `https://your-project.supabase.co` dengan URL Supabase Anda yang sebenarnya

5. **Redeploy**
   - Pergi ke tab "Deployments"
   - Klik titik tiga (...) pada deployment terakhir
   - Pilih "Redeploy"

## Metode 2: Via Vercel CLI (Otomatis)

Jika Anda punya Vercel CLI installed:

```bash
# Install Vercel CLI (jika belum)
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables (untuk melihat yang ada)
vercel env pull

# Add environment variables satu per satu
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add GEMINI_API_KEY production
vercel env add WHATSAPP_API_URL production
vercel env add WHATSAPP_PHONE_NUMBER_ID production
vercel env add WHATSAPP_ACCESS_TOKEN production
vercel env add WHATSAPP_VERIFY_TOKEN production

# Atau import dari file
vercel env pull .env.production
```

## Metode 3: Copy-Paste Manual

Jika tidak ada opsi import, copy satu per satu dari `vercel-env-import.txt`:

1. Klik "Add New" di halaman Environment Variables
2. Masukkan Key dan Value
3. Centang semua environment (Production, Preview, Development)
4. Klik Save
5. Ulangi untuk semua variable

## Verifikasi

Setelah import dan redeploy, test dengan:

```bash
curl https://your-app.vercel.app/health
```

Harusnya return:
```json
{
  "status": "ok",
  "timestamp": "2026-05-20T..."
}
```

## Troubleshooting

### Error: "Invalid environment variable format"
- Pastikan tidak ada spasi sebelum/sesudah tanda `=`
- Pastikan value yang ada spasi dibungkus dengan quotes `"`

### Error: "SUPABASE_URL is not defined"
- Pastikan sudah update URL Supabase yang benar
- Pastikan sudah redeploy setelah menambah env vars

### Masih error setelah import
- Check logs di Vercel Dashboard → Deployments → View Function Logs
- Pastikan semua 7 variables sudah terisi
