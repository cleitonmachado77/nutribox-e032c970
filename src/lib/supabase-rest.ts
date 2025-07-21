// Configuração para requisições REST diretas ao Supabase
// Usa a chave anon para ambos apikey e Authorization

const SUPABASE_URL = "https://wubohcrfydjtzphnoyqu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Ym9oY3JmeWRqdHpwaG5veXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTYzNTIsImV4cCI6MjA2NDI5MjM1Mn0.4o_2Qe3sewkScLaZ78EDBNZCKuiSrS-YD3FnkbpkX6g";

export const supabaseRestHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json"
};

export const supabaseRestUrl = SUPABASE_URL;

// Função utilitária para fazer requisições REST para envios_programados
export const enviosProgramadosRest = {
  // Buscar registros
  async get(filters?: Record<string, any>) {
    let url = `${SUPABASE_URL}/rest/v1/envios_programados`;
    
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, `eq.${value}`);
      });
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: supabaseRestHeaders
    });

    if (!response.ok) {
      throw new Error(`Erro REST GET: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Inserir registro
  async post(data: any) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/envios_programados`, {
      method: 'POST',
      headers: supabaseRestHeaders,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Erro REST POST: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Atualizar registro
  async patch(filters: Record<string, any>, data: any) {
    let url = `${SUPABASE_URL}/rest/v1/envios_programados`;
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });
    url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: supabaseRestHeaders,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Erro REST PATCH: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Deletar registro
  async delete(filters: Record<string, any>) {
    let url = `${SUPABASE_URL}/rest/v1/envios_programados`;
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });
    url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: supabaseRestHeaders
    });

    if (!response.ok) {
      throw new Error(`Erro REST DELETE: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
};