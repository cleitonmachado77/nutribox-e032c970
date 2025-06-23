
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus,
  Settings,
  Calendar,
  BarChart3,
  Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionnaireDetails } from "./QuestionnaireDetails";
import { QuestionnaireSettings } from "./QuestionnaireSettings";
import { NewQuestionForm } from "./NewQuestionForm";

export const BehavioralQuestions = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewQuestion, setShowNewQuestion] = useState(false);

  const questionarios = {
    comportamental: [
      {
        titulo: "Consistência do Plano",
        perguntaDiaria: "Você conseguiu seguir pelo menos 90% do Plano hoje?",
        perguntaSemanal: "Em quantos dias da semana você consegue seguir um plano alimentar estruturado?",
        metaAtual: 69,
        metaObjetivo: 75,
        status: "warning",
        tipo: "porcentagem"
      },
      {
        titulo: "Frequência de Refeições",
        perguntaDiaria: "Quantas refeições você terá realizado hoje?",
        perguntaSemanal: "Quantas refeições, em média, você realiza diariamente?",
        metaAtual: 2,
        metaObjetivo: 3,
        status: "error",
        tipo: "nivel"
      },
      {
        titulo: "Tempo de Refeição",
        perguntaDiaria: "Em quanto tempo finalizou sua refeição hoje?",
        perguntaSemanal: "Quanto tempo em média você leva para almoçar?",
        metaAtual: 2,
        metaObjetivo: 2,
        status: "warning",
        tipo: "nivel"
      },
      {
        titulo: "Vegetais e Frutas",
        perguntaDiaria: "Hoje você consumiu vegetais ou frutas em quantas refeições?",
        perguntaSemanal: "Costuma fazer o uso de vegetais e frutas todos os dias?",
        metaAtual: 3,
        metaObjetivo: 3,
        status: "success",
        tipo: "nivel"
      },
      {
        titulo: "Ingestão de Líquido",
        perguntaDiaria: "Qual a quantidade de líquido você terá ingerido hoje?",
        perguntaSemanal: "Quantidade de líquido ingerido diário?",
        metaAtual: 1,
        metaObjetivo: 3,
        status: "error",
        tipo: "nivel"
      }
    ],
    bemEstar: [
      {
        titulo: "Energia Física",
        perguntaDiaria: "Como você avalia sua energia física hoje?",
        perguntaSemanal: "Como você avalia sua energia?",
        metaAtual: 2,
        metaObjetivo: 3,
        status: "warning",
        tipo: "nivel"
      },
      {
        titulo: "Atividade Física",
        perguntaDiaria: "Hoje, você realizou Atividade Física?",
        perguntaSemanal: "Com que frequência você realiza atividade física?",
        metaAtual: 42,
        metaObjetivo: 60,
        status: "warning",
        tipo: "porcentagem"
      },
      {
        titulo: "Qualidade do Sono",
        perguntaDiaria: "Você dormiu quantas horas na noite passada?",
        perguntaSemanal: "Quantas horas de sono você tira durante a noite?",
        metaAtual: 1,
        metaObjetivo: 3,
        status: "error",
        tipo: "nivel"
      },
      {
        titulo: "Confiança na Jornada",
        perguntaDiaria: null,
        perguntaSemanal: "Como está seu nível de confiança na jornada?",
        metaAtual: 2,
        metaObjetivo: 3,
        status: "warning",
        tipo: "nivel"
      },
      {
        titulo: "Satisfação com o Corpo",
        perguntaDiaria: null,
        perguntaSemanal: "Como você se sente com seu corpo ao se olhar no espelho?",
        metaAtual: 1,
        metaObjetivo: 2,
        status: "error",
        tipo: "nivel"
      }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNivelText = (nivel: number) => {
    switch (nivel) {
      case 1: return "Baixo ❌";
      case 2: return "Moderado ⚠️";
      case 3: return "Bom ✅";
      default: return "N/A";
    }
  };

  const renderMetric = (item: any) => {
    if (item.tipo === "porcentagem") {
      return (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Atual: {item.metaAtual}%</span>
            <span>Meta: {item.metaObjetivo}%</span>
          </div>
          <Progress value={item.metaAtual} className="h-2" />
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Atual: {getNivelText(item.metaAtual)}</span>
            <span>Meta: {getNivelText(item.metaObjetivo)}</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((nivel) => (
              <div
                key={nivel}
                className={`h-2 flex-1 rounded ${
                  nivel <= item.metaAtual ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      );
    }
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Questionários Comportamentais</h2>
          <p className="text-gray-600">Gerencie e monitore os questionários dos pacientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
          <Button onClick={() => setShowNewQuestion(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Pergunta
          </Button>
        </div>
      </div>

      <Tabs defaultValue="comportamental" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comportamental">Questionário Comportamental</TabsTrigger>
          <TabsTrigger value="bem-estar">Questionário de Bem-Estar</TabsTrigger>
        </TabsList>

        <TabsContent value="comportamental" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionarios.comportamental.map((item, index) => (
              <Card key={index} className={`border-2 ${getStatusColor(item.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.titulo}</CardTitle>
                    {getStatusIcon(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Pergunta Diária:</span>
                    </div>
                    <p className="text-sm text-gray-700 pl-6">{item.perguntaDiaria}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Pergunta Semanal:</span>
                    </div>
                    <p className="text-sm text-gray-700 pl-6">{item.perguntaSemanal}</p>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">Progresso:</h4>
                    {renderMetric(item)}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewDetails(item)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bem-estar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionarios.bemEstar.map((item, index) => (
              <Card key={index} className={`border-2 ${getStatusColor(item.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.titulo}</CardTitle>
                    {getStatusIcon(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.perguntaDiaria && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Pergunta Diária:</span>
                      </div>
                      <p className="text-sm text-gray-700 pl-6">{item.perguntaDiaria}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {item.perguntaDiaria ? "Pergunta Semanal:" : "Pergunta:"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 pl-6">{item.perguntaSemanal}</p>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">Progresso:</h4>
                    {renderMetric(item)}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewDetails(item)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <QuestionnaireDetails 
        item={selectedItem}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      <QuestionnaireSettings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <NewQuestionForm 
        isOpen={showNewQuestion}
        onClose={() => setShowNewQuestion(false)}
      />
    </div>
  );
};
