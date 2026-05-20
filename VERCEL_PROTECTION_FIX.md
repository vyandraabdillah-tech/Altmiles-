# Fix Vercel Deployment Protection

## Masalah
Aplikasi Anda memiliki **Vercel Authentication Protection** yang aktif. Ini membuat WhatsApp webhook tidak bisa mengakses endpoint `/webhook`.

## Solusi: Disable Deployment Protection

### Langkah 1: Buka Vercel Dashboard
1. Pergi ke: https://vercel.com/altmiles-projects
2. Pilih project Anda
3. Klik tab **"Settings"**

### Langkah 2: Disable Protection
1. Scroll ke bawah cari **"Deployment Protection"**
2. Klik **"Deployment Protection"** di sidebar
3. Pilih **"Disabled"** atau **"Standard Protection"** (bukan Vercel Authentication)
4. Klik **"Save"**

### Langkah 3: Redeploy
1. Pergi ke tab **"Deployments"**
2. Klik titik tiga (...) pada deployment terakhir
3. Pilih **"Redeploy"**

## Alternatif: Whitelist Webhook Path

Jika Anda ingin tetap mengaktifkan protection tapi allow webhook:

1. Di **Deployment Protection** settings
2. Cari **"Protection Bypass for Automation"**
3. Tambahkan path `/webhook` ke whitelist
4. Save dan redeploy

## Verifikasi

Setelah disable protection, test dengan:

```bash
curl https://altmiles-git-main-altmiles-projects.vercel.app/health
```

Harusnya return JSON tanpa authentication page:
```json
{
  "status": "ok",
  "timestamp": "2026-05-20T..."
}
```

## Setup WhatsApp Webhook

Setelah protection disabled:

1. **Buka Meta Developer Console:** https://developers.facebook.com/apps
2. **Pilih App** → WhatsApp → Configuration
3. **Edit Webhook:**
   - Callback URL: `https://altmiles-git-main-altmiles-projects.vercel.app/webhook`
   - Verify Token: `altmiles_secure_token_2024`
4. **Subscribe to:** `messages`
5. **Verify and Save**

## Test Webhook

Kirim pesan WhatsApp ke nomor business Anda, bot akan reply dengan AI!
