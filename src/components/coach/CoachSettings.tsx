
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Clock, 
  MessageSquare, 
  Bell,
  Brain,
  Target,
  Save,
  Bot,
  Users,
  Zap,
  Palette,
  Volume2,
  Shield,
  Database,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";

export const CoachSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Configurações da IA
    coachName: "NutriCoach",
    communicationStyle: "motivacional",
    messageType: "positivo",
    welcomeMessage: "Olá! Sou seu NutriCoach virtual e estou aqui para te acompanhar em sua jornada de transformação. Vamos conquistar seus objetivos juntos! 🌟",
    
    // Interações Automáticas
    dailyQuestionnaires: true,
    hydrationReminders: true,
    automaticFeedback: true,
    weeklyMotivation: false,
    
    // Horários
    schedules: [
      { tipo: "Lembrete Manhã", horario: "08:00", ativo: true },
      { tipo: "Check-in Almoço", horario: "12:00", ativo: true },
      { tipo: "Lembrete Tarde", horario: "15:00", ativo: false },
      { tipo: "Revisão Noturna", horario: "20:00", ativo: true }
    ],
    
    // Metas
    evaluationPeriod: "mensal",
    defaultConsistencyGoal: 75,
    defaultHydrationGoal: 80,
    defaultExerciseGoal: 60,
    
    // Notificações
    goalAlerts: true,
    weeklyReports: true,
    lowEngagementAlerts: false,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Segurança
    twoFactorAuth: false,
    sessionTimeout: 60,
    showPrivateData: false
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

  const handleSaveSettings = () => {
    console.log("Salvando configurações:", settings);
    toast({
      title: "Configurações salvas!",
      description: "Todas as configurações foram atualizadas com sucesso.",
    });
  };

  const handleResetSettings = () => {
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas aos valores padrão.",
      variant: "destructive"
    });
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'nutricoach-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Configurações exportadas",
      description: "Arquivo de configurações baixado com sucesso."
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings({ ...settings, ...importedSettings });
          toast({
            title: "Configurações importadas",
            description: "Configurações carregadas com sucesso do arquivo."
          });
        } catch (error) {
          toast({
            title: "Erro na importação",
            description: "Arquivo de configurações inválido.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key copiada",
      description: "A chave foi copiada para a área de transferência."
    });
  };

  const updateSchedule = (index: number, field: string, value: any) => {
    const newSchedules = [...settings.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSettings({ ...settings, schedules: newSchedules });
  };

  const addNewSchedule = () => {
    const newSchedule = { tipo: "Novo Horário", horario: "09:00", ativo: true };
    setSettings({ ...settings, schedules: [...settings.schedules, newSchedule] });
  };

  const removeSchedule = (index: number) => {
    const newSchedules = settings.schedules.filter((_, i) => i !== index);
    setSettings({ ...settings, schedules: newSchedules });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Configurações do NutriCoach
          </h2>
          <p className="text-gray-600">Configure o comportamento e personalidade do seu coach virtual</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </span>
            </Button>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted">
          <TabsTrigger value="personality" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Personalidade
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Interações
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Metas
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Configurações da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="coach-name">Nome do Coach</Label>
                  <Input
                    id="coach-name"
                    value={settings.coachName}
                    onChange={(e) => setSettings({ ...settings, coachName: e.target.value })}
                    placeholder="Ex: Ana, Carlos, NutriBot..."
                  />
                  <p className="text-xs text-gray-500">
                    Este nome será usado nas interações com os pacientes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">Chave da API (OpenAI)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Insira sua chave da API"
                    />
                    <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={copyApiKey}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personalidade">Estilo de Comunicação</Label>
                  <Select value={settings.communicationStyle} onValueChange={(value) => setSettings({ ...settings, communicationStyle: value })}>
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
                  <Select value={settings.messageType} onValueChange={(value) => setSettings({ ...settings, messageType: value })}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem-boas-vindas">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="mensagem-boas-vindas"
                  value={settings.welcomeMessage}
                  onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Interações Automáticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Questionários Diários</h4>
                  <p className="text-sm text-gray-600">
                    Enviar questionários comportamentais automaticamente
                  </p>
                </div>
                <Switch 
                  checked={settings.dailyQuestionnaires} 
                  onCheckedChange={(checked) => setSettings({ ...settings, dailyQuestionnaires: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Lembretes de Hidratação</h4>
                  <p className="text-sm text-gray-600">
                    Lembrar os pacientes de beber água
                  </p>
                </div>
                <Switch 
                  checked={settings.hydrationReminders} 
                  onCheckedChange={(checked) => setSettings({ ...settings, hydrationReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Feedback Automático</h4>
                  <p className="text-sm text-gray-600">
                    Enviar feedback baseado no progresso
                  </p>
                </div>
                <Switch 
                  checked={settings.automaticFeedback} 
                  onCheckedChange={(checked) => setSettings({ ...settings, automaticFeedback: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Motivação Semanal</h4>
                  <p className="text-sm text-gray-600">
                    Mensagens motivacionais semanais
                  </p>
                </div>
                <Switch 
                  checked={settings.weeklyMotivation} 
                  onCheckedChange={(checked) => setSettings({ ...settings, weeklyMotivation: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horários de Interação
                </CardTitle>
                <Button onClick={addNewSchedule}>
                  Adicionar Horário
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.schedules.map((horario, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <Input
                      value={horario.tipo}
                      onChange={(e) => updateSchedule(index, 'tipo', e.target.value)}
                      className="w-40"
                    />
                    <Input
                      type="time"
                      value={horario.horario}
                      onChange={(e) => updateSchedule(index, 'horario', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={horario.ativo ? "default" : "secondary"}>
                      {horario.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                    <Switch 
                      checked={horario.ativo} 
                      onCheckedChange={(checked) => updateSchedule(index, 'ativo', checked)}
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeSchedule(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
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
                <Select value={settings.evaluationPeriod} onValueChange={(value) => setSettings({ ...settings, evaluationPeriod: value })}>
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Padrão - Consistência do Plano: {settings.defaultConsistencyGoal}%</Label>
                  <Slider
                    value={[settings.defaultConsistencyGoal]}
                    onValueChange={(value) => setSettings({ ...settings, defaultConsistencyGoal: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meta Padrão - Hidratação: {settings.defaultHydrationGoal}%</Label>
                  <Slider
                    value={[settings.defaultHydrationGoal]}
                    onValueChange={(value) => setSettings({ ...settings, defaultHydrationGoal: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meta Padrão - Exercício: {settings.defaultExerciseGoal}%</Label>
                  <Slider
                    value={[settings.defaultExerciseGoal]}
                    onValueChange={(value) => setSettings({ ...settings, defaultExerciseGoal: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configurações de Notificações
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
                <Switch 
                  checked={settings.goalAlerts} 
                  onCheckedChange={(checked) => setSettings({ ...settings, goalAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Relatórios Semanais</h4>
                  <p className="text-sm text-gray-600">
                    Enviar resumo semanal do progresso
                  </p>
                </div>
                <Switch 
                  checked={settings.weeklyReports} 
                  onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Engajamento Baixo</h4>
                  <p className="text-sm text-gray-600">
                    Alertar sobre pacientes com baixo engajamento
                  </p>
                </div>
                <Switch 
                  checked={settings.lowEngagementAlerts} 
                  onCheckedChange={(checked) => setSettings({ ...settings, lowEngagementAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Notificações Push</h4>
                  <p className="text-sm text-gray-600">
                    Alertas em tempo real no navegador
                  </p>
                </div>
                <Switch 
                  checked={settings.pushNotifications} 
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Notificações por Email</h4>
                  <p className="text-sm text-gray-600">
                    Resumo diário por email
                  </p>
                </div>
                <Switch 
                  checked={settings.emailNotifications} 
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="font-medium">Som</span>
                  </div>
                  <Switch 
                    checked={settings.soundEnabled} 
                    onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span className="font-medium">Vibração</span>
                  </div>
                  <Switch 
                    checked={settings.vibrationEnabled} 
                    onCheckedChange={(checked) => setSettings({ ...settings, vibrationEnabled: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                  <p className="text-sm text-gray-600">
                    Adicionar uma camada extra de segurança
                  </p>
                </div>
                <Switch 
                  checked={settings.twoFactorAuth} 
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Timeout de Sessão (minutos): {settings.sessionTimeout}</Label>
                <Slider
                  value={[settings.sessionTimeout]}
                  onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value[0] })}
                  min={15}
                  max={240}
                  step={15}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Tempo em minutos antes da sessão expirar automaticamente
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Mostrar Dados Privados</h4>
                  <p className="text-sm text-gray-600">
                    Exibir informações sensíveis na interface
                  </p>
                </div>
                <Switch 
                  checked={settings.showPrivateData} 
                  onCheckedChange={(checked) => setSettings({ ...settings, showPrivateData: checked })}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-medium">Zona de Perigo</h4>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Fazer Backup dos Dados
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restaurar Configurações de Fábrica
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Todos os Dados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
