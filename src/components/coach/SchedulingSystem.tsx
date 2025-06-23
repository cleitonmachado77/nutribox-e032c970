
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { NewScheduleDialog } from "./NewScheduleDialog";
import { ScheduleEditDialog } from "./ScheduleEditDialog";
import { 
  Clock, 
  Send, 
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  Play,
  Pause
} from "lucide-react";

interface ScheduledMessage {
  id: string;
  patientId: string;
  patientName: string;
  messageType: 'questionnaire' | 'motivational' | 'reminder' | 'followup';
  scheduledTime: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  nextExecution: string;
  lastExecuted?: string;
  messageTemplate: string;
}

export const SchedulingSystem = () => {
  const { toast } = useToast();
  const [editingSchedule, setEditingSchedule] = useState<ScheduledMessage | null>(null);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'Maria Silva',
      messageType: 'questionnaire',
      scheduledTime: '08:00',
      frequency: 'daily',
      isActive: true,
      nextExecution: '2024-01-15T08:00:00Z',
      messageTemplate: 'Bom dia {nome}! Como você está se sentindo hoje? Vamos fazer seu check-in diário?'
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'João Santos',
      messageType: 'motivational',
      scheduledTime: '20:00',
      frequency: 'weekly',
      isActive: true,
      nextExecution: '2024-01-21T20:00:00Z',
      lastExecuted: '2024-01-14T20:00:00Z',
      messageTemplate: 'Ótima semana, {nome}! Você está no caminho certo. Continue assim! 💪'
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Ana Costa',
      messageType: 'reminder',
      scheduledTime: '12:00',
      frequency: 'daily',
      isActive: false,
      nextExecution: '2024-01-15T12:00:00Z',
      messageTemplate: 'Olá {nome}, lembrete para beber água e seguir seu plano alimentar! 💧'
    }
  ]);

  const handleScheduleCreated = (newSchedule: ScheduledMessage) => {
    setScheduledMessages(prev => [...prev, newSchedule]);
  };

  const handleScheduleUpdated = (updatedSchedule: ScheduledMessage) => {
    setScheduledMessages(prev => 
      prev.map(schedule => 
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    );
  };

  const toggleSchedule = (id: string) => {
    setScheduledMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isActive: !msg.isActive } : msg
      )
    );
    
    const message = scheduledMessages.find(m => m.id === id);
    toast({
      title: "Status atualizado",
      description: `Agendamento ${message?.isActive ? 'pausado' : 'ativado'} para ${message?.patientName}`
    });
  };

  const executeNow = (message: ScheduledMessage) => {
    // Simular envio de mensagem
    const personalizedMessage = message.messageTemplate.replace('{nome}', message.patientName);
    
    // Atualizar última execução
    setScheduledMessages(prev => 
      prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, lastExecuted: new Date().toISOString() }
          : msg
      )
    );

    toast({
      title: "Mensagem enviada",
      description: `"${personalizedMessage.substring(0, 50)}..." enviada para ${message.patientName}`,
      duration: 5000
    });
  };

  const deleteSchedule = (id: string) => {
    const message = scheduledMessages.find(m => m.id === id);
    setScheduledMessages(prev => prev.filter(msg => msg.id !== id));
    
    toast({
      title: "Agendamento removido",
      description: `Agendamento para ${message?.patientName} foi removido`
    });
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'questionnaire': return 'bg-blue-100 text-blue-800';
      case 'motivational': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'followup': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'questionnaire': return 'Questionário';
      case 'motivational': return 'Motivacional';
      case 'reminder': return 'Lembrete';
      case 'followup': return 'Acompanhamento';
      default: return type;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'once': return 'Uma vez';
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      default: return frequency;
    }
  };

  const activeSchedules = scheduledMessages.filter(m => m.isActive).length;
  const totalMessages = scheduledMessages.length;
  const pendingMessages = scheduledMessages.filter(m => m.isActive && !m.lastExecuted).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Agendamento</h2>
          <p className="text-gray-600">Gerencie mensagens automáticas para seus pacientes</p>
        </div>
        <div className="flex gap-2">
          <NewScheduleDialog onScheduleCreated={handleScheduleCreated} />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Agendamentos Ativos</p>
                <p className="text-2xl font-bold">{activeSchedules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Agendamentos</p>
                <p className="text-2xl font-bold">{totalMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">{pendingMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Mensagens Agendadas ({scheduledMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledMessages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Clique em "Novo Agendamento" para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledMessages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{message.patientName}</h4>
                        <Badge className={getMessageTypeColor(message.messageType)}>
                          {getMessageTypeLabel(message.messageType)}
                        </Badge>
                        <Badge variant="outline">
                          {getFrequencyLabel(message.frequency)}
                        </Badge>
                        <Badge variant={message.isActive ? "default" : "secondary"}>
                          {message.isActive ? (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <Pause className="w-3 h-3 mr-1" />
                              Pausado
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{message.messageTemplate}</p>
                      
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Horário: {message.scheduledTime}</span>
                        <span>Próxima execução: {new Date(message.nextExecution).toLocaleString('pt-BR')}</span>
                        {message.lastExecuted && (
                          <span>Última execução: {new Date(message.lastExecuted).toLocaleString('pt-BR')}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeNow(message)}
                        disabled={!message.isActive}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Enviar Agora
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSchedule(message)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSchedule(message.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      
                      <Switch
                        checked={message.isActive}
                        onCheckedChange={() => toggleSchedule(message.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      {editingSchedule && (
        <ScheduleEditDialog
          schedule={editingSchedule}
          open={!!editingSchedule}
          onOpenChange={(open) => !open && setEditingSchedule(null)}
          onScheduleUpdated={handleScheduleUpdated}
        />
      )}
    </div>
  );
};
