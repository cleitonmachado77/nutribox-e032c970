
export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  objetivo?: string;
  objetivo_tag_id?: string;
  cidade?: string;
  estado?: string;
  status: string;
  foto_perfil?: string;
  data_conversao?: string;
  ultima_consulta?: string;
  proxima_consulta?: string;
  peso?: string;
  altura?: string;
  imc?: string;
  plano_alimentar?: string;
  anotacoes?: string;
  progresso: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  idade?: number;
  data_nascimento?: string;
  sexo?: string;
  consultas_realizadas?: number;
  objetivo_tag?: {
    id: string;
    nome: string;
    cor: string;
  };
}

export interface LeadsStats {
  totalLeads: number;
  leadsQualificados: number;
  consultasAgendadas: number;
  consultasRealizadas: number;
  estadosData: Array<{
    estado: string;
    pacientes: number;
    name: string;
  }>;
  objetivosData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlyData: Array<{
    month: string;
    leads: number;
    consultas: number;
  }>;
  leads: Lead[];
}
