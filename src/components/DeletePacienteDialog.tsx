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
  onDeleteSuccess?: (pacienteId: string) => void;
}

export const DeletePacienteDialog = ({ 
  open, 
  onOpenChange, 
  paciente, 
  onDeleteSuccess 
}: DeletePacienteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const deletePaciente = useDeletePaciente();

  const handleDelete = async () => {
    if (!paciente?.id) {
      console.error('ID do paciente não encontrado');
      toast({
        title: "Erro",
        description: "ID do paciente não encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    console.log('=== INICIANDO PROCESSO DE EXCLUSÃO ===');
    console.log('Paciente:', paciente.lead.nome, 'ID:', paciente.id);
    
    try {
      const result = await deletePaciente.mutateAsync(paciente.id);
      console.log('Resultado da deleção:', result);
      
      toast({
        title: "Sucesso!",
        description: `Paciente ${paciente.lead.nome} foi excluído permanentemente.`,
      });
      
      // Chamar callback de sucesso se fornecido
      if (onDeleteSuccess) {
        onDeleteSuccess(paciente.id);
      }
      
      // Fechar o dialog imediatamente
      onOpenChange(false);
      
      console.log('Dialog fechado e toast exibido');
      
    } catch (error: any) {
      console.error('=== ERRO NA EXCLUSÃO ===');
      console.error('Erro:', error);
      
      toast({
        title: "Erro",
        description: error?.message || "Erro ao excluir paciente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false);
    }
  };

  if (!paciente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Excluir Paciente Permanentemente
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
              <strong>⚠️ ATENÇÃO:</strong> Esta ação é <strong>IRREVERSÍVEL</strong>. 
              Todos os dados do paciente serão <strong>PERMANENTEMENTE REMOVIDOS</strong> do banco de dados, incluindo:
            </p>
            <ul className="list-disc list-inside text-xs text-red-700 mt-2 space-y-1">
              <li>Histórico de consultas realizadas</li>
              <li>Arquivos e documentos anexados</li>
              <li>Consultas agendadas</li>
              <li>Dados pessoais e médicos</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleDelete} 
              disabled={isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? "Excluindo..." : "EXCLUIR PERMANENTEMENTE"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              className="flex-1"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
