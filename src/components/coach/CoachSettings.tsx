
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Clock, 
  MessageSquare, 
  Bell,
  Brain,
  Target,
  Save
} from "lucide-react";

export const CoachSettings = () => {
  const horarios = [
    { tipo: "Lembrete Manhã", horario: "08:00", ativo: true },
    { tipo: "Check-in Almoço", horario: "12:00", ativo: true },
    { tipo: "Lembrete Tarde", horario: "15:00", ativo: false },
    { tipo: "Revisão Noturna", horario: "20:00", ativo: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configurações do NutriCoach</h2>
          <p className="text-gray-600">Configure o comportamento e personalidade do seu coach virtual</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações da IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Personalidade da IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="coach-name">Nome do Coach</Label>
              <Input
                id="coach-name"
                defaultValue="NutriCoach"
                placeholder="Ex: Ana, Carlos, NutriBot..."
              />
              <p className="text-xs text-gray-500">
                Este nome será usado nas interações com os pacientes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalidade">Estilo de Comunicação</Label>
              <Select defaultValue="motivacional">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motivacional">Motivacional e Encorajador</SelectItem>
                  <SelectItem value="profissional">Profissional e Direto</SelectItem>
                  <SelectItem value="amigavel">Amigável e Descontraído</SelectItem>
                  <SelectItem value="tecnico">Técnico e Educativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tom">Tom das Mensagens</Label>
              <Select defaultValue="positivo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positivo">Sempre Positivo</SelectItem>
                  <SelectItem value="equilibrado">Equilibrado</SelectItem>
                  <SelectItem value="realista">Realista e Honesto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem-boas-vindas">Mensagem de Boas-vindas</Label>
              <Textarea
                id="mensagem-boas-vindas"
                defaultValue="Olá! Sou seu NutriCoach virtual e estou aqui para te acompanhar em sua jornada de transformação. Vamos conquistar seus objetivos juntos! 🌟"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Interação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Interações Automáticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Questionários Diários</h4>
                  <p className="text-sm text-gray-600">
                    Enviar questionários comportamentais automaticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Lembretes de Hidratação</h4>
                  <p className="text-sm text-gray-600">
                    Lembrar os pacientes de beber água
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Feedback Automático</h4>
                  <p className="text-sm text-gray-600">
                    Enviar feedback baseado no progresso
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Motivação Semanal</h4>
                  <p className="text-sm text-gray-600">
                    Mensagens motivacionais semanais
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Interação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {horarios.map((horario, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{horario.tipo}</h4>
                    <p className="text-xs text-gray-600">{horario.horario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={horario.ativo ? "default" : "secondary"}>
                    {horario.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                  <Switch checked={horario.ativo} />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Adicionar Horário
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de Meta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Configurações de Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="periodo-avaliacao">Período de Avaliação</Label>
              <Select defaultValue="mensal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-consistencia">Meta Padrão - Consistência do Plano (%)</Label>
              <Input
                id="meta-consistencia"
                type="number"
                defaultValue="75"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-hidratacao">Meta Padrão - Hidratação (%)</Label>
              <Input
                id="meta-hidratacao"
                type="number"
                defaultValue="80"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-exercicio">Meta Padrão - Exercício (%)</Label>
              <Input
                id="meta-exercicio"
                type="number"
                defaultValue="60"
                min="0"
                max="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">Alertas de Metas</h4>
                <p className="text-sm text-gray-600">
                  Notificar quando metas não são alcançadas
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">Relatórios Semanais</h4>
                <p className="text-sm text-gray-600">
                  Enviar resumo semanal do progresso
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">Engajamento Baixo</h4>
                <p className="text-sm text-gray-600">
                  Alertar sobre pacientes com baixo engajamento
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
