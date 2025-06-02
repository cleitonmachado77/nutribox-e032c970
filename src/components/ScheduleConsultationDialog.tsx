
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useCreatePaciente } from "@/hooks/usePacientes";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/hooks/useLeads";

interface ScheduleConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export const ScheduleConsultationDialog = ({ open, onOpenChange, lead }: ScheduleConsultationDialogProps) => {
  const { data: userSettings } = useUserSettings();
  const createPaciente = useCreatePaciente();
  const { toast } = useToast();

  const handleScheduleConsultation = async () => {
    if (!userSettings?.google_calendar_link) {
      toast({
        title: "Erro",
        description: "Configure o link do Google Calendar nas configurações do perfil primeiro.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPaciente.mutateAsync(lead.id);
      
      // Abrir Google Calendar em nova aba
      window.open(userSettings.google_calendar_link, '_blank');
      
      toast({
        title: "Sucesso!",
        description: `${lead.nome} foi convertido em paciente e o Google Calendar foi aberto.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao agendar consulta. Tente novamente.",
        variant: "destructive",
      });
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
            <p className="text-lg font-medium">{lead.nome}</p>
            <p className="text-sm text-gray-600">{lead.telefone}</p>
            {lead.email && <p className="text-sm text-gray-600">{lead.email}</p>}
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">O que acontecerá:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• O lead será convertido automaticamente em paciente</li>
              <li>• O Google Calendar será aberto para agendamento</li>
              <li>• O status será atualizado para "Em Acompanhamento"</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleScheduleConsultation}
              disabled={createPaciente.isPending}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {createPaciente.isPending ? "Processando..." : "Agendar no Google Calendar"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
