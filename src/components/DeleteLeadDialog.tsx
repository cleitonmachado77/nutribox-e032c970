
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lead, useDeleteLead } from "@/hooks/useLeads";
import { AlertTriangle } from "lucide-react";

interface DeleteLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onDeleteSuccess?: () => void;
}

export const DeleteLeadDialog = ({ open, onOpenChange, lead, onDeleteSuccess }: DeleteLeadDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const deleteLead = useDeleteLead();

  const handleDelete = async () => {
    if (!lead?.id) {
      console.error('No lead ID provided for deletion');
      toast({
        title: "Erro",
        description: "ID do lead não encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Starting delete process for lead:', lead.id, 'Lead name:', lead.nome);
      await deleteLead.mutateAsync(lead.id);
      toast({
        title: "Sucesso!",
        description: `Lead ${lead.nome} foi excluído com sucesso.`,
      });
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir lead. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Excluir Lead
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">{lead.nome}</p>
            <p className="text-sm text-gray-600">{lead.telefone}</p>
            <p className="text-xs text-gray-500">ID: {lead.id}</p>
          </div>
          
          <div className="border rounded-lg p-4 bg-red-50">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. Todos os dados do lead e pacientes relacionados serão permanentemente removidos.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleDelete} 
              disabled={isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? "Excluindo..." : "Excluir Lead"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
