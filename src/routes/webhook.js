const express = require('express');
const router = express.Router();
const db = require('../services/db');
const gemini = require('../services/gemini');
const whatsapp = require('../services/whatsapp');

// Webhook verification (GET)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook handler (POST)
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // Acknowledge receipt immediately
    res.sendStatus(200);

    // Process webhook asynchronously
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages?.[0]) {
        const message = value.messages[0];
        const customerNumber = message.from;
        const messageText = message.text?.body;
        const businessNumber = value.metadata?.phone_number_id;

        if (!messageText) return;

        console.log(`Received message from ${customerNumber}: ${messageText}`);

        // Get client by business WhatsApp number
        const client = await db.getClientByWaNumber(businessNumber);
        
        if (!client) {
          console.log(`No client found for business number ${businessNumber}`);
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
          await whatsapp.sendWhatsAppMessage(customerNumber, aiResponse);
          
          // Save AI response
          await db.saveConversation(client.id, customerNumber, aiResponse, 'assistant');
          
          console.log(`AI response sent to ${customerNumber}`);
        } else {
          // Forward mode: Send to admin
          await whatsapp.forwardToAdmin(client.admin_number, customerNumber, messageText);
          console.log(`Message forwarded to admin ${client.admin_number}`);
        }
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
  }
});

module.exports = router;
