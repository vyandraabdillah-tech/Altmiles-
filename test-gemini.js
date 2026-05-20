require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API...\n');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT SET');

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not set!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    console.log('\n1. Testing with gemini-pro...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    console.log('✅ gemini-pro works!');
    console.log('Response:', response.text());
  } catch (error) {
    console.error('❌ gemini-pro failed:', error.message);
    
    // Try alternative models
    console.log('\n2. Trying gemini-1.5-flash...');
    try {
      const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result2 = await model2.generateContent('Say hello');
      const response2 = await result2.response;
      console.log('✅ gemini-1.5-flash works!');
      console.log('Response:', response2.text());
    } catch (error2) {
      console.error('❌ gemini-1.5-flash failed:', error2.message);
      
      console.log('\n❌ API Key tidak valid atau sudah expired!');
      console.log('📝 Dapatkan API key baru di: https://makersuite.google.com/app/apikey');
    }
  }
}

testGemini();
