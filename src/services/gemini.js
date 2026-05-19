const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(systemPrompt, conversationHistory, productsContext) {
  try {
    // Build context with products if available
    let fullSystemPrompt = systemPrompt;
    
    if (productsContext && productsContext.length > 0) {
      const productsInfo = productsContext.map(p => 
        `- ${p.name}: $${p.price} (Stock: ${p.stock}) - ${p.description || 'No description'}`
      ).join('\n');
      
      fullSystemPrompt += `\n\nAvailable Products:\n${productsInfo}\n\nUse this product information to answer customer questions about pricing, availability, and product details.`;
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: fullSystemPrompt
    });

    // Format conversation history for Gemini
    const history = conversationHistory.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.message }]
    }));

    // Get the last message (current user message)
    const lastMessage = conversationHistory[conversationHistory.length - 1];

    // Start chat with history
    const chat = model.startChat({ history });

    // Send the current message
    const result = await chat.sendMessage(lastMessage.message);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

module.exports = {
  generateResponse,
};
