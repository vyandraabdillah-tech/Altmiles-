# Altmiles WhatsApp AI Chatbot System

A complete WhatsApp AI chatbot backend for digital agencies. Built with Node.js, Express, PostgreSQL, and Google Gemini AI.

## Features

- **WhatsApp Integration**: Receive and respond to messages via Meta Cloud API
- **AI-Powered Responses**: Uses Google Gemini Pro with custom system prompts per client
- **Smart Routing**: Toggle between AI mode and admin forwarding per client
- **Product Database**: Bot answers product questions from database
- **REST API**: Manage clients, products, and view chat history
- **Demo Mode**: Switch between clients for testing

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `WHATSAPP_ACCESS_TOKEN`: Meta Cloud API access token
- `WHATSAPP_PHONE_NUMBER_ID`: Your WhatsApp Business phone number ID
- `WHATSAPP_VERIFY_TOKEN`: Webhook verification token (create your own)
- Database credentials (PostgreSQL)

### 3. Setup Database

Create PostgreSQL database:

```bash
createdb altmiles_chatbot
```

Run migrations:

```bash
npm run migrate
```

### 4. Add Sample Client

```sql
INSERT INTO clients (name, wa_number, admin_number, ai_active, system_prompt)
VALUES (
  'Demo Client',
  '1234567890',
  '0987654321',
  true,
  'You are a helpful customer service assistant. Be friendly and professional.'
);
```

### 5. Start Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Webhook
- `GET /webhook` - Webhook verification
- `POST /webhook` - Receive WhatsApp messages

### Admin API

#### Client Management
- `GET /api/admin/clients/:clientId` - Get client info
- `POST /api/admin/clients/:clientId/toggle-ai` - Toggle AI on/off
- `PUT /api/admin/clients/:clientId/prompt` - Update system prompt

#### Product Management
- `GET /api/admin/clients/:clientId/products` - List products
- `POST /api/admin/clients/:clientId/products` - Add product
- `PUT /api/admin/products/:productId` - Update product
- `DELETE /api/admin/products/:productId` - Delete product

#### Conversations
- `GET /api/admin/clients/:clientId/conversations` - Get chat history

### Demo Mode
- `POST /api/demo/switch-client` - Switch active client
- `GET /api/demo/active-client` - Get current active client

## Usage Examples

### Toggle AI Mode

```bash
curl -X POST http://localhost:3000/api/admin/clients/1/toggle-ai \
  -H "Content-Type: application/json" \
  -d '{"aiActive": true}'
```

### Update System Prompt

```bash
curl -X PUT http://localhost:3000/api/admin/clients/1/prompt \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt": "You are a sales assistant for a tech store."}'
```

### Add Product

```bash
curl -X POST http://localhost:3000/api/admin/clients/1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Pro",
    "price": 1299.99,
    "stock": 15,
    "description": "High-performance laptop with 16GB RAM"
  }'
```

### Switch Demo Client

```bash
curl -X POST http://localhost:3000/api/demo/switch-client \
  -H "Content-Type: application/json" \
  -d '{"clientId": 2}'
```

## Database Schema

### clients
- `id` - Primary key
- `name` - Client name
- `wa_number` - WhatsApp business number
- `admin_number` - Admin WhatsApp for forwarding
- `ai_active` - Boolean toggle for AI mode
- `system_prompt` - Custom Gemini system prompt

### products
- `id` - Primary key
- `client_id` - Foreign key to clients
- `name` - Product name
- `price` - Product price
- `stock` - Available quantity
- `description` - Product details

### conversations
- `id` - Primary key
- `client_id` - Foreign key to clients
- `customer_number` - Customer WhatsApp number
- `message` - Message content
- `role` - 'user' or 'assistant'
- `created_at` - Timestamp

## WhatsApp Setup

1. Create a Meta Business account
2. Set up WhatsApp Business API
3. Get your Phone Number ID and Access Token
4. Configure webhook URL: `https://your-domain.com/webhook`
5. Subscribe to `messages` webhook events

## Architecture

```
/src
  /routes
    webhook.js    - WhatsApp webhook handler
    admin.js      - Admin REST API
    demo.js       - Demo mode endpoints
  /services
    claude.js     - Claude AI integration
    whatsapp.js   - WhatsApp API client
    db.js         - Database operations
  index.js        - Express app entry point

/db
  /migrations
    001_create_tables.sql - Database schema
  migrate.js      - Migration runner
```

## How It Works

1. Customer sends WhatsApp message
2. Meta forwards to `/webhook` endpoint
3. System checks if client has AI enabled
4. **If AI active**: Gemini generates response using system prompt + product data
5. **If AI inactive**: Message forwarded to admin WhatsApp number
6. All conversations saved to database

## Deployment

### Deploy to Railway

Lihat panduan lengkap di [DEPLOY.md](DEPLOY.md)

**Quick Steps:**
1. Login ke https://railway.app
2. New Project > Deploy from GitHub
3. Pilih repository ini
4. Add environment variables (lihat `.env.example`)
5. Deploy!

Railway akan otomatis:
- Build aplikasi
- Install dependencies
- Start server
- Provide HTTPS URL

### Environment Variables untuk Railway

Copy semua variables dari `.env.example` dan isi dengan credentials Anda di Railway Dashboard > Variables.

## License

MIT
