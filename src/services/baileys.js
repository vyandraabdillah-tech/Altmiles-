const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

let sock = null;
let qrCodeData = null;
let isConnected = false;

// Initialize Baileys connection
async function initializeBaileys() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      auth: state,
      getMessage: async (key) => {
        return { conversation: '' };
      }
    });

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        qrCodeData = qr;
        console.log('📱 QR Code generated. Scan with WhatsApp app!');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('Connection closed. Reconnecting:', shouldReconnect);
        isConnected = false;
        
        if (shouldReconnect) {
          setTimeout(() => initializeBaileys(), 3000);
        }
      } else if (connection === 'open') {
        console.log('✅ WhatsApp connected successfully!');
        isConnected = true;
        qrCodeData = null;
      }
    });

    // Save credentials when updated
    sock.ev.on('creds.update', saveCreds);

    return sock;
  } catch (error) {
    console.error('Baileys initialization error:', error);
    throw error;
  }
}

// Send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  try {
    if (!sock || !isConnected) {
      throw new Error('WhatsApp not connected');
    }

    // Format number (add @s.whatsapp.net if not present)
    const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`;

    await sock.sendMessage(jid, { text: message });
    console.log(`Message sent to ${to}`);
    
    return { success: true };
  } catch (error) {
    console.error('Send message error:', error);
    throw new Error('Failed to send WhatsApp message');
  }
}

// Forward message to admin
async function forwardToAdmin(adminNumber, customerNumber, message) {
  const forwardMessage = `[Forwarded from ${customerNumber}]\n\n${message}`;
  return sendWhatsAppMessage(adminNumber, forwardMessage);
}

// Get connection status
function getConnectionStatus() {
  return {
    isConnected,
    hasQR: !!qrCodeData,
    qrCode: qrCodeData
  };
}

// Get socket instance
function getSocket() {
  return sock;
}

module.exports = {
  initializeBaileys,
  sendWhatsAppMessage,
  forwardToAdmin,
  getConnectionStatus,
  getSocket
};
