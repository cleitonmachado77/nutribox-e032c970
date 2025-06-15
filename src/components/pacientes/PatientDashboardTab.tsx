
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Paciente } from "@/hooks/usePacientes";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Activity,
  Heart,
  Brain,
  Smile,
  BarChart3
} from "lucide-react";

interface PatientDashboardTabProps {
  selectedPatient: Paciente;
}

export const PatientDashboardTab = ({ selectedPatient }: PatientDashboardTabProps) => {
  // Simulação de dados de progresso
  const progressData = {
    weight: { current: 78, goal: 70, initial: 85 },
    physicalGoals: { achieved: 75, total: 100 },
    behavioralGoals: { achieved: 60, total: 100 },
    wellnessGoals: { achieved: 80, total: 100 },
    adherence: 85
  };

  return (
    <div className="space-y-6">
      {/* Header com informações principais */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Painel de Progresso - {selectedPatient.lead.nome}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Progresso Geral */}
            <Card className="border border-purple-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">{selectedPatient.lead.progresso}%</div>
                <div className="text-sm text-purple-600">Progresso Geral</div>
                <Progress value={selectedPatient.lead.progresso} className="mt-2" />
              </CardContent>
            </Card>

            {/* Peso Atual */}
            <Card className="border border-purple-200">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{progressData.weight.current}kg</div>
                <div className="text-sm text-green-600">Peso Atual</div>
                <div className="text-xs text-gray-500 mt-1">Meta: {progressData.weight.goal}kg</div>
              </CardContent>
            </Card>

            {/* Aderência ao Plano */}
            <Card className="border border-purple-200">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">{progressData.adherence}%</div>
                <div className="text-sm text-blue-600">Aderência</div>
                <Progress value={progressData.adherence} className="mt-2" />
              </CardContent>
            </Card>

            {/* Consultas Realizadas */}
            <Card className="border border-purple-200">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-800">2</div>
                <div className="text-sm text-orange-600">Consultas</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Metas por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metas Físicas */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Metas Físicas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Peso Atual</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {progressData.weight.current}kg
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">IMC</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {selectedPatient.lead.imc || 'N/A'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">% Gordura</span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                18%
              </Badge>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Físico</span>
                <span>{progressData.physicalGoals.achieved}%</span>
              </div>
              <Progress value={progressData.physicalGoals.achieved} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Metas Comportamentais */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Metas Comportamentais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Consistência do Plano</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                69%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Frequência de Refeições</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Boa
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tempo de Refeição</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                Moderado
              </Badge>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Comportamental</span>
                <span>{progressData.behavioralGoals.achieved}%</span>
              </div>
              <Progress value={progressData.behavioralGoals.achieved} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Metas de Bem-Estar */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5" />
              Metas de Bem-Estar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Energia Física</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Boa
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Qualidade do Sono</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                Baixa
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Atividade Física</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                42%
              </Badge>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Bem-Estar</span>
                <span>{progressData.wellnessGoals.achieved}%</span>
              </div>
              <Progress value={progressData.wellnessGoals.achieved} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Evolução do Peso
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600">Gráfico de evolução será implementado</p>
              <p className="text-sm text-gray-500">Mostrará a evolução do peso, IMC e medidas ao longo do tempo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
