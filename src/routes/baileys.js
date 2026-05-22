const express = require('express');
const router = express.Router();
const { getConnectionStatus } = require('../services/baileys');

// Get QR Code for WhatsApp connection
router.get('/qr', (req, res) => {
  const status = getConnectionStatus();
  
  if (status.isConnected) {
    return res.json({
      success: true,
      message: 'WhatsApp already connected',
      isConnected: true
    });
  }

  if (status.hasQR) {
    return res.json({
      success: true,
      qrCode: status.qrCode,
      message: 'Scan this QR code with WhatsApp app',
      isConnected: false
    });
  }

  res.json({
    success: false,
    message: 'QR code not available yet. Please wait...',
    isConnected: false
  });
});

// Get connection status
router.get('/status', (req, res) => {
  const status = getConnectionStatus();
  res.json({
    success: true,
    isConnected: status.isConnected,
    hasQR: status.hasQR
  });
});

module.exports = router;
