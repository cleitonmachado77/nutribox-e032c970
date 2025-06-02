
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useUpdateLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/hooks/useLeads";
import { getLeadProgressByStatus } from "@/hooks/useLeadProgress";
import { useCreatePaciente } from "@/hooks/usePacientes";

interface ScheduleConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export const ScheduleConsultationDialog = ({ open, onOpenChange, lead }: ScheduleConsultationDialogProps) => {
  const { data: userSettings } = useUserSettings();
  const updateLead = useUpdateLead();
  const createPaciente = useCreatePaciente();
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
      console.log('Scheduling consultation for lead:', lead.id, 'Current status:', lead.status);
      
      // Atualizar o status do lead para consulta_agendada
      await updateLead.mutateAsync({
        id: lead.id,
        leadData: {
          status: 'consulta_agendada',
          progresso: getLeadProgressByStatus('consulta_agendada'),
          proxima_consulta: new Date().toISOString(),
        }
      });

      console.log('Lead status updated to consulta_agendada');

      // Criar um paciente baseado no lead
      await createPaciente.mutateAsync({
        lead_id: lead.id,
        data_primeira_consulta: new Date().toISOString(),
        status_tratamento: 'ativo'
      });

      console.log('Paciente created from lead');

      // Abrir Google Calendar em nova aba
      window.open(userSettings.google_calendar_link, '_blank');
      
      toast({
        title: "Sucesso!",
        description: `Consulta agendada para ${lead.nome}! Status atualizado para "Consulta Agendada" e paciente criado.`,
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
                  <li>• O status será atualizado para "Consulta Agendada"</li>
                  <li>• O progresso será atualizado para 50%</li>
                  <li>• Um registro de paciente será criado</li>
                </ul>
              </div>
              
              <Button
                onClick={handleScheduleConsultation}
                disabled={isProcessing || !userSettings?.google_calendar_link}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isProcessing ? "Processando..." : "Agendar Consulta"}
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-medium mb-2">Consulta já agendada!</h4>
              <p className="text-sm text-gray-600">
                Este lead já possui uma consulta agendada ou está em acompanhamento.
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
