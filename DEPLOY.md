# Deploy ke Vercel

## Setup Environment Variables di Vercel

Setelah deploy, Anda HARUS menambahkan environment variables di Vercel Dashboard:

1. Buka project di Vercel Dashboard
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan semua variable berikut:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

4. Klik **Save**
5. **Redeploy** project agar environment variables aktif

## Cara Deploy

### Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via GitHub (Recommended)
1. Push code ke GitHub
2. Import project di Vercel Dashboard
3. Vercel akan auto-deploy setiap kali ada push ke main branch

## Setelah Deploy

1. Copy URL deployment Anda (contoh: `https://altmiles-xxx.vercel.app`)
2. Setup webhook di Meta Developer Console:
   - Webhook URL: `https://altmiles-xxx.vercel.app/webhook`
   - Verify Token: `altmiles_secure_token_2024`
   - Subscribe to: `messages`

## Testing Endpoints

- Health check: `https://your-app.vercel.app/health`
- Webhook: `https://your-app.vercel.app/webhook`
- Admin API: `https://your-app.vercel.app/api/admin/clients/1`
- Demo: `https://your-app.vercel.app/api/demo/active-client`

## Troubleshooting

### Error: FUNCTION_INVOCATION_FAILED
- Pastikan semua environment variables sudah diset
- Check logs di Vercel Dashboard → Deployments → View Function Logs

### Error: Database connection failed
- Pastikan SUPABASE_URL dan SUPABASE_SERVICE_KEY benar
- Test koneksi Supabase di dashboard

### Webhook tidak menerima pesan
- Pastikan webhook URL sudah diverifikasi di Meta
- Check logs untuk melihat incoming requests
