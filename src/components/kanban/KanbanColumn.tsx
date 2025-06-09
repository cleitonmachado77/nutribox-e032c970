
import { DragEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanCard } from "./KanbanCard";
import { Lead } from "@/types/lead";

interface KanbanColumnProps {
  id: string;
  title: string;
  leads: Lead[];
  color: string;
  borderColor: string;
  isDragOver: boolean;
  onDragOver: (e: DragEvent, columnId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent, columnId: string) => void;
  onDragStart: (e: DragEvent, leadId: string) => void;
  onDragEnd: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAddNew?: () => void; // Opcional - só aparece quando definido
  draggedLeadId: string | null;
}

export const KanbanColumn = ({
  id,
  title,
  leads,
  color,
  borderColor,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onAddNew,
  draggedLeadId,
}: KanbanColumnProps) => {
  return (
    <div
      className={`bg-white rounded-lg border-2 ${borderColor} ${
        isDragOver ? "border-dashed border-purple-400 bg-purple-50" : ""
      } transition-colors duration-200`}
      onDragOver={(e) => onDragOver(e, id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, id)}
    >
      {/* Header */}
      <div className={`${color} text-white p-4 rounded-t-lg flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
            {leads.length}
          </span>
        </div>
        {onAddNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddNew}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Cards */}
      <div className="p-4 space-y-3 min-h-[200px]">
        {leads.map((lead) => (
          <KanbanCard
            key={lead.id}
            lead={lead}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onEdit={onEdit}
            onDelete={onDelete}
            isDragging={draggedLeadId === lead.id}
          />
        ))}
      </div>
    </div>
  );
};
