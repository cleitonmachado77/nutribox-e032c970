# Evolution API Integration Setup Guide

Este guia explica como configurar e usar a integração com Evolution API para WhatsApp no NutriBox.

## 📋 Pré-requisitos

- Conta no Supabase
- Servidor Evolution API rodando
- Node.js e npm instalados
- Acesso ao painel do Supabase

## 🚀 Configuração Rápida

### 1. Configurar Variáveis de Ambiente no Supabase

1. Acesse o [painel do Supabase](https://supabase.com)
2. Vá em **Settings** > **Edge Functions**
3. Configure as seguintes variáveis de ambiente:

```bash
EVOLUTION_API_URL=http://134.199.202.47:8080
EVOLUTION_API_TOKEN=nutribox-evolution-key-2024
```

### 2. Deploy da Edge Function

```bash
# No diretório do projeto
supabase functions deploy evolution-api-proxy
```

### 3. Verificar Configuração

1. Acesse a página **Conversas** no NutriBox
2. Clique em **Conectar WhatsApp**
3. Escaneie o QR Code com seu celular

## 🔧 Configuração Detalhada

### Servidor Evolution API

O servidor Evolution API deve estar rodando e acessível. Verifique:

```bash
# Teste de conectividade
curl http://134.199.202.47:8080/instance/fetchInstances
```

### Estrutura do Projeto

```
supabase/
├── functions/
│   └── evolution-api-proxy/
│       └── index.ts          # Edge Function principal
└── migrations/
    └── *.sql                 # Migrações do banco

src/
├── hooks/
│   ├── useEvolutionSupabase.ts    # Hook principal
│   └── useSecureEvolutionAPI.ts   # Hook seguro
├── components/
│   ├── WhatsAppConnection.tsx     # Componente de conexão
│   ├── EvolutionAPIErrorHandler.tsx # Tratamento de erros
│   └── EvolutionAPIConfig.tsx     # Configuração
└── pages/
    └── Conversas.tsx              # Página principal
```

## 🔐 Segurança

### Multi-Tenant Architecture

- Cada usuário possui sua própria instância isolada
- Instâncias são nomeadas como `nutribox-{userId}`
- Autenticação via Supabase Auth
- Logs de auditoria para todas as chamadas da API

### Variáveis de Ambiente

```typescript
// Configurações seguras
EVOLUTION_API_URL=http://134.199.202.47:8080
EVOLUTION_API_TOKEN=nutribox-evolution-key-2024
```

## 🐛 Solução de Problemas

### Erro de Autenticação (401)

**Sintoma:** "Authentication failed"

**Solução:**
1. Verifique se o `EVOLUTION_API_TOKEN` está correto
2. Confirme se o usuário está logado
3. Tente fazer logout e login novamente

### Erro de Rede (503)

**Sintoma:** "Network error: Unable to connect to Evolution API"

**Solução:**
1. Verifique se o servidor Evolution API está online
2. Teste a conectividade: `curl http://134.199.202.47:8080`
3. Verifique firewall e configurações de rede

### Endpoint não encontrado (404)

**Sintoma:** "Endpoint not found"

**Solução:**
1. Verifique a versão da Evolution API (v2.2.3)
2. Confirme se os endpoints estão corretos
3. Consulte a documentação da Evolution API

### Timeout (408)

**Sintoma:** "Request to Evolution API timed out"

**Solução:**
1. O servidor está sobrecarregado
2. Tente novamente em alguns segundos
3. Verifique recursos do servidor

### Mixed Content Warning

**Sintoma:** Aviso de segurança no navegador

**Solução:**
1. Configure HTTPS no servidor Evolution API
2. Use um proxy HTTPS (Cloudflare, Nginx)
3. Configure um domínio com certificado SSL

## 📱 Funcionalidades

### Conexão WhatsApp

- QR Code individual por usuário
- Reconexão automática
- Status em tempo real
- Multi-tenant isolado

### Conversas

- Lista de contatos automática
- Busca e filtros
- Mensagens em tempo real
- Histórico de conversas

### Mensagens

- Envio de texto
- Status de entrega
- Timestamps
- Interface responsiva

## 🔄 Endpoints Utilizados

### Instância
- `POST /instance/create` - Criar instância
- `GET /instance/connectionState/{instance}` - Status da conexão
- `GET /instance/connect/{instance}` - Obter QR Code

### Contatos
- `GET /instance/fetchContacts/{instance}` - Buscar contatos
- `GET /chat/fetchChats/{instance}` - Buscar conversas

### Mensagens
- `GET /chat/findMessages/{instance}` - Buscar mensagens
- `POST /message/sendText/{instance}` - Enviar mensagem

## 📊 Monitoramento

### Logs de Auditoria

Todas as chamadas da API são logadas na tabela `api_audit_logs`:

```sql
CREATE TABLE api_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status INTEGER,
  instance_name TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### Métricas

- Status de conexão por usuário
- Contagem de mensagens enviadas
- Tempo de resposta da API
- Erros por tipo

## 🛠️ Desenvolvimento

### Estrutura de Hooks

```typescript
// useEvolutionSupabase.ts
export const useEvolutionSupabase = () => {
  // Estado da sessão
  const [session, setSession] = useState<EvolutionSession | null>(null);
  
  // Métodos principais
  const createInstance = async () => { /* ... */ };
  const checkInstanceStatus = async () => { /* ... */ };
  const fetchContacts = async () => { /* ... */ };
  const sendMessage = async () => { /* ... */ };
  
  return { session, contacts, loading, createInstance, /* ... */ };
};
```

### Tratamento de Erros

```typescript
// EvolutionAPIErrorHandler.tsx
export const EvolutionAPIErrorHandler = ({ error, onRetry, onConfigure }) => {
  // Categorização de erros
  const getErrorType = () => { /* ... */ };
  
  // Passos de solução
  const getTroubleshootingSteps = () => { /* ... */ };
  
  return (/* UI de erro */);
};
```

## 📚 Recursos Adicionais

### Documentação
- [Evolution API Docs](https://doc.evolution-api.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

### Repositórios
- [Evolution API GitHub](https://github.com/EvolutionAPI/evolution-api)
- [Baileys](https://github.com/whiskeysockets/baileys)

### Comunidade
- [Evolution API Discord](https://discord.gg/evolution-api)
- [Supabase Community](https://supabase.com/community)

## 🆘 Suporte

### Logs de Debug

Para debug, verifique os logs no console do navegador:

```javascript
// Logs detalhados
console.log('🔄 Iniciando processo de conexão...');
console.log('📊 Status da instância:', statusData);
console.log('✅ Mensagem enviada com sucesso:', data);
```

### Contato

Se precisar de ajuda:
1. Verifique os logs de erro
2. Consulte a documentação
3. Entre em contato com o suporte técnico

---

**Nota:** Este sistema é multi-tenant e cada usuário possui sua própria instância isolada do WhatsApp, garantindo privacidade e segurança dos dados. 