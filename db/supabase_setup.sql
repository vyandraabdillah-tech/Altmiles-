-- Run this SQL in Supabase SQL Editor to create tables

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    wa_number VARCHAR(20) NOT NULL UNIQUE,
    admin_number VARCHAR(20) NOT NULL,
    ai_active BOOLEAN DEFAULT true,
    system_prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    customer_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_client_customer ON conversations(client_id, customer_number);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_products_client_id ON products(client_id);

-- Insert sample client
INSERT INTO clients (name, wa_number, admin_number, ai_active, system_prompt)
VALUES (
  'Demo Client',
  '1611103639943799',
  '628123456789',
  true,
  'You are a helpful customer service assistant for a digital agency. Be friendly, professional, and helpful. Answer questions about products and services.'
)
ON CONFLICT (wa_number) DO NOTHING;

-- Insert sample products (optional)
INSERT INTO products (client_id, name, price, stock, description)
VALUES 
  (1, 'Website Development', 5000.00, 999, 'Professional website development service with modern design'),
  (1, 'Social Media Management', 1500.00, 999, 'Monthly social media management package'),
  (1, 'SEO Optimization', 2000.00, 999, 'Complete SEO optimization for your website')
ON CONFLICT DO NOTHING;
