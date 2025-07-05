
-- Criar tabela para armazenar mensagens do WhatsApp
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instance_name TEXT NOT NULL,
  message_id TEXT UNIQUE,
  from_jid TEXT NOT NULL,
  to_jid TEXT NOT NULL,
  message_text TEXT,
  message_type TEXT DEFAULT 'text',
  media_url TEXT,
  media_caption TEXT,
  message_timestamp TIMESTAMPTZ NOT NULL,
  from_me BOOLEAN NOT NULL DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_instance ON messages(instance_name);
CREATE INDEX IF NOT EXISTS idx_messages_from_jid ON messages(from_jid);
CREATE INDEX IF NOT EXISTS idx_messages_to_jid ON messages(to_jid);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(message_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_message_id ON messages(message_id);

-- Habilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias mensagens
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem suas próprias mensagens
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias mensagens
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar tabela para armazenar configurações de instâncias
CREATE TABLE IF NOT EXISTS whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instance_name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'disconnected',
  phone_number TEXT,
  profile_picture_url TEXT,
  qr_code TEXT,
  webhook_url TEXT,
  is_connected BOOLEAN DEFAULT false,
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para instâncias
CREATE INDEX IF NOT EXISTS idx_instances_user_id ON whatsapp_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_instances_name ON whatsapp_instances(instance_name);

-- RLS para instâncias
ALTER TABLE whatsapp_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own instances" ON whatsapp_instances
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger para instâncias
CREATE TRIGGER update_instances_updated_at BEFORE UPDATE ON whatsapp_instances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
