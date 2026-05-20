require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('Testing Supabase connection...\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_SERVICE_KEY:', supabaseKey ? 'SET (hidden)' : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Environment variables not set!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n1. Testing connection...');
    
    // Test 1: Check if clients table exists
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .limit(1);
    
    if (clientsError) {
      console.error('❌ Error fetching clients:', clientsError.message);
      console.log('\n📝 Kemungkinan tabel belum dibuat. Jalankan SQL di Supabase Dashboard!');
      console.log('   File: db/supabase_setup.sql');
    } else {
      console.log('✅ Clients table exists');
      console.log('   Data:', clients);
    }
    
    // Test 2: Check products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError.message);
    } else {
      console.log('✅ Products table exists');
      console.log('   Data:', products);
    }
    
    // Test 3: Check conversations table
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (conversationsError) {
      console.error('❌ Error fetching conversations:', conversationsError.message);
    } else {
      console.log('✅ Conversations table exists');
      console.log('   Data:', conversations);
    }
    
    console.log('\n✅ Database connection test completed!');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
  }
}

testConnection();
