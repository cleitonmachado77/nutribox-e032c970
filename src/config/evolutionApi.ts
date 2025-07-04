// Configuração da Evolution API
// Servidor DigitalOcean configurado

export const EVOLUTION_CONFIG = {
  // URL do servidor DigitalOcean
  API_URL: 'http://134.199.202.47:8080',
  
  // Token de acesso da Evolution API
  API_TOKEN: '429683C4C977415CAAFCCE10F7D57E11',
  
  // Configurações da instância
  INSTANCE_CONFIG: {
    qrcode: true,
    integration: 'WHATSAPP-BAILEYS',
    webhookUrl: '', // Opcional: URL para receber webhooks
    webhookByEvents: false,
    webhookBase64: false
  },
  
  // Headers padrão para as requisições
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'apikey': EVOLUTION_CONFIG.API_TOKEN
  })
};

// Função para validar a configuração
export const validateEvolutionConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!EVOLUTION_CONFIG.API_URL || EVOLUTION_CONFIG.API_URL === 'http://localhost:8080') {
    errors.push('Configure a URL do servidor Evolution API');
  }
  
  if (!EVOLUTION_CONFIG.API_TOKEN) {
    errors.push('Configure o token de acesso da Evolution API');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Função para gerar nome de instância único por usuário (multi-tenant)
export const generateInstanceName = (userId: string): string => {
  return `nutribox-${userId.slice(0, 8)}`;
};