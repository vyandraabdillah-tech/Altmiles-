require('dotenv').config();
const express = require('express');
const webhookRoutes = require('./routes/webhook');
const adminRoutes = require('./routes/admin');
const demoRoutes = require('./routes/demo');
const baileysRoutes = require('./routes/baileys');
const { initializeBaileys, getSocket } = require('./services/baileys');
const db = require('./services/db');
const gemini = require('./services/gemini');

const app = express();

// Log environment check (without exposing secrets)
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  nodeEnv: process.env.NODE_ENV,
  isVercel: !!process.env.VERCEL
});

// Initialize Baileys (WhatsApp connection)
if (!process.env.VERCEL) {
  // Only initialize in non-serverless environment
  initializeBaileys().then((sock) => {
    console.log('Baileys initialized');
    
    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      
      if (!msg.message || msg.key.fromMe) return;
      
      const customerNumber = msg.key.remoteJid.replace('@s.whatsapp.net', '');
      const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text;
      
      if (!messageText) return;
      
      console.log(`Received message from ${customerNumber}: ${messageText}`);
      
      try {
        // Get client (for demo, use client ID 1)
        const client = await db.getClientById(1);
        
        if (!client) {
          console.log('No client found');
          return;
        }
        
        // Save incoming message
        await db.saveConversation(client.id, customerNumber, messageText, 'user');
        
        if (client.ai_active) {
          // AI mode: Generate response with Gemini
          const conversationHistory = await db.getConversationHistory(client.id, customerNumber, 10);
          const products = await db.getProductsByClientId(client.id);
          
          const aiResponse = await gemini.generateResponse(
            client.system_prompt,
            conversationHistory,
            products
          );
          
          // Send AI response
          await sock.sendMessage(msg.key.remoteJid, { text: aiResponse });
          
          // Save AI response
          await db.saveConversation(client.id, customerNumber, aiResponse, 'assistant');
          
          console.log(`AI response sent to ${customerNumber}`);
        } else {
          // Forward mode: Send to admin
          const forwardMessage = `[Forwarded from ${customerNumber}]\n\n${messageText}`;
          await sock.sendMessage(`${client.admin_number}@s.whatsapp.net`, { text: forwardMessage });
          console.log(`Message forwarded to admin ${client.admin_number}`);
        }
      } catch (error) {
        console.error('Message processing error:', error);
      }
    });
  }).catch(err => {
    console.error('Failed to initialize Baileys:', err);
  });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Favicon handler (prevent 404 logs)
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/demo', demoRoutes.router);
app.use('/api/baileys', baileysRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint (remove in production)
app.get('/debug/env', (req, res) => {
  res.json({
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasWhatsAppToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
    hasVerifyToken: !!process.env.WHATSAPP_VERIFY_TOKEN,
    verifyTokenValue: process.env.WHATSAPP_VERIFY_TOKEN ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Altmiles WhatsApp AI Chatbot (Baileys)',
    version: '2.0.0',
    endpoints: {
      webhook: '/webhook',
      admin: '/api/admin',
      demo: '/api/demo',
      baileys: '/api/baileys',
      health: '/health'
    }
  });
});

// Start server (only if not in serverless environment)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Altmiles WhatsApp AI Chatbot running on port ${PORT}`);
    console.log(`📱 Baileys WhatsApp: Initializing...`);
    console.log(`⚙️  Admin API: http://localhost:${PORT}/api/admin`);
    console.log(`🎮 Demo mode: http://localhost:${PORT}/api/demo`);
    console.log(`📲 QR Code: http://localhost:${PORT}/api/baileys/qr`);
  });
}

// Export for Vercel serverless
module.exports = app;
