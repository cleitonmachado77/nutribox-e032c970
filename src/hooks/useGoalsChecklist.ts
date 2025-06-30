
import { useState } from 'react';
import { usePatientCurrentData } from './usePatientCurrentData';

export interface Goal {
  id: string;
  type: 'physical' | 'behavioral' | 'wellness';
  title: string;
  description: string;
  targetValue?: string;
  currentValue?: string;
  deadline?: Date;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  category: 'daily' | 'weekly' | 'monthly';
  title: string;
  description: string;
  completed: boolean;
  frequency?: string;
}

export interface GoalsChecklistData {
  goals: Goal[];
  checklist: ChecklistItem[];
  currentData: any;
  generatedAt: Date;
}

export const useGoalsChecklist = (patientId: string, consultationId?: string) => {
  const { currentData } = usePatientCurrentData(patientId);
  const [goalsChecklist, setGoalsChecklist] = useState<GoalsChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateGoalsChecklist = () => {
    if (!consultationId) return null;
    
    setIsLoading(true);
    try {
      const goals = generateDefaultGoals();
      const checklist = generateDefaultChecklist();
      
      const data: GoalsChecklistData = {
        goals,
        checklist,
        currentData,
        generatedAt: new Date()
      };

      setGoalsChecklist(data);
      return data;
    } catch (error) {
      console.error('Error generating goals and checklist:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultGoals = (): Goal[] => {
    return [
      {
        id: 'goal-1',
        type: 'physical',
        title: 'Redução de Peso',
        description: 'Alcançar peso ideal através de alimentação balanceada',
        targetValue: 'Reduzir 5kg',
        currentValue: currentData?.peso_atual || 'Não informado',
        completed: false
      },
      {
        id: 'goal-2',
        type: 'physical',
        title: 'Melhora da Composição Corporal',
        description: 'Reduzir percentual de gordura corporal',
        targetValue: 'Atingir 20% de gordura corporal',
        currentValue: currentData?.gordura_corporal || 'Não informado',
        completed: false
      },
      {
        id: 'goal-3',
        type: 'behavioral',
        title: 'Consistência Alimentar',
        description: 'Manter disciplina com o plano alimentar',
        targetValue: '90% de aderência ao plano',
        currentValue: currentData?.plan_consistency || 'Não informado',
        completed: false
      },
      {
        id: 'goal-4',
        type: 'wellness',
        title: 'Melhora da Energia',
        description: 'Aumentar disposição física no dia a dia',
        targetValue: 'Sentir-se energizado durante todo o dia',
        currentValue: currentData?.physical_energy || 'Não informado',
        completed: false
      }
    ];
  };

  const generateDefaultChecklist = (): ChecklistItem[] => {
    return [
      {
        id: 'check-1',
        category: 'daily',
        title: 'Seguir horários das refeições',
        description: 'Fazer as refeições nos horários estabelecidos',
        completed: false,
        frequency: 'Todos os dias'
      },
      {
        id: 'check-2',
        category: 'daily',
        title: 'Beber água suficiente',
        description: 'Consumir pelo menos 2 litros de água por dia',
        completed: false,
        frequency: 'Todos os dias'
      },
      {
        id: 'check-3',
        category: 'daily',
        title: 'Consumir frutas e verduras',
        description: 'Incluir pelo menos 5 porções de frutas e verduras',
        completed: false,
        frequency: 'Todos os dias'
      },
      {
        id: 'check-4',
        category: 'weekly',
        title: 'Praticar atividade física',
        description: 'Realizar exercícios físicos regulares',
        completed: false,
        frequency: '3 vezes por semana'
      },
      {
        id: 'check-5',
        category: 'weekly',
        title: 'Controlar o peso',
        description: 'Verificar o peso corporal',
        completed: false,
        frequency: '1 vez por semana'
      },
      {
        id: 'check-6',
        category: 'monthly',
        title: 'Avaliação nutricional',
        description: 'Realizar consulta de acompanhamento',
        completed: false,
        frequency: '1 vez por mês'
      }
    ];
  };

  const exportGoalsChecklist = () => {
    if (!goalsChecklist) return;

    const content = generateGoalsChecklistContent(goalsChecklist);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `metas_checklist_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateGoalsChecklistContent = (data: GoalsChecklistData): string => {
    let content = `METAS E CHECKLIST DE ACOMPANHAMENTO\n`;
    content += `Gerado em: ${data.generatedAt.toLocaleDateString('pt-BR')}\n\n`;

    content += `METAS ESTABELECIDAS:\n`;
    data.goals.forEach((goal, index) => {
      content += `${index + 1}. ${goal.title}\n`;
      content += `   Descrição: ${goal.description}\n`;
      content += `   Meta: ${goal.targetValue}\n`;
      content += `   Situação atual: ${goal.currentValue}\n`;
      content += `   Status: ${goal.completed ? 'Concluída' : 'Em andamento'}\n\n`;
    });

    content += `CHECKLIST DE ACOMPANHAMENTO:\n\n`;
    
    const checklistByCategory = data.checklist.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ChecklistItem[]>);

    Object.entries(checklistByCategory).forEach(([category, items]) => {
      const categoryTitle = category === 'daily' ? 'DIÁRIO' : 
                           category === 'weekly' ? 'SEMANAL' : 'MENSAL';
      content += `${categoryTitle}:\n`;
      items.forEach(item => {
        content += `□ ${item.title}\n`;
        content += `  ${item.description}\n`;
        content += `  Frequência: ${item.frequency}\n\n`;
      });
    });

    return content;
  };

  return {
    goalsChecklist,
    generateGoalsChecklist,
    exportGoalsChecklist,
    isLoading
  };
};
