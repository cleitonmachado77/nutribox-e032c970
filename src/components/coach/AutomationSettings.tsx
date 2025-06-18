
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNutriCoachAI } from "@/hooks/useNutriCoachAI";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Clock,
  Brain,
  Users,
  Settings,
  MessageSquare
} from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'time' | 'behavior' | 'response' | 'goal';
  conditions: any;
  messageTemplate: string;
  isActive: boolean;
  frequency: string;
  targetAudience: string;
}

export const AutomationSettings = () => {
  const { generateMessage, loading } = useNutriCoachAI();
  const { toast } = useToast();

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Lembrete Matinal',
      trigger: 'time',
      conditions: { time: '08:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
      messageTemplate: 'Bom dia {nome}! Como está se sentindo hoje? Lembre-se de tomar água e seguir seu plano alimentar. 💪',
      isActive: true,
      frequency: 'daily',
      targetAudience: 'all'
    },
    {
      id: '2',
      name: 'Motivação Progresso',
      trigger: 'behavior',
      conditions: { consecutiveDays: 3, compliance: '>80%' },
      messageTemplate: 'Parabéns {nome}! Você está seguindo seu plano há {dias} dias consecutivos. Continue assim! 🌟',
      isActive: true,
      frequency: 'triggered',
      targetAudience: 'engaged'
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    trigger: 'time',
    isActive: true,
    frequency: 'daily',
    targetAudience: 'all'
  });

  const [showNewRuleForm, setShowNewRuleForm] = useState(false);

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.messageTemplate) {
      toast({
        title: "Erro",
        description: "Nome e template da mensagem são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      trigger: newRule.trigger || 'time',
      conditions: newRule.conditions || {},
      messageTemplate: newRule.messageTemplate,
      isActive: newRule.isActive || true,
      frequency: newRule.frequency || 'daily',
      targetAudience: newRule.targetAudience || 'all'
    };

    setAutomationRules([...automationRules, rule]);
    setNewRule({
      trigger: 'time',
      isActive: true,
      frequency: 'daily',
      targetAudience: 'all'
    });
    setShowNewRuleForm(false);

    toast({
      title: "Sucesso!",
      description: "Nova regra de automação criada"
    });
  };

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
      title: "Regra removida",
      description: "A regra de automação foi removida com sucesso"
    });
  };

  const testRule = async (rule: AutomationRule) => {
    try {
      const testMessage = await generateMessage({
        action: 'generate_motivational',
        patientName: 'João (Teste)',
        messageType: rule.name
      });

      if (testMessage) {
        toast({
          title: "Teste da Regra",
          description: `Mensagem gerada: "${testMessage.substring(0, 100)}..."`
        });
      }
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Falha ao testar a regra",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Automação do NutriCoach</h2>
          <p className="text-gray-600">Configure mensagens automáticas personalizadas com IA</p>
        </div>
        <Button onClick={() => setShowNewRuleForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Regra
        </Button>
      </div>

      {/* Configurações de Aprendizado da IA */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Configurações de Aprendizado da IA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Análise de Comportamento</h4>
                  <p className="text-sm text-gray-600">
                    IA analisa padrões de resposta dos pacientes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Personalização Automática</h4>
                  <p className="text-sm text-gray-600">
                    Adapta mensagens baseado no histórico
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Coleta de Dados Avançada</h4>
                  <p className="text-sm text-gray-600">
                    Extrai insights das conversas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Predição de Engajamento</h4>
                  <p className="text-sm text-gray-600">
                    Prevê quando enviar mensagens
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Nova Regra */}
      {showNewRuleForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Regra de Automação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Nome da Regra</Label>
                <Input
                  id="rule-name"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Ex: Lembrete de Hidratação"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Gatilho</Label>
                <Select 
                  value={newRule.trigger} 
                  onValueChange={(value) => setNewRule({ ...newRule, trigger: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Horário Específico</SelectItem>
                    <SelectItem value="behavior">Comportamento do Paciente</SelectItem>
                    <SelectItem value="response">Resposta a Questionário</SelectItem>
                    <SelectItem value="goal">Meta Atingida/Perdida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência</Label>
                <Select 
                  value={newRule.frequency} 
                  onValueChange={(value) => setNewRule({ ...newRule, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="triggered">Sob Demanda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Público Alvo</Label>
                <Select 
                  value={newRule.targetAudience} 
                  onValueChange={(value) => setNewRule({ ...newRule, targetAudience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Pacientes</SelectItem>
                    <SelectItem value="engaged">Pacientes Engajados</SelectItem>
                    <SelectItem value="inactive">Pacientes Inativos</SelectItem>
                    <SelectItem value="new">Novos Pacientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-template">Template da Mensagem</Label>
              <Textarea
                id="message-template"
                value={newRule.messageTemplate || ''}
                onChange={(e) => setNewRule({ ...newRule, messageTemplate: e.target.value })}
                placeholder="Use {nome}, {progresso}, {meta} como variáveis dinâmicas..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                Variáveis disponíveis: {'{nome}'}, {'{progresso}'}, {'{meta}'}, {'{dias}'}, {'{peso}'}, {'{imc}'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateRule}>
                Criar Regra
              </Button>
              <Button variant="outline" onClick={() => setShowNewRuleForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Regras Existentes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Regras Ativas</h3>
        {automationRules.map((rule) => (
          <Card key={rule.id} className={`${rule.isActive ? 'border-green-200' : 'border-gray-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant={rule.isActive ? "default" : "secondary"}>
                      {rule.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Badge variant="outline">
                      {rule.trigger === 'time' && <Clock className="w-3 h-3 mr-1" />}
                      {rule.trigger === 'behavior' && <Users className="w-3 h-3 mr-1" />}
                      {rule.trigger === 'response' && <MessageSquare className="w-3 h-3 mr-1" />}
                      {rule.trigger === 'goal' && <Settings className="w-3 h-3 mr-1" />}
                      {rule.trigger}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rule.messageTemplate}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>Frequência: {rule.frequency}</span>
                    <span>•</span>
                    <span>Público: {rule.targetAudience}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testRule(rule)}
                    disabled={loading}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Testar
                  </Button>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
