
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface PatientGoal {
  id: string;
  patientId: string;
  patientName: string;
  goalType: 'weight' | 'hydration' | 'exercise' | 'diet' | 'custom';
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue' | 'paused';
  progress: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdate: string;
}

export const GoalsTracking = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<PatientGoal[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'Maria Silva',
      goalType: 'weight',
      title: 'Perder 5kg',
      targetValue: 65,
      currentValue: 68,
      unit: 'kg',
      deadline: '2024-03-15',
      status: 'active',
      progress: 60,
      trend: 'improving',
      lastUpdate: '2024-01-10'
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'João Santos',
      goalType: 'hydration',
      title: 'Beber 2L de água por dia',
      targetValue: 2000,
      currentValue: 1500,
      unit: 'ml',
      deadline: '2024-02-28',
      status: 'active',
      progress: 75,
      trend: 'stable',
      lastUpdate: '2024-01-12'
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Ana Costa',
      goalType: 'exercise',
      title: 'Exercitar 3x por semana',
      targetValue: 3,
      currentValue: 2,
      unit: 'vezes/semana',
      deadline: '2024-04-01',
      status: 'active',
      progress: 67,
      trend: 'declining',
      lastUpdate: '2024-01-08'
    }
  ]);

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-yellow-500 rounded-full" />;
    }
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case 'weight': return 'Peso';
      case 'hydration': return 'Hidratação';
      case 'exercise': return 'Exercício';
      case 'diet': return 'Dieta';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const progress = Math.min((newValue / goal.targetValue) * 100, 100);
        const status = progress >= 100 ? 'completed' : goal.status;
        return {
          ...goal,
          currentValue: newValue,
          progress,
          status,
          lastUpdate: new Date().toISOString().split('T')[0]
        };
      }
      return goal;
    }));

    toast({
      title: "Meta atualizada",
      description: "Progresso da meta foi atualizado com sucesso"
    });
  };

  const statsData = {
    totalGoals: goals.length,
    completedGoals: goals.filter(g => g.status === 'completed').length,
    activeGoals: goals.filter(g => g.status === 'active').length,
    overdueGoals: goals.filter(g => g.status === 'overdue').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Acompanhamento de Metas</h2>
          <p className="text-gray-600">Monitore o progresso das metas dos seus pacientes</p>
        </div>
        <Button onClick={() => setShowNewGoalForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Estatísticas das Metas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Metas</p>
                <p className="text-2xl font-bold">{statsData.totalGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold">{statsData.completedGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Ativas</p>
                <p className="text-2xl font-bold">{statsData.activeGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Em Atraso</p>
                <p className="text-2xl font-bold">{statsData.overdueGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-500" />
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <p className="text-sm text-gray-600">{goal.patientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                  <Badge variant="outline">
                    {getGoalTypeLabel(goal.goalType)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progresso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span className="font-medium">{goal.progress.toFixed(0)}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Atual: {goal.currentValue} {goal.unit}</span>
                  <span>Meta: {goal.targetValue} {goal.unit}</span>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(goal.trend)}
                  <span className="capitalize">Tendência: {goal.trend}</span>
                </div>
              </div>

              {/* Atualização rápida */}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  type="number"
                  placeholder={`Valor atual (${goal.unit})`}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const newValue = parseFloat((e.target as HTMLInputElement).value);
                      if (!isNaN(newValue)) {
                        updateGoalProgress(goal.id, newValue);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
