
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePatientData } from "@/hooks/usePatientData";
import { useNutriCoachAI } from "@/hooks/useNutriCoachAI";
import { useToast } from "@/hooks/use-toast";
import { usePacientes } from "@/hooks/usePacientes";
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
  Send,
  Calendar,
  Mail,
  MapPin,
  Scale,
  Ruler
} from "lucide-react";

export const PatientProfiles = () => {
  const { patients: aiPatients, insights, loading: aiLoading } = usePatientData();
  const { data: cadastredPatients = [], isLoading: patientsLoading } = usePacientes();
  const { generateMessage, loading: aiMessageLoading } = useNutriCoachAI();
  const { toast } = useToast();

  const sendPersonalizedMessage = async (patientId: string, patientName: string, patientPhone: string) => {
    const patientInsight = insights.find(i => i.patient_id === patientId);
    const cadastredPatient = cadastredPatients.find(p => p.lead.telefone === patientPhone);
    
    try {
      const message = await generateMessage({
        action: 'generate_motivational',
        patientName,
        patientPhone,
        patientData: {
          engagement_level: patientInsight?.engagement_level,
          recommendations: patientInsight?.recommendations,
          behavioral_patterns: patientInsight?.behavioral_patterns,
          weight: cadastredPatient?.lead.peso,
          height: cadastredPatient?.lead.altura,
          imc: cadastredPatient?.lead.imc,
          objective: cadastredPatient?.lead.objetivo,
          progress: cadastredPatient?.lead.progresso
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

  const getStatusBadgeColor = (status: string) => {
    return status === 'ativo' ? 'bg-green-500' : 'bg-gray-500';
  };

  // Combinar dados dos pacientes cadastrados com insights da IA
  const combinedPatients = cadastredPatients.map(cadastredPatient => {
    const aiPatient = aiPatients.find(ai => ai.phone === cadastredPatient.lead.telefone);
    const insight = insights.find(i => i.patient_id === cadastredPatient.id);
    
    return {
      ...cadastredPatient,
      aiData: aiPatient,
      insight: insight
    };
  });

  if (patientsLoading || aiLoading) {
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
          <p className="text-gray-600">Análise personalizada com IA para cada paciente ativo</p>
        </div>
        <Badge variant="outline" className="text-purple-600">
          <Brain className="w-4 h-4 mr-1" />
          {combinedPatients.length} Pacientes Ativos
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {combinedPatients.map((patient) => {
          const lead = patient.lead;
          const insight = patient.insight;
          const aiData = patient.aiData;
          
          return (
            <Card key={patient.id} className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {lead.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{lead.nome}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        {lead.telefone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getStatusBadgeColor(patient.status_tratamento)} text-white`}>
                      {patient.status_tratamento}
                    </Badge>
                    <Badge 
                      className={`${getEngagementColor(insight?.engagement_level || 'low')} text-white`}
                    >
                      {insight?.engagement_level || 'low'} engagement
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {/* Informações do Paciente */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>Email:</span>
                    </div>
                    <span className="font-medium">{lead.email || 'Não informado'}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Target className="w-3 h-3" />
                      <span>Objetivo:</span>
                    </div>
                    <span className="font-medium">{lead.objetivo || 'Não definido'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Scale className="w-3 h-3" />
                      <span>Peso:</span>
                    </div>
                    <span className="font-medium">{lead.peso ? `${lead.peso}kg` : 'Não informado'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Ruler className="w-3 h-3" />
                      <span>Altura:</span>
                    </div>
                    <span className="font-medium">{lead.altura ? `${lead.altura}cm` : 'Não informado'}</span>
                  </div>

                  {lead.imc && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-600">
                        <span>IMC:</span>
                      </div>
                      <span className="font-medium">{lead.imc}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Última consulta:</span>
                    </div>
                    <span className="font-medium">
                      {lead.ultima_consulta 
                        ? new Date(lead.ultima_consulta).toLocaleDateString('pt-BR')
                        : 'Nenhuma'
                      }
                    </span>
                  </div>
                </div>

                {/* Métricas de Engajamento */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso Geral</span>
                      <span className="font-medium">{lead.progresso || 0}%</span>
                    </div>
                    <Progress value={lead.progresso || 0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engajamento IA</span>
                      <span className="font-medium">{aiData?.engagement_score || 0}%</span>
                    </div>
                    <Progress value={aiData?.engagement_score || 0} className="h-2" />
                  </div>
                </div>

                {/* Dados Comportamentais da IA */}
                {insight && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Análise Comportamental IA
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Interações Totais:</span>
                        <span className="font-medium">{insight.interaction_frequency || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Resposta:</span>
                        <span className="font-medium">{insight.response_rate || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Horário Preferido:</span>
                        <span className="font-medium capitalize">{insight.preferred_time || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tendência:</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(aiData?.progress_data?.improvement_trend || 'stable')}
                          <span className="font-medium capitalize">
                            {aiData?.progress_data?.improvement_trend || 'stable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                    onClick={() => sendPersonalizedMessage(patient.id, lead.nome, lead.telefone)}
                    disabled={aiMessageLoading}
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

      {combinedPatients.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Nenhum paciente ativo encontrado</h3>
            <p className="text-gray-600">
              Converta leads em pacientes para começar a análise com IA
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
