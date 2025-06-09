
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, CheckCircle } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/types/lead";

interface ScheduleConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export const ScheduleConsultationDialog = ({ open, onOpenChange, lead }: ScheduleConsultationDialogProps) => {
  const { data: userSettings } = useUserSettings();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScheduleConsultation = async () => {
    if (!userSettings?.google_calendar_link) {
      toast({
        title: "Erro",
        description: "Configure o link do Google Calendar nas configurações do perfil primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Abrir Google Calendar em nova aba
      window.open(userSettings.google_calendar_link, '_blank');
      
      toast({
        title: "Google Calendar aberto!",
        description: `Agende a consulta para ${lead.nome} no Google Calendar.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error opening calendar:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir Google Calendar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agendar Consulta
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Paciente Criado!</h3>
            <p className="text-sm text-gray-600 mt-2">
              <strong>{lead.nome}</strong> foi convertido em paciente com sucesso.
            </p>
            <p className="text-xs text-gray-500">{lead.telefone}</p>
            {lead.email && <p className="text-xs text-gray-500">{lead.email}</p>}
          </div>
          
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium mb-2">Próximos passos:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Agende a consulta no Google Calendar</li>
              <li>• O paciente já está disponível na página de Pacientes</li>
              <li>• Configure lembretes e acompanhamento</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleScheduleConsultation}
              disabled={isProcessing || !userSettings?.google_calendar_link}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {isProcessing ? "Abrindo..." : "Abrir Google Calendar"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Depois
            </Button>
          </div>
          
          {!userSettings?.google_calendar_link && (
            <p className="text-xs text-amber-600 text-center">
              Configure o link do Google Calendar nas configurações primeiro.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
