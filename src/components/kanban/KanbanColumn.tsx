
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Lead } from "@/types/lead";
import { KanbanCard } from "./KanbanCard";
import { DragEvent } from "react";

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
  onAddNew: () => void;
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
  draggedLeadId
}: KanbanColumnProps) => {
  return (
    <Card 
      className={`min-h-[500px] transition-all duration-200 ${
        isDragOver 
          ? `border-2 ${borderColor} bg-gray-50` 
          : 'border border-gray-200'
      }`}
      onDragOver={(e) => onDragOver(e, id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
          <Badge className={`${color} text-white`}>
            {leads.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
        
        <Button 
          variant="outline" 
          className="w-full h-16 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600"
          onClick={onAddNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conversa
        </Button>
      </CardContent>
    </Card>
  );
};
