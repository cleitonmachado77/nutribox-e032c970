
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { useDeletePaciente } from "@/hooks/useDeletePaciente";
import { Paciente } from "@/hooks/usePacientes";

interface DeletePacienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Paciente | null;
}

export const DeletePacienteDialog = ({ open, onOpenChange, paciente }: DeletePacienteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const deletePaciente = useDeletePaciente();

  const handleDelete = async () => {
    if (!paciente?.id) {
      console.error('No paciente ID provided for deletion');
      toast({
        title: "Erro",
        description: "ID do paciente não encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Starting delete process for paciente:', paciente.id, 'Paciente name:', paciente.lead.nome);
      await deletePaciente.mutateAsync(paciente.id);
      toast({
        title: "Sucesso!",
        description: `Paciente ${paciente.lead.nome} foi excluído com sucesso.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting paciente:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir paciente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!paciente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Excluir Paciente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">{paciente.lead.nome}</p>
            <p className="text-sm text-gray-600">{paciente.lead.telefone}</p>
            <p className="text-xs text-gray-500">ID: {paciente.id}</p>
          </div>
          
          <div className="border rounded-lg p-4 bg-red-50">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. Todos os dados do paciente, incluindo consultas realizadas e arquivos, serão permanentemente removidos.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleDelete} 
              disabled={isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? "Excluindo..." : "Excluir Paciente"}
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
