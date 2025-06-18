
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePatientData } from "@/hooks/usePatientData";
import { useNutriCoachAI } from "@/hooks/useNutriCoachAI";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Phone, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain,
  MessageSquare,
  Target,
  Clock,
  Send
} from "lucide-react";

export const PatientProfiles = () => {
  const { patients, insights, loading } = usePatientData();
  const { generateMessage, loading: aiLoading } = useNutriCoachAI();
  const { toast } = useToast();

  const sendPersonalizedMessage = async (patientId: string, patientName: string, patientPhone: string) => {
    const patientInsight = insights.find(i => i.patient_id === patientId);
    
    try {
      const message = await generateMessage({
        action: 'generate_motivational',
        patientName,
        patientPhone,
        patientData: {
          engagement_level: patientInsight?.engagement_level,
          recommendations: patientInsight?.recommendations,
          behavioral_patterns: patientInsight?.behavioral_patterns
        }
      });

      if (message) {
        toast({
          title: "Mensagem Enviada",
          description: `Mensagem personalizada enviada para ${patientName}`
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem personalizada",
        variant: "destructive"
      });
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Perfis dos Pacientes</h2>
          <p className="text-gray-600">Análise personalizada com IA para cada paciente</p>
        </div>
        <Badge variant="outline" className="text-purple-600">
          <Brain className="w-4 h-4 mr-1" />
          {patients.length} Perfis Analisados
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patients.map((patient) => {
          const insight = insights.find(i => i.patient_id === patient.id);
          
          return (
            <Card key={patient.id} className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={`${getEngagementColor(insight?.engagement_level || 'low')} text-white`}
                  >
                    {insight?.engagement_level || 'low'} engagement
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {/* Métricas de Engajamento */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score de Engajamento</span>
                      <span className="font-medium">{patient.engagement_score || 0}%</span>
                    </div>
                    <Progress value={patient.engagement_score || 0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Resposta</span>
                      <span className="font-medium">{insight?.response_rate || 0}%</span>
                    </div>
                    <Progress value={insight?.response_rate || 0} className="h-2" />
                  </div>
                </div>

                {/* Dados Comportamentais */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Análise Comportamental
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Interações Totais:</span>
                      <span className="font-medium">{insight?.interaction_frequency || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horário Preferido:</span>
                      <span className="font-medium capitalize">{insight?.preferred_time || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tendência:</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(patient.progress_data?.improvement_trend || 'stable')}
                        <span className="font-medium capitalize">
                          {patient.progress_data?.improvement_trend || 'stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recomendações da IA */}
                {insight?.recommendations && insight.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Recomendações da IA
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {insight.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => sendPersonalizedMessage(patient.id, patient.name, patient.phone)}
                    disabled={aiLoading}
                    className="flex-1"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Mensagem IA
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Ver Conversas
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {patients.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Nenhum paciente encontrado</h3>
            <p className="text-gray-600">
              Converta leads em pacientes para começar a análise com IA
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
