
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, BarChart3 } from "lucide-react";

interface QuestionnaireDetailsProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionnaireDetails = ({ item, isOpen, onClose }: QuestionnaireDetailsProps) => {
  // Add null check for item
  if (!item) {
    return null;
  }

  const mockProgressData = [
    { date: '2024-01-01', value: 1 },
    { date: '2024-01-07', value: 2 },
    { date: '2024-01-14', value: 2 },
    { date: '2024-01-21', value: Number(item?.metaAtual) || 0 },
  ];

  const mockResponses = [
    { paciente: "Maria Silva", resposta: "Sim, consegui seguir 90% do plano", data: "2024-01-21", valor: 3 },
    { paciente: "João Santos", resposta: "Parcialmente, tive dificuldades no fim de semana", data: "2024-01-20", valor: 2 },
    { paciente: "Ana Costa", resposta: "Não consegui seguir bem esta semana", data: "2024-01-19", valor: 1 },
  ];

  const getNivelText = (nivel: number) => {
    switch (nivel) {
      case 1: return "Baixo ❌";
      case 2: return "Moderado ⚠️";
      case 3: return "Bom ✅";
      default: return "N/A";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {item.titulo || 'Pergunta'} - Detalhes
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="responses">Respostas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className={`border-2 ${getStatusColor(item.status || 'default')}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {item.titulo || 'Pergunta'}
                  <Badge className={getStatusColor(item.status || 'default')}>
                    {item.status === 'success' ? 'Ótimo' : item.status === 'warning' ? 'Atenção' : 'Crítico'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Pergunta Diária:</h4>
                    <p className="text-sm text-gray-600">{item.perguntaDiaria || 'Não aplicável'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Pergunta Semanal:</h4>
                    <p className="text-sm text-gray-600">{item.perguntaSemanal || 'Não definida'}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-3">Status Atual:</h4>
                  {item.tipo === "porcentagem" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Atual: {item.metaAtual || 0}%</span>
                        <span>Meta: {item.metaObjetivo || 0}%</span>
                      </div>
                      <Progress value={item.metaAtual || 0} className="h-3" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Atual: {getNivelText(item.metaAtual || 0)}</span>
                        <span>Meta: {getNivelText(item.metaObjetivo || 0)}</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((nivel) => (
                          <div
                            key={nivel}
                            className={`h-3 flex-1 rounded ${
                              nivel <= (item.metaAtual || 0) ? "bg-blue-500" : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução ao Longo do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Respostas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockResponses.map((resposta, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{resposta.paciente}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getNivelText(resposta.valor)}</Badge>
                          <span className="text-xs text-gray-500">{resposta.data}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{resposta.resposta}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
