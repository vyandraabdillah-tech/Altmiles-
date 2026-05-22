# 📱 Baileys WhatsApp Setup Guide

## Perubahan dari WhatsApp Cloud API ke Baileys

Sistem sekarang menggunakan **Baileys** (WhatsApp Web Multi-Device) sebagai pengganti WhatsApp Cloud API.

### Keuntungan Baileys:
✅ Gratis (tidak perlu Meta Business Account)
✅ Tidak perlu webhook verification
✅ Koneksi langsung ke WhatsApp Web
✅ Support semua fitur WhatsApp

### Kekurangan:
⚠️ Perlu scan QR code untuk koneksi
⚠️ Tidak cocok untuk serverless (Vercel)
⚠️ Perlu server yang always-on

## 🚀 Setup Baileys

### 1. Install Dependencies

```bash
npm install
```

Dependencies baru:
- `@whiskeysockets/baileys` - WhatsApp Web API
- `qrcode-terminal` - Display QR code di terminal
- `pino` - Logger

### 2. Start Server

```bash
npm start
```

### 3. Scan QR Code

Saat pertama kali jalan, akan muncul QR code di terminal:

```
📱 QR Code generated. Scan with WhatsApp app!
█████████████████████████████
█████████████████████████████
```

**Cara scan:**
1. Buka WhatsApp di HP
2. Tap menu (3 titik) → Linked Devices
3. Tap "Link a Device"
4. Scan QR code yang muncul di terminal

### 4. Koneksi Berhasil

Setelah scan, akan muncul:
```
✅ WhatsApp connected successfully!
```

Session akan tersimpan di folder `auth_info_baileys/` sehingga tidak perlu scan ulang.

## 📡 API Endpoints

### Get QR Code
```bash
GET http://localhost:3001/api/baileys/qr
```

Response:
```json
{
  "success": true,
  "qrCode": "2@xxx...",
  "message": "Scan this QR code with WhatsApp app"
}
```

### Check Connection Status
```bash
GET http://localhost:3001/api/baileys/status
```

Response:
```json
{
  "success": true,
  "isConnected": true,
  "hasQR": false
}
```

## 💬 Cara Kerja

### Incoming Messages:

1. User kirim pesan WhatsApp ke nomor yang terkoneksi
2. Baileys terima pesan
3. System cek `ai_active` dari database
4. **Jika AI active:**
   - Generate response dengan Gemini AI
   - Kirim response ke user
   - Save conversation ke database
5. **Jika AI inactive:**
   - Forward pesan ke admin number

### Outgoing Messages:

Bot otomatis reply menggunakan:
- Gemini AI (model: gemini-2.5-flash)
- Product database untuk info produk
- Custom system prompt per client

## 🔧 Configuration

### Database (Supabase)
Tetap sama seperti sebelumnya:
- `clients` table
- `products` table
- `conversations` table

### Environment Variables
```env
# Supabase
SUPABASE_URL=https://tgbufizofchovmjkcnbc.supabase.co
SUPABASE_SERVICE_KEY=your_key

# Gemini AI
GEMINI_API_KEY=your_key

# Server
PORT=3001
```

**Tidak perlu lagi:**
- ❌ WHATSAPP_ACCESS_TOKEN
- ❌ WHATSAPP_PHONE_NUMBER_ID
- ❌ WHATSAPP_VERIFY_TOKEN
- ❌ WHATSAPP_API_URL

## 🚨 Important Notes

### ⚠️ Baileys TIDAK COCOK untuk Vercel/Serverless

Baileys memerlukan:
- Persistent connection (always-on)
- File system untuk save session
- WebSocket connection

**Untuk production, gunakan:**
- VPS (DigitalOcean, Linode, AWS EC2)
- Railway (dengan persistent storage)
- Heroku (dengan dyno always-on)

### ⚠️ Session Management

Session tersimpan di `auth_info_baileys/`:
- `creds.json` - Credentials
- `app-state-sync-*.json` - State sync

**Backup folder ini!** Jika hilang, harus scan QR code ulang.

### ⚠️ Reconnection

Jika koneksi terputus:
- Baileys akan auto-reconnect
- Jika logout dari HP, harus scan QR code ulang

## 🧪 Testing

### Test 1: Check Connection
```bash
curl http://localhost:3001/api/baileys/status
```

### Test 2: Send Test Message
Kirim pesan WhatsApp ke nomor yang terkoneksi:
```
Hello, what services do you offer?
```

Bot akan reply dengan AI response!

### Test 3: Check Conversation History
```bash
curl http://localhost:3001/api/admin/clients/1/conversations
```

## 📊 Admin API (Tetap Sama)

Semua admin API masih berfungsi:
- Toggle AI on/off
- Update system prompt
- Manage products
- View conversations

## 🔄 Migration dari Cloud API

Jika sebelumnya pakai Cloud API:

1. ✅ Database tetap sama (tidak perlu migrasi)
2. ✅ Admin API tetap sama
3. ✅ Gemini AI tetap sama
4. ❌ Webhook tidak dipakai lagi
5. ✅ Ganti dengan Baileys connection

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start server
3. ✅ Scan QR code
4. ✅ Test dengan kirim pesan
5. ✅ Deploy ke VPS (bukan Vercel!)

**Sistem siap digunakan!** 🚀
