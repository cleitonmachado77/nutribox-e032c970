
# WhatsApp SaaS - Evolution API Integration

## Visão Geral

Este é um SaaS completo para gerenciamento de conversas WhatsApp usando Evolution API, n8n para automação e Supabase para armazenamento de dados.

## Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Evolution     │    │      n8n        │
│   (React)       │◄──►│      API        │◄──►│   (Automation)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                               │
         ▼                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase                                 │
│                    (Database + Auth)                            │
└─────────────────────────────────────────────────────────────────┘
```

## Funcionalidades Implementadas

### 1. Gestão de Instâncias
- ✅ Listar instâncias disponíveis
- ✅ Criar nova instância
- ✅ Deletar instância
- ✅ Reiniciar instância
- ✅ Monitorar status de conexão

### 2. Gestão de Contatos
- ✅ Listar todos os contatos
- ✅ Buscar contatos por nome/telefone
- ✅ Exibir foto de perfil
- ✅ Mostrar status online/offline

### 3. Gestão de Grupos
- ✅ Listar grupos
- ✅ Criar novos grupos
- ✅ Gerenciar participantes
- ✅ Visualizar informações do grupo

### 4. Sistema de Mensagens
- ✅ Enviar mensagens de texto
- ✅ Receber mensagens em tempo real
- ✅ Histórico de conversas
- ✅ Suporte a mídia (imagens, vídeos, documentos)
- ✅ Indicadores de leitura

### 5. Automação com n8n
- ✅ Webhook para receber eventos
- ✅ Processamento automático de mensagens
- ✅ Respostas automáticas
- ✅ Integração com Supabase

### 6. Armazenamento no Supabase
- ✅ Tabela de mensagens
- ✅ Controle de acesso (RLS)
- ✅ Histórico persistente
- ✅ Sincronização em tempo real

## Configuração

### 1. Evolution API
- **URL**: http://134.199.202.47:8080
- **Token**: 429683C4C977415CAAFCCE10F7D57E11
- **Endpoints principais**:
  - `GET /instance/fetchInstances` - Listar instâncias
  - `POST /instance/create` - Criar instância
  - `GET /contact/{instance}/fetchContacts` - Listar contatos
  - `GET /group/{instance}/fetchGroups` - Listar grupos
  - `POST /message/sendText/{instance}` - Enviar mensagem

### 2. Supabase
Tabelas criadas:
- `messages` - Armazenar mensagens
- `whatsapp_instances` - Configurações de instâncias

### 3. n8n Workflow
- Webhook endpoint: `/webhook/whatsapp`
- Processa eventos `message.upsert`
- Salva mensagens no Supabase
- Envia respostas automáticas

## Uso da Aplicação

### Interface Principal
A aplicação está dividida em duas seções:

1. **Sidebar (Esquerda)**:
   - Seletor de instância
   - Tabs: Contatos, Grupos, Configurações
   - Busca por contatos/grupos
   - Gerenciamento de instâncias

2. **Área Principal (Direita)**:
   - Cabeçalho da conversa
   - Histórico de mensagens
   - Campo para envio de mensagens
   - Botões para mídia

### Fluxo de Uso

1. **Primeira conexão**:
   - Criar nova instância
   - Escanear QR Code no WhatsApp
   - Aguardar conexão

2. **Conversar**:
   - Selecionar contato/grupo
   - Visualizar histórico
   - Enviar mensagens

3. **Gerenciar**:
   - Criar grupos
   - Configurar webhooks
   - Monitorar instâncias

## Endpoints da Evolution API

### Instâncias
```bash
# Listar instâncias
GET /instance/fetchInstances

# Criar instância
POST /instance/create
{
  "instanceName": "minha-instancia",
  "token": "TOKEN",
  "qrcode": true
}

# Status da instância
GET /instance/connectionState/{instance}

# Deletar instância
DELETE /instance/delete/{instance}
```

### Contatos
```bash
# Listar contatos
GET /contact/{instance}/fetchContacts

# Buscar contato específico
GET /contact/{instance}/findContact
```

### Grupos
```bash
# Listar grupos
GET /group/{instance}/fetchGroups

# Criar grupo
POST /group/{instance}/create
{
  "subject": "Nome do Grupo",
  "participants": ["5511999999999", "5511888888888"]
}
```

### Mensagens
```bash
# Enviar texto
POST /message/sendText/{instance}
{
  "number": "5511999999999",
  "text": "Olá mundo!"
}

# Enviar mídia
POST /message/sendMedia/{instance}
{
  "number": "5511999999999",
  "mediaUrl": "https://exemplo.com/imagem.jpg",
  "caption": "Legenda da imagem"
}

# Buscar mensagens
GET /chat/{instance}/findMessages?where[key.remoteJid]=5511999999999@s.whatsapp.net
```

### Webhooks
```bash
# Configurar webhook
POST /webhook/{instance}
{
  "url": "https://meu-n8n.com/webhook/whatsapp",
  "events": ["message.upsert", "connection.update"]
}
```

## Schema do Supabase

### Tabela: messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela: whatsapp_instances
```sql
CREATE TABLE whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  instance_name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'disconnected',
  phone_number TEXT,
  webhook_url TEXT,
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Configuração do n8n

### 1. Credenciais
- **Evolution API**: Header Auth com `apikey: TOKEN`
- **Supabase**: URL + anon key

### 2. Workflow
1. **Webhook Trigger**: Recebe eventos da Evolution API
2. **Filter**: Filtra apenas eventos `message.upsert`
3. **Code Node**: Processa dados da mensagem
4. **Supabase Node**: Salva mensagem no banco
5. **HTTP Request**: Envia resposta automática (opcional)

### 3. Configuração no Evolution API
```bash
POST /webhook/{instance}
{
  "url": "https://seu-n8n.com/webhook/whatsapp",
  "events": ["message.upsert"]
}
```

## Segurança

### CORS
Para desenvolvimento, use proxy local:
```javascript
// vite.config.ts
server: {
  proxy: {
    '/api/evolution': {
      target: 'http://134.199.202.47:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/evolution/, '')
    }
  }
}
```

### Row Level Security (RLS)
```sql
-- Política para mensagens
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Deployment

### Frontend
1. Build da aplicação React
2. Deploy no Vercel/Netlify
3. Configurar variáveis de ambiente

### n8n
1. Deploy em servidor/cloud
2. Configurar credenciais
3. Importar workflow
4. Ativar webhook

### Evolution API
- Servidor já configurado: http://134.199.202.47:8080
- Token: 429683C4C977415CAAFCCE10F7D57E11

## Troubleshooting

### Problemas Comuns

1. **Mixed Content Error**:
   - Use HTTPS na Evolution API em produção
   - Configure proxy para desenvolvimento

2. **CORS Issues**:
   - Configure proxy no Vite
   - Use headers corretos

3. **Webhook não recebe dados**:
   - Verifique URL do webhook
   - Confirme configuração na Evolution API

4. **Mensagens não salvam**:
   - Verifique RLS policies
   - Confirme schema do Supabase

## Próximos Passos

1. **Melhorias na UI**:
   - Dark mode
   - Notificações push
   - Interface mobile

2. **Funcionalidades Avançadas**:
   - Chatbot com IA
   - Templates de mensagem
   - Agendamento de mensagens

3. **Analytics**:
   - Dashboard de métricas
   - Relatórios de conversas
   - Análise de engajamento

4. **Integrações**:
   - CRM systems
   - E-commerce platforms
   - Payment gateways

## Suporte

Para dúvidas e suporte:
- Documentação Evolution API: https://doc.evolutionapi.com
- Documentação n8n: https://docs.n8n.io
- Documentação Supabase: https://supabase.com/docs
