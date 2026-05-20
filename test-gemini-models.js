require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDiZ7lW9Jkpd0nLNVmKQgOw7tOjfNHrcdA';
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTry = [
  'gemini-1.5-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-2.0-flash-exp',
  'models/gemini-pro',
  'models/gemini-1.5-flash'
];

async function testModels() {
  console.log('Testing different Gemini models...\n');
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in one word');
      const response = await result.response;
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`   Response: ${response.text()}\n`);
      break; // Stop after first success
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message.substring(0, 100)}...\n`);
    }
  }
}

testModels();
