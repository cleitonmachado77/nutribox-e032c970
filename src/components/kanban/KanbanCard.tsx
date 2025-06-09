
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Lead } from "@/types/lead";
import { DragEvent } from "react";

interface KanbanCardProps {
  lead: Lead;
  onDragStart: (e: DragEvent, leadId: string) => void;
  onDragEnd: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  isDragging: boolean;
}

export const KanbanCard = ({ 
  lead, 
  onDragStart, 
  onDragEnd, 
  onEdit, 
  onDelete, 
  isDragging 
}: KanbanCardProps) => {
  return (
    <Card 
      className={`p-4 transition-all duration-200 cursor-move select-none ${
        isDragging 
          ? 'opacity-50 border-2 border-purple-500 shadow-lg' 
          : 'hover:shadow-md border border-gray-200 bg-white'
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">{lead.nome}</p>
            <p className="text-xs text-gray-600">{lead.telefone}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(lead)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(lead)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>Última Resposta: {lead.ultima_consulta ? new Date(lead.ultima_consulta).toLocaleDateString() : 'N/A'}</p>
          <p>Próx. Atividade: {lead.proxima_consulta ? new Date(lead.proxima_consulta).toLocaleDateString() : 'N/A'}</p>
        </div>
        
        {lead.objetivo && (
          <Badge variant="outline" className="text-xs">
            {lead.objetivo}
          </Badge>
        )}
      </div>
    </Card>
  );
};
