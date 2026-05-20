// Script to check if environment variables are set
require('dotenv').config();

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'GEMINI_API_KEY',
  'WHATSAPP_API_URL',
  'WHATSAPP_PHONE_NUMBER_ID',
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_VERIFY_TOKEN'
];

console.log('🔍 Checking environment variables...\n');

let allSet = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = !!value;
  const status = isSet ? '✅' : '❌';
  
  console.log(`${status} ${varName}: ${isSet ? 'SET' : 'NOT SET'}`);
  
  if (!isSet) {
    allSet = false;
  }
});

console.log('\n' + (allSet ? '✅ All environment variables are set!' : '❌ Some environment variables are missing!'));

if (!allSet) {
  console.log('\n📝 Please set missing variables in Vercel Dashboard:');
  console.log('   Settings → Environment Variables');
  process.exit(1);
}

process.exit(0);
