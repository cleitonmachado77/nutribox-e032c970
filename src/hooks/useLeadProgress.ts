
export const getLeadProgressByStatus = (status: string): number => {
  switch (status) {
    case 'novo':
      return 25; // 1° Lead cadastrado
    case 'qualificado':
      return 25; // Mantém 25% até agendar
    case 'consulta_agendada':
      return 50; // 2° Consulta agendada
    case 'consulta_realizada':
      return 75; // 3° Consulta realizada
    case 'em_acompanhamento':
      return 100; // 4° Paciente em acompanhamento
    case 'perdido':
      return 0; // Lead perdido
    default:
      return 25;
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
    default:
      return status;
  }
};

export const getProgressColor = (progress: number): string => {
  if (progress === 0) return 'bg-red-500';
  if (progress <= 25) return 'bg-cyan-500';
  if (progress <= 50) return 'bg-amber-500';
  if (progress <= 75) return 'bg-orange-500';
  return 'bg-green-500';
};
