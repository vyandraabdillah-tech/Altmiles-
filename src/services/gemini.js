const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(systemPrompt, conversationHistory, productsContext) {
  try {
    // Build context with products if available
    let fullPrompt = systemPrompt;
    
    if (productsContext && productsContext.length > 0) {
      const productsInfo = productsContext.map(p => 
        `- ${p.name}: $${p.price} (Stock: ${p.stock}) - ${p.description || 'No description'}`
      ).join('\n');
      
      fullPrompt += `\n\nAvailable Products:\n${productsInfo}\n\nUse this product information to answer customer questions about pricing, availability, and product details.`;
    }

    // Initialize Gemini model (using gemini-2.5-flash - latest model with separate quota)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Get the last message (current user message)
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    
    // Build full prompt with context
    const promptWithContext = `${fullPrompt}\n\nCustomer: ${lastMessage.message}\n\nAssistant:`;

    // Generate response
    const result = await model.generateContent(promptWithContext);
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
