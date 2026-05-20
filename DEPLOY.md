# Deploy ke Railway - Panduan Lengkap

## Langkah 1: Persiapan

Pastikan Anda sudah:
- ✅ Punya akun Railway (https://railway.app)
- ✅ Code sudah di GitHub
- ✅ Supabase sudah setup dengan tables

## Langkah 2: Deploy ke Railway

### A. Melalui Dashboard Railway

1. **Login ke Railway**
   - Buka https://railway.app
   - Login dengan GitHub account

2. **Create New Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository: `vyandraabdillah-tech/Altmiles-`
   - Klik "Deploy Now"

3. **Configure Environment Variables**
   
   Setelah project dibuat, klik tab "Variables" dan tambahkan:

   ```
   NODE_ENV=production
   PORT=3000
   
   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   
   # Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   
   # WhatsApp
   WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
   WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
   
   # Demo
   DEMO_CLIENT_ID=1
   ```

4. **Deploy**
   - Railway akan otomatis build dan deploy
   - Tunggu hingga status "Active"
   - Copy URL deployment (contoh: `https://altmiles-production.up.railway.app`)

### B. Melalui Railway CLI (Alternatif)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Add environment variables
railway variables set NODE_ENV=production
railway variables set SUPABASE_URL=your_url
# ... tambahkan semua env vars

# Deploy
railway up
```

## Langkah 3: Setup WhatsApp Webhook

1. **Dapatkan URL Railway Anda**
   - Contoh: `https://altmiles-production.up.railway.app`

2. **Configure di Meta Developer Console**
   - Buka https://developers.facebook.com
   - Pilih App WhatsApp Anda
   - Ke WhatsApp > Configuration
   - Edit Webhook:
     - **Callback URL**: `https://altmiles-production.up.railway.app/webhook`
     - **Verify Token**: `your_custom_verify_token` (sama dengan di env)
   - Klik "Verify and Save"
   - Subscribe ke webhook field: `messages`

## Langkah 4: Test Deployment

### Test Health Check
```bash
curl https://altmiles-production.up.railway.app/health
```

### Test Admin API
```bash
curl https://altmiles-production.up.railway.app/api/admin/clients/1
```

### Test WhatsApp
Kirim pesan WhatsApp ke nomor bisnis Anda dan lihat response dari AI!

## Langkah 5: Monitoring

1. **Railway Dashboard**
   - Lihat logs real-time di tab "Deployments"
   - Monitor resource usage di tab "Metrics"

2. **Check Logs**
   ```bash
   railway logs
   ```

## Troubleshooting

### Error: Port already in use
- Railway otomatis set PORT, pastikan code Anda pakai `process.env.PORT`

### Error: Cannot connect to Supabase
- Cek SUPABASE_URL dan keys sudah benar
- Pastikan Supabase tables sudah dibuat

### Error: WhatsApp webhook verification failed
- Pastikan WHATSAPP_VERIFY_TOKEN sama dengan yang di Meta Console
- Cek URL webhook sudah benar (harus HTTPS)

### Error: Gemini API failed
- Cek GEMINI_API_KEY valid
- Pastikan API quota tidak habis

## Update Deployment

Setiap kali push ke GitHub, Railway akan otomatis re-deploy:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway akan detect changes dan deploy otomatis!

## Custom Domain (Opsional)

1. Buka Railway project > Settings > Domains
2. Klik "Add Domain"
3. Masukkan domain Anda (contoh: `chatbot.altmiles.com`)
4. Update DNS records sesuai instruksi Railway
5. Update WhatsApp webhook URL dengan domain baru

## Biaya Railway

- **Free Tier**: $5 credit/bulan (cukup untuk testing)
- **Pro Plan**: $20/bulan (unlimited usage)
- Monitor usage di Dashboard > Usage

---

## Quick Deploy Checklist

- [ ] Login Railway
- [ ] Deploy from GitHub
- [ ] Add all environment variables
- [ ] Wait for deployment success
- [ ] Copy deployment URL
- [ ] Configure WhatsApp webhook
- [ ] Test dengan kirim pesan WhatsApp
- [ ] Monitor logs

Selamat! Chatbot Anda sudah live! 🚀
