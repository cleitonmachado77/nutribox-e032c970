
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { Bot, MessageSquare, Calendar, TrendingUp, Activity } from "lucide-react";

interface PatientCoachHistoryTabProps {
  selectedPatient: Paciente;
}

export const PatientCoachHistoryTab = ({ selectedPatient }: PatientCoachHistoryTabProps) => {
  // Simulação de dados do histórico do NutriCoach
  const coachInteractions = [
    {
      id: 1,
      date: "2024-01-15",
      time: "09:30",
      type: "questionario_comportamental",
      title: "Questionário Comportamental",
      status: "respondido",
      responses: {
        consistencia_plano: "sim",
        frequencia_refeicoes: 3,
        tempo_refeicao: 2,
        vegetais_frutas: 3,
        ingesta_liquido: 1
      },
      coachFeedback: "Ótimo progresso na consistência do plano! Vamos trabalhar na hidratação."
    },
    {
      id: 2,
      date: "2024-01-14",
      time: "19:45",
      type: "questionario_bem_estar",
      title: "Questionário de Bem-Estar",
      status: "respondido",
      responses: {
        energia_fisica: 2,
        atividade_fisica: "sim",
        qualidade_sono: 1,
        confianca_jornada: 2,
        satisfacao_corpo: 2
      },
      coachFeedback: "Nota-se melhora na energia! Vamos focar na qualidade do sono."
    },
    {
      id: 3,
      date: "2024-01-13",
      time: "08:15",
      type: "lembrete",
      title: "Lembrete de Hidratação",
      status: "enviado",
      message: "Bom dia! 💧 Lembre-se de beber água ao longo do dia. Meta: 2,3L!"
    },
    {
      id: 4,
      date: "2024-01-12",
      time: "20:00",
      type: "motivacional",
      title: "Mensagem Motivacional",
      status: "enviado",
      message: "Parabéns pelo progresso desta semana! 🌟 Pequenos passos levam a grandes conquistas!"
    }
  ];

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "questionario_comportamental":
      case "questionario_bem_estar":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "lembrete":
        return <Calendar className="w-5 h-5 text-orange-600" />;
      case "motivacional":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      default:
        return <Bot className="w-5 h-5 text-purple-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "respondido":
        return "bg-green-100 text-green-800";
      case "enviado":
        return "bg-blue-100 text-blue-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas do NutriCoach */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-purple-200">
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">12</div>
            <div className="text-sm text-purple-600">Interações Totais</div>
          </CardContent>
        </Card>

        <Card className="border border-purple-200">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">8</div>
            <div className="text-sm text-blue-600">Questionários</div>
          </CardContent>
        </Card>

        <Card className="border border-purple-200">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">75%</div>
            <div className="text-sm text-green-600">Taxa de Resposta</div>
          </CardContent>
        </Card>

        <Card className="border border-purple-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-800">3</div>
            <div className="text-sm text-orange-600">Dias Consecutivos</div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Interações */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Histórico de Interações NutriCoach
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {coachInteractions.map((interaction) => (
              <div key={interaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 bg-purple-100">
                    <AvatarFallback className="bg-purple-100">
                      {getInteractionIcon(interaction.type)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{interaction.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(interaction.status)}>
                          {interaction.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(interaction.date).toLocaleDateString('pt-BR')} às {interaction.time}
                        </span>
                      </div>
                    </div>
                    
                    {interaction.message && (
                      <p className="text-gray-700 mb-3">{interaction.message}</p>
                    )}
                    
                    {interaction.responses && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Respostas:</h5>
                        <div className="space-y-1">
                          {Object.entries(interaction.responses).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {interaction.coachFeedback && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Feedback do NutriCoach:</span>
                        </div>
                        <p className="text-blue-700 text-sm">{interaction.coachFeedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise de Progresso pelo Coach */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Análise de Progresso NutriCoach
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Pontos Fortes Identificados:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Boa consistência no plano alimentar (75%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Excelente consumo de frutas e vegetais</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Melhora na energia física</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Áreas para Melhoria:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Aumentar ingestão de líquidos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Melhorar qualidade do sono</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Aumentar frequência de atividade física</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
