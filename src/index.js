require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment check (without exposing secrets)
console.log('🔍 Environment check:', {
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

// Health check (before loading routes to avoid crashes)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasWhatsAppToken: !!process.env.WHATSAPP_ACCESS_TOKEN
    }
  });
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

// Load routes only if environment variables are set
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    const webhookRoutes = require('./routes/webhook');
    const adminRoutes = require('./routes/admin');
    const demoRoutes = require('./routes/demo');
    
    app.use('/webhook', webhookRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/demo', demoRoutes.router);
    
    console.log('✅ All routes loaded successfully');
  } else {
    console.error('⚠️  Environment variables not set. Routes not loaded.');
    
    // Fallback routes
    app.all('*', (req, res) => {
      res.status(503).json({
        error: 'Service not configured',
        message: 'Environment variables are not set. Please configure in Vercel Dashboard.',
        required: [
          'SUPABASE_URL',
          'SUPABASE_SERVICE_KEY',
          'GEMINI_API_KEY',
          'WHATSAPP_ACCESS_TOKEN'
        ]
      });
    });
  }
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  
  // Error handler
  app.all('*', (req, res) => {
    res.status(500).json({
      error: 'Service initialization failed',
      message: error.message
    });
  });
}

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
