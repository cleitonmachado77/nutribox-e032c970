
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save } from "lucide-react";

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

interface ScheduleEditDialogProps {
  schedule: ScheduledMessage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleUpdated: (schedule: ScheduledMessage) => void;
}

export const ScheduleEditDialog = ({ schedule, open, onOpenChange, onScheduleUpdated }: ScheduleEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: schedule.patientName,
    messageType: schedule.messageType,
    scheduledTime: schedule.scheduledTime,
    frequency: schedule.frequency,
    messageTemplate: schedule.messageTemplate
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSchedule = {
      ...schedule,
      patientName: formData.patientName,
      messageType: formData.messageType,
      scheduledTime: formData.scheduledTime,
      frequency: formData.frequency,
      messageTemplate: formData.messageTemplate
    };

    onScheduleUpdated(updatedSchedule);
    
    toast({
      title: "Agendamento atualizado",
      description: `Agendamento para ${formData.patientName} foi atualizado`
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Agendamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="messageType">Tipo de Mensagem</Label>
            <Select value={formData.messageType} onValueChange={(value: any) => setFormData({...formData, messageType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="questionnaire">Questionário</SelectItem>
                <SelectItem value="motivational">Motivacional</SelectItem>
                <SelectItem value="reminder">Lembrete</SelectItem>
                <SelectItem value="followup">Acompanhamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scheduledTime">Horário</Label>
            <Input
              id="scheduledTime"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequência</Label>
            <Select value={formData.frequency} onValueChange={(value: any) => setFormData({...formData, frequency: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Uma vez</SelectItem>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="messageTemplate">Modelo da Mensagem</Label>
            <Textarea
              id="messageTemplate"
              value={formData.messageTemplate}
              onChange={(e) => setFormData({...formData, messageTemplate: e.target.value})}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
