
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ExternalLink } from "lucide-react";
import { Lead } from "@/types/lead";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

interface ScheduleConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onConsultationScheduled?: () => void;
}

export const ScheduleConsultationDialog = ({ 
  open, 
  onOpenChange, 
  lead,
  onConsultationScheduled 
}: ScheduleConsultationDialogProps) => {
  const [formData, setFormData] = useState({
    data: "",
    horario: "",
    observacoes: "",
  });

  const { data: userSettings } = useUserSettings();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userSettings?.google_calendar_link) {
      toast({
        title: "Link do Google Calendar não configurado",
        description: "Configure o link do Google Calendar nas configurações antes de agendar consultas.",
        variant: "destructive",
      });
      return;
    }

    // Criar evento no Google Calendar
    const eventDate = new Date(`${formData.data}T${formData.horario}`);
    const eventTitle = encodeURIComponent(`Consulta - ${lead.nome}`);
    const eventDetails = encodeURIComponent(formData.observacoes || `Consulta agendada para ${lead.nome}`);
    
    // Formato ISO para Google Calendar
    const startTime = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // 1 hora depois
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // URL do Google Calendar
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDetails}`;

    // Abrir Google Calendar
    window.open(calendarUrl, '_blank');

    // Notificar que a consulta foi agendada
    if (onConsultationScheduled) {
      onConsultationScheduled();
    }

    toast({
      title: "Redirecionado para Google Calendar",
      description: "Complete o agendamento no Google Calendar que foi aberto.",
    });

    onOpenChange(false);
    setFormData({ data: "", horario: "", observacoes: "" });
  };

  const openCalendarSettings = () => {
    if (userSettings?.google_calendar_link) {
      window.open(userSettings.google_calendar_link, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agendar Consulta - {lead.nome}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="horario">Horário *</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({...formData, horario: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações sobre a consulta..."
              rows={3}
            />
          </div>

          {/* Link do Google Calendar */}
          {userSettings?.google_calendar_link && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700 mb-2">
                Google Calendar configurado
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openCalendarSettings}
                className="text-green-700 border-green-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Google Calendar
              </Button>
            </div>
          )}

          {!userSettings?.google_calendar_link && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700">
                Configure o link do Google Calendar nas configurações para facilitar o agendamento.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Agendar no Google Calendar
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
