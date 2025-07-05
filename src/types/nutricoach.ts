
export type PlanStatus = 'active' | 'inactive';
export type QuestionnaireType = 'daily' | 'weekly';
export type ResponseStatus = 'alert' | 'warning' | 'success';

export interface PatientData {
  id: string;
  nome: string;
  telefone: string;
  planStatus: PlanStatus;
  lastDailyMessage?: string;
  lastWeeklyMessage?: string;
  isSelected: boolean;
}

export interface QuestionnaireResponse {
  id: string;
  patient_id: string;
  patient_name: string;
  type: QuestionnaireType;
  responses: string[];
  score: number;
  feedback: string;
  status: ResponseStatus;
  created_at: string;
}

export interface ScheduledSending {
  id: string;
  patient_id: string;
  type: QuestionnaireType;
  is_active: boolean;
  last_sent?: string;
}
