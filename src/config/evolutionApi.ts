// Configuração da Evolution API
// Servidor DigitalOcean configurado

export const EVOLUTION_CONFIG = {
  // URL segura do proxy Supabase (remove exposição de credenciais)
  API_URL: '/api/evolution-proxy',
  
  // Token removido por segurança - agora gerenciado via Supabase Secrets
  API_TOKEN: '', // Removido por segurança
  
  // Configurações da instância
  INSTANCE_CONFIG: {
    qrcode: true,
    integration: 'WHATSAPP-BAILEYS',
    webhookUrl: '', // Opcional: URL para receber webhooks
    webhookByEvents: false,
    webhookBase64: false
  },
  
  // Headers padrão para as requisições (agora seguro via proxy)
  getHeaders: () => ({
    'Content-Type': 'application/json',
    // Credenciais removidas - agora gerenciadas via Supabase Edge Function
  })
};

// Função para validar a configuração (agora segura)
export const validateEvolutionConfig = (): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!EVOLUTION_CONFIG.API_URL) {
    errors.push('Configure a URL do proxy Evolution API');
  }
  
  // Não verificamos mais o token aqui pois é gerenciado via Supabase Secrets
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Função para gerar nome de instância único por usuário (multi-tenant)
export const generateInstanceName = (userId: string): string => {
  return `nutribox-${userId.slice(0, 8)}`;
};