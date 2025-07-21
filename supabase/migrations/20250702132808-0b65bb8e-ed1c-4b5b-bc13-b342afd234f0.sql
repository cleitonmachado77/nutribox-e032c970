-- Criar tabelas para WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  qr_code TEXT,
  is_connected BOOLEAN DEFAULT false,
  phone_number TEXT,
  session_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own WhatsApp sessions" 
ON whatsapp_sessions 
FOR ALL
USING (auth.uid() = user_id);

-- Criar tabela de conversas
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_name TEXT,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own conversations" 
ON whatsapp_conversations 
FOR ALL
USING (auth.uid() = user_id);

-- Criar tabela de mensagens
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  message_id TEXT,
  sender_type TEXT, -- 'user' ou 'contact'
  content TEXT,
  message_type TEXT DEFAULT 'text',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  is_read BOOLEAN DEFAULT false,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage messages from their conversations" 
ON whatsapp_messages 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM whatsapp_conversations 
    WHERE whatsapp_conversations.id = whatsapp_messages.conversation_id 
    AND whatsapp_conversations.user_id = auth.uid()
  )
);