
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus } from "lucide-react";

interface NewScheduleDialogProps {
  onScheduleCreated: (schedule: any) => void;
}

export const NewScheduleDialog = ({ onScheduleCreated }: NewScheduleDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    messageType: "",
    scheduledTime: "",
    frequency: "",
    messageTemplate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.messageType || !formData.scheduledTime || !formData.frequency || !formData.messageTemplate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: `p${Math.random().toString(36).substr(2, 3)}`,
      patientName: formData.patientName,
      messageType: formData.messageType as 'questionnaire' | 'motivational' | 'reminder' | 'followup',
      scheduledTime: formData.scheduledTime,
      frequency: formData.frequency as 'once' | 'daily' | 'weekly' | 'monthly',
      isActive: true,
      nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      messageTemplate: formData.messageTemplate
    };

    onScheduleCreated(newSchedule);
    
    toast({
      title: "Agendamento criado",
      description: `Mensagem ${formData.messageType} agendada para ${formData.patientName}`
    });

    setFormData({
      patientName: "",
      messageType: "",
      scheduledTime: "",
      frequency: "",
      messageTemplate: ""
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              placeholder="Digite o nome do paciente"
              required
            />
          </div>

          <div>
            <Label htmlFor="messageType">Tipo de Mensagem *</Label>
            <Select value={formData.messageType} onValueChange={(value) => setFormData({...formData, messageType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de mensagem" />
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
            <Label htmlFor="scheduledTime">Horário *</Label>
            <Input
              id="scheduledTime"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequência *</Label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a frequência" />
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
            <Label htmlFor="messageTemplate">Modelo da Mensagem *</Label>
            <Textarea
              id="messageTemplate"
              value={formData.messageTemplate}
              onChange={(e) => setFormData({...formData, messageTemplate: e.target.value})}
              placeholder="Digite o modelo da mensagem. Use {nome} para personalizar com o nome do paciente"
              rows={3}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Dica: Use {"{nome}"} para incluir o nome do paciente na mensagem
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Criar Agendamento
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
