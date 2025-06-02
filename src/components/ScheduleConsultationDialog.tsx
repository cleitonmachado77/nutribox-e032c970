
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, CheckCircle } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useCreatePaciente } from "@/hooks/usePacientes";
import { useUpdateLead } from "@/hooks/useLeads";
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
  const updateLead = useUpdateLead();
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
      // Primeiro atualizar o status do lead para consulta_agendada
      await updateLead.mutateAsync({
        id: lead.id,
        leadData: {
          status: 'consulta_agendada',
          proxima_consulta: new Date().toISOString(),
        }
      });

      // Converter lead em paciente imediatamente após agendar
      await createPaciente.mutateAsync(lead.id);

      // Abrir Google Calendar em nova aba
      window.open(userSettings.google_calendar_link, '_blank');
      
      toast({
        title: "Sucesso!",
        description: `Consulta agendada para ${lead.nome} e convertido em paciente com sucesso!`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Erro",
        description: "Erro ao agendar consulta. Tente novamente.",
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
            <p className="text-lg font-medium">{lead.nome}</p>
            <p className="text-sm text-gray-600">{lead.telefone}</p>
            {lead.email && <p className="text-sm text-gray-600">{lead.email}</p>}
          </div>
          
          {lead.status === 'novo' || lead.status === 'qualificado' ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium mb-2">Agendar Primeira Consulta:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• O Google Calendar será aberto para agendamento</li>
                  <li>• O lead será automaticamente convertido em paciente</li>
                  <li>• O status será atualizado para "Em Acompanhamento"</li>
                </ul>
              </div>
              
              <Button
                onClick={handleScheduleConsultation}
                disabled={isProcessing || !userSettings?.google_calendar_link}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isProcessing ? "Processando..." : "Agendar e Converter em Paciente"}
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-medium mb-2">Lead já convertido!</h4>
              <p className="text-sm text-gray-600">
                Este lead já foi convertido em paciente e está em acompanhamento.
              </p>
            </div>
          )}
          
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
