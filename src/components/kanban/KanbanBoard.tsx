
import { useState, DragEvent } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { Lead } from "@/types/lead";
import { useUpdateLead } from "@/hooks/useUpdateLead";
import { useCreatePaciente } from "@/hooks/usePacientes";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  borderColor: string;
  status: string;
}

interface KanbanBoardProps {
  leads: Lead[];
  columns: KanbanColumn[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAddNew: () => void;
}

export const KanbanBoard = ({ leads, columns, onEdit, onDelete, onAddNew }: KanbanBoardProps) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const updateLead = useUpdateLead();
  const createPaciente = useCreatePaciente();
  const { data: userSettings } = useUserSettings();
  const { toast } = useToast();

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const handleDragStart = (e: DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleScheduleConsultation = async (lead: Lead) => {
    if (!userSettings?.google_calendar_link) {
      toast({
        title: "Link do Google Calendar não configurado",
        description: "Configure o link do Google Calendar nas configurações antes de agendar consultas.",
        variant: "destructive",
      });
      return;
    }

    // Criar evento no Google Calendar com data/hora padrão (hoje + 1 dia às 14:00)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    
    const eventTitle = encodeURIComponent(`Consulta - ${lead.nome}`);
    const eventDetails = encodeURIComponent(`Consulta agendada para ${lead.nome}\nTelefone: ${lead.telefone}\nEmail: ${lead.email || 'Não informado'}`);
    
    const startTime = tomorrow.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(tomorrow.getTime() + 60 * 60 * 1000); // 1 hora depois
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDetails}`;

    // Abrir Google Calendar
    window.open(calendarUrl, '_blank');

    try {
      // Atualizar o lead para "consulta_agendada" e definir próxima consulta
      await updateLead.mutateAsync({
        id: lead.id,
        leadData: { 
          status: 'consulta_agendada',
          proxima_consulta: tomorrow.toISOString()
        }
      });

      // Criar paciente
      await createPaciente.mutateAsync(lead.id);

      toast({
        title: "Consulta agendada!",
        description: `${lead.nome} foi movido para "Consulta Agendada" e convertido em paciente.`,
      });
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Erro ao agendar consulta",
        description: "Não foi possível atualizar o status do lead. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = async (e: DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const draggedLead = leads.find(lead => lead.id === draggedLeadId);
    if (!draggedLead) return;

    try {
      console.log('Moving lead to status:', targetColumn.status);
      
      // Se foi movido para "consulta_agendada", usar a função de agendamento
      if (targetColumn.status === 'consulta_agendada') {
        await handleScheduleConsultation(draggedLead);
      } else {
        // Atualizar apenas o status do lead
        await updateLead.mutateAsync({
          id: draggedLeadId,
          leadData: { 
            status: targetColumn.status,
            proxima_consulta: targetColumn.status === 'consulta_agendada' ? new Date().toISOString() : undefined
          }
        });

        toast({
          title: "Lead movido com sucesso",
          description: `Lead movido para ${targetColumn.title}`,
        });
      }
    } catch (error) {
      console.error('Error moving lead:', error);
      toast({
        title: "Erro ao mover lead",
        description: "Não foi possível mover o lead. Tente novamente.",
        variant: "destructive",
      });
    }

    setDraggedLeadId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          leads={getLeadsByStatus(column.status)}
          color={column.color}
          borderColor={column.borderColor}
          isDragOver={dragOverColumn === column.id}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddNew={column.status === 'novo' ? onAddNew : undefined}
          draggedLeadId={draggedLeadId}
        />
      ))}
    </div>
  );
};
