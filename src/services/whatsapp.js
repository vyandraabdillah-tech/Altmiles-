const axios = require('axios');

async function sendWhatsAppMessage(to, message) {
  try {
    const url = `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('WhatsApp API error:', error.response?.data || error.message);
    throw new Error('Failed to send WhatsApp message');
  }
}

async function forwardToAdmin(adminNumber, customerNumber, message) {
  const forwardMessage = `[Forwarded from ${customerNumber}]\n\n${message}`;
  return sendWhatsAppMessage(adminNumber, forwardMessage);
}

module.exports = {
  sendWhatsAppMessage,
  forwardToAdmin,
};
