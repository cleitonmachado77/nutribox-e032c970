
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, RefreshCw } from "lucide-react";

interface QuestionnaireSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionnaireSettings = ({ isOpen, onClose }: QuestionnaireSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoSend: true,
    dailyTime: "08:00",
    weeklyTime: "20:00",
    reminderEnabled: true,
    reminderTime: 2, // hours
    analysisEnabled: true,
    lowEngagementAlert: true,
    alertThreshold: 2,
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações dos questionários foram atualizadas com sucesso.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações dos Questionários
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="schedule">Agendamento</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-send">Envio Automático</Label>
                    <p className="text-sm text-gray-600">Enviar questionários automaticamente nos horários configurados</p>
                  </div>
                  <Switch
                    id="auto-send"
                    checked={settings.autoSend}
                    onCheckedChange={(checked) => setSettings({...settings, autoSend: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analysis">Análise Automática</Label>
                    <p className="text-sm text-gray-600">Analisar respostas automaticamente com IA</p>
                  </div>
                  <Switch
                    id="analysis"
                    checked={settings.analysisEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, analysisEnabled: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Horários de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="daily-time">Questionários Diários</Label>
                    <Input
                      id="daily-time"
                      type="time"
                      value={settings.dailyTime}
                      onChange={(e) => setSettings({...settings, dailyTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weekly-time">Questionários Semanais</Label>
                    <Input
                      id="weekly-time"
                      type="time"
                      value={settings.weeklyTime}
                      onChange={(e) => setSettings({...settings, weeklyTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reminder">Lembretes</Label>
                    <p className="text-sm text-gray-600">Enviar lembrete se não houver resposta</p>
                  </div>
                  <Switch
                    id="reminder"
                    checked={settings.reminderEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, reminderEnabled: checked})}
                  />
                </div>

                {settings.reminderEnabled && (
                  <div>
                    <Label htmlFor="reminder-time">Tempo para lembrete (horas)</Label>
                    <Select
                      value={settings.reminderTime.toString()}
                      onValueChange={(value) => setSettings({...settings, reminderTime: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="4">4 horas</SelectItem>
                        <SelectItem value="8">8 horas</SelectItem>
                        <SelectItem value="24">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertas e Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-engagement">Alerta de Baixo Engajamento</Label>
                    <p className="text-sm text-gray-600">Notificar quando paciente tem baixo engajamento</p>
                  </div>
                  <Switch
                    id="low-engagement"
                    checked={settings.lowEngagementAlert}
                    onCheckedChange={(checked) => setSettings({...settings, lowEngagementAlert: checked})}
                  />
                </div>

                {settings.lowEngagementAlert && (
                  <div>
                    <Label htmlFor="alert-threshold">Limite para alerta (dias sem resposta)</Label>
                    <Select
                      value={settings.alertThreshold.toString()}
                      onValueChange={(value) => setSettings({...settings, alertThreshold: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 dia</SelectItem>
                        <SelectItem value="2">2 dias</SelectItem>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="5">5 dias</SelectItem>
                        <SelectItem value="7">7 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
