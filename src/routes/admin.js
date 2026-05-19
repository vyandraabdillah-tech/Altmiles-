const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Toggle AI on/off
router.post('/clients/:clientId/toggle-ai', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { aiActive } = req.body;

    if (typeof aiActive !== 'boolean') {
      return res.status(400).json({ error: 'aiActive must be a boolean' });
    }

    const client = await db.updateClientAiActive(clientId, aiActive);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ 
      success: true, 
      client,
      message: `AI ${aiActive ? 'enabled' : 'disabled'} for client ${client.name}`
    });
  } catch (error) {
    console.error('Toggle AI error:', error);
    res.status(500).json({ error: 'Failed to toggle AI' });
  }
});

// Update system prompt
router.put('/clients/:clientId/prompt', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { systemPrompt } = req.body;

    if (!systemPrompt || typeof systemPrompt !== 'string') {
      return res.status(400).json({ error: 'systemPrompt is required and must be a string' });
    }

    const client = await db.updateClientSystemPrompt(clientId, systemPrompt);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ 
      success: true, 
      client,
      message: 'System prompt updated successfully'
    });
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({ error: 'Failed to update system prompt' });
  }
});

// Get client info
router.get('/clients/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await db.getClientById(clientId);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ success: true, client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to get client' });
  }
});

// Add product
router.post('/clients/:clientId/products', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, price, stock, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price are required' });
    }

    const product = await db.addProduct(
      clientId,
      name,
      price,
      stock || 0,
      description || ''
    );

    res.json({ 
      success: true, 
      product,
      message: 'Product added successfully'
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Get products
router.get('/clients/:clientId/products', async (req, res) => {
  try {
    const { clientId } = req.params;
    const products = await db.getProductsByClientId(clientId);

    res.json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Update product
router.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = {};

    ['name', 'price', 'stock', 'description'].forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const product = await db.updateProduct(productId, updates);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ 
      success: true, 
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    await db.deleteProduct(productId);

    res.json({ 
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get chat history
router.get('/clients/:clientId/conversations', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { limit } = req.query;

    const conversations = await db.getAllConversations(
      clientId,
      limit ? parseInt(limit) : 100
    );

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

module.exports = router;
