// Configuração da Evolution API
// Servidor DigitalOcean configurado

export const EVOLUTION_CONFIG = {
  // Configurações da instância
  INSTANCE_CONFIG: {
    qrcode: true,
    integration: 'WHATSAPP-BAILEYS',
    webhookUrl: '', // Opcional: URL para receber webhooks
    webhookByEvents: false,
    webhookBase64: false
  }
};

// Função para validar a configuração (agora segura)
export const validateEvolutionConfig = (): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validações básicas - as credenciais são gerenciadas via Supabase Edge Function
  
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