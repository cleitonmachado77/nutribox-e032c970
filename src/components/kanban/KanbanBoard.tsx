
import { useState, DragEvent } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { ScheduleConsultationDialog } from "../ScheduleConsultationDialog";
import { Lead } from "@/types/lead";
import { useUpdateLead } from "@/hooks/useUpdateLead";
import { useCreatePaciente } from "@/hooks/usePacientes";
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
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedLeadForSchedule, setSelectedLeadForSchedule] = useState<Lead | null>(null);
  const updateLead = useUpdateLead();
  const createPaciente = useCreatePaciente();
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

  const handleDrop = async (e: DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const draggedLead = leads.find(lead => lead.id === draggedLeadId);
    if (!draggedLead) return;

    try {
      console.log('Moving lead to status:', targetColumn.status);
      
      // Atualizar o status do lead
      await updateLead.mutateAsync({
        id: draggedLeadId,
        leadData: { 
          status: targetColumn.status,
          proxima_consulta: targetColumn.status === 'consulta_agendada' ? new Date().toISOString() : undefined
        }
      });

      // Se foi movido para "consulta_agendada", criar paciente e mostrar dialog de agendamento
      if (targetColumn.status === 'consulta_agendada') {
        console.log('Creating paciente for lead:', draggedLeadId);
        
        // Criar paciente
        await createPaciente.mutateAsync(draggedLeadId);
        
        toast({
          title: "Lead convertido!",
          description: `${draggedLead.nome} foi movido para "Consulta Agendada" e convertido em paciente.`,
        });

        // Mostrar dialog para agendar consulta
        setSelectedLeadForSchedule(draggedLead);
        setShowScheduleDialog(true);
      } else {
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
    <>
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
            onAddNew={onAddNew}
            draggedLeadId={draggedLeadId}
          />
        ))}
      </div>

      {/* Dialog para agendar consulta no Google Calendar */}
      {selectedLeadForSchedule && (
        <ScheduleConsultationDialog
          open={showScheduleDialog}
          onOpenChange={(open) => {
            setShowScheduleDialog(open);
            if (!open) {
              setSelectedLeadForSchedule(null);
            }
          }}
          lead={selectedLeadForSchedule}
        />
      )}
    </>
  );
};
