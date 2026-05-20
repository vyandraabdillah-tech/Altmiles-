const { createClient } = require('@supabase/supabase-js');

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  console.error('SUPABASE_URL is not defined in environment variables');
  throw new Error('SUPABASE_URL is required');
}

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_KEY is not defined in environment variables');
  throw new Error('SUPABASE_SERVICE_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Client operations
async function getClientByWaNumber(waNumber) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('wa_number', waNumber)
    .single();
  
  if (error) throw error;
  return data;
}

async function getClientById(clientId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();
  
  if (error) throw error;
  return data;
}

async function updateClientAiActive(clientId, aiActive) {
  const { data, error } = await supabase
    .from('clients')
    .update({ ai_active: aiActive, updated_at: new Date().toISOString() })
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

async function updateClientSystemPrompt(clientId, systemPrompt) {
  const { data, error } = await supabase
    .from('clients')
    .update({ system_prompt: systemPrompt, updated_at: new Date().toISOString() })
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Product operations
async function getProductsByClientId(clientId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .order('name');
  
  if (error) throw error;
  return data;
}

async function addProduct(clientId, name, price, stock, description) {
  const { data, error } = await supabase
    .from('products')
    .insert([{ client_id: clientId, name, price, stock, description }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

async function updateProduct(productId, updates) {
  updates.updated_at = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

async function deleteProduct(productId) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  
  if (error) throw error;
}

// Conversation operations
async function saveConversation(clientId, customerNumber, message, role) {
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ client_id: clientId, customer_number: customerNumber, message, role }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

async function getConversationHistory(clientId, customerNumber, limit = 10) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('client_id', clientId)
    .eq('customer_number', customerNumber)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data.reverse();
}

async function getAllConversations(clientId, limit = 100) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  getClientByWaNumber,
  getClientById,
  updateClientAiActive,
  updateClientSystemPrompt,
  getProductsByClientId,
  addProduct,
  updateProduct,
  deleteProduct,
  saveConversation,
  getConversationHistory,
  getAllConversations,
};
