const express = require('express');
const router = express.Router();

// Demo mode: switch active client
let demoClientId = process.env.DEMO_CLIENT_ID || 1;

router.post('/switch-client', (req, res) => {
  const { clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ error: 'clientId is required' });
  }

  demoClientId = clientId;
  
  res.json({ 
    success: true, 
    message: `Demo mode now using client ID: ${demoClientId}`,
    activeClientId: demoClientId
  });
});

router.get('/active-client', (req, res) => {
  res.json({ 
    success: true, 
    activeClientId: demoClientId 
  });
});

function getDemoClientId() {
  return demoClientId;
}

module.exports = {
  router,
  getDemoClientId,
};
