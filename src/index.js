require('dotenv').config();
const express = require('express');
const webhookRoutes = require('./routes/webhook');
const adminRoutes = require('./routes/admin');
const demoRoutes = require('./routes/demo');

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment check (without exposing secrets)
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  hasWhatsAppToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
  nodeEnv: process.env.NODE_ENV,
  isVercel: !!process.env.VERCEL
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/demo', demoRoutes.router);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Altmiles WhatsApp AI Chatbot',
    version: '1.0.0',
    endpoints: {
      webhook: '/webhook',
      admin: '/api/admin',
      demo: '/api/demo',
      health: '/health'
    }
  });
});

// Start server (only if not in serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Altmiles WhatsApp AI Chatbot running on port ${PORT}`);
    console.log(`📱 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`⚙️  Admin API: http://localhost:${PORT}/api/admin`);
    console.log(`🎮 Demo mode: http://localhost:${PORT}/api/demo`);
  });
}

// Export for Vercel serverless
module.exports = app;
