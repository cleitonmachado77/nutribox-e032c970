
export const getLeadProgressByStatus = (status: string): number => {
  switch (status) {
    case 'novo':
      return 10;
    case 'qualificado':
      return 30;
    case 'consulta_agendada':
      return 50;
    case 'consulta_realizada':
      return 75;
    case 'em_acompanhamento':
      return 100;
    case 'perdido':
      return 0;
    case 'arquivado':
      return 0;
    default:
      return 0;
  }
};

export const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case 'novo':
      return 'Novo';
    case 'qualificado':
      return 'Qualificado';
    case 'consulta_agendada':
      return 'Consulta Agendada';
    case 'consulta_realizada':
      return 'Consulta Realizada';
    case 'em_acompanhamento':
      return 'Em Acompanhamento';
    case 'perdido':
      return 'Perdido';
    case 'arquivado':
      return 'Arquivado';
    default:
      return status;
  }
};

export const getProgressColor = (progress: number): string => {
  if (progress === 0) return 'bg-gray-400';
  if (progress <= 30) return 'bg-red-400';
  if (progress <= 60) return 'bg-yellow-400';
  if (progress <= 90) return 'bg-blue-400';
  return 'bg-green-400';
};
