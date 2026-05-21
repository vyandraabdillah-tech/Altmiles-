# 🔧 WhatsApp Webhook Setup - Panduan Lengkap

## ⚠️ Error: "URL callback atau token verifikasi tidak dapat divalidasi"

Error ini terjadi karena Meta tidak bisa verify webhook Anda.

## 📋 Checklist Sebelum Setup Webhook

### 1. ✅ Environment Variables di Vercel HARUS Sudah Diset

**PENTING:** Tanpa environment variables, aplikasi akan crash!

Buka: https://vercel.com/altmiles-projects/~/settings/environment-variables

**Copy SEMUA dari file `vercel-env-import.txt` dan import:**

```
SUPABASE_URL="https://tgbufizofchovmjkcnbc.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnYnVmaXpvZmNob3ZtamtjbmJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzk0ODA4NCwiZXhwIjoyMDg5NTI0MDg0fQ.KOaAi6T00Mje3jSJFlbKCYHKceYiOiypfalNCCTt0yg"
GEMINI_API_KEY="AIzaSyCTzu_WWjAVoIloPH1JcIoKM0YXAK3GlfM"
WHATSAPP_API_URL="https://graph.facebook.com/v18.0"
WHATSAPP_PHONE_NUMBER_ID="1611103639943799"
WHATSAPP_ACCESS_TOKEN="EAAX26MTl3B8BRurtJ4tSnXZCY7UKuAT0pMxzVSRpiN8pk4opLKWz4vBmglvrP9dHam8WnieNoTZCOZCZBjZAtTlmRxhHGheja2zuAC45qq3RTaPZBO3hR9DZCUHNiKHBdaNtkgfSXgAVli1auZBK53g5gN2pfARnIpLiZCgVIhlE0V8rro8wQ7CoEb1p6mihTpwZDZD"
WHATSAPP_VERIFY_TOKEN="1412"
```

**Centang:** Production, Preview, Development

**Klik:** Save

### 2. ✅ Redeploy Setelah Set Environment Variables

Setelah save environment variables:

1. Pergi ke tab **Deployments**
2. Klik **"..."** pada deployment terakhir
3. Klik **"Redeploy"**
4. **Tunggu sampai selesai** (status: Ready)

### 3. ✅ Test Webhook Endpoint

Setelah redeploy selesai, test di browser atau terminal:

```bash
curl "https://altmiles-git-main-altmiles-projects.vercel.app/webhook?hub.mode=subscribe&hub.verify_token=1412&hub.challenge=test123"
```

**Expected response:** `test123`

**Jika masih error:**
- Environment variables belum diset dengan benar
- Belum redeploy setelah set env vars
- Deployment Protection masih aktif

### 4. ✅ Disable Deployment Protection (PENTING!)

Settings → Deployment Protection → **Disabled** → Save

Redeploy lagi setelah disable.

## 📱 Setup Webhook di Meta Developer Console

**HANYA LAKUKAN SETELAH LANGKAH 1-4 BERHASIL!**

### Langkah Setup:

1. **Buka Meta Developer Console:**
   https://developers.facebook.com/apps

2. **Pilih App Anda** → WhatsApp → Configuration

3. **Edit Webhook:**
   - **Callback URL:** `https://altmiles-git-main-altmiles-projects.vercel.app/webhook`
   - **Verify Token:** `1412`
   
4. **Klik "Verify and Save"**

5. **Subscribe to Webhooks:**
   - Centang: `messages`
   - Klik Subscribe

## 🧪 Test Webhook

### Test 1: Verification (GET)

```bash
curl "https://altmiles-git-main-altmiles-projects.vercel.app/webhook?hub.mode=subscribe&hub.verify_token=1412&hub.challenge=hello"
```

**Expected:** `hello`

### Test 2: Health Check

```bash
curl https://altmiles-git-main-altmiles-projects.vercel.app/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

### Test 3: Kirim Pesan WhatsApp

Kirim pesan ke nomor WhatsApp Business Anda. Bot harusnya reply dengan AI!

## 🚨 Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"
**Penyebab:** Environment variables belum diset
**Solusi:** Set semua env vars di Vercel, lalu redeploy

### Error: "Authentication Required"
**Penyebab:** Deployment Protection masih aktif
**Solusi:** Disable di Settings → Deployment Protection

### Error: "Invalid verify token"
**Penyebab:** Token tidak match
**Solusi:** Pastikan verify token di Meta = `1412`

### Error: "Phone Number ID does not exist"
**Penyebab:** Phone Number ID tidak cocok dengan access token
**Solusi:** 
1. Buka WhatsApp Business API settings di Meta
2. Copy Phone Number ID yang benar
3. Update `WHATSAPP_PHONE_NUMBER_ID` di Vercel
4. Redeploy

## ✅ Verification Checklist

Sebelum setup webhook, pastikan:

- [ ] Environment variables sudah diset di Vercel (7 variables)
- [ ] Sudah redeploy setelah set env vars
- [ ] Deployment Protection = Disabled
- [ ] Test verification endpoint return challenge
- [ ] Health endpoint return OK

**Jika semua ✅, baru setup webhook di Meta!**

## 📞 Support

Jika masih error, check:
1. Vercel Function Logs (Deployments → View Function Logs)
2. Pastikan semua env vars terisi
3. Pastikan tidak ada typo di verify token

---

**Ingat:** Webhook verification HARUS berhasil dulu sebelum bisa terima pesan WhatsApp!
