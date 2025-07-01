
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useObjetivoTags } from "@/hooks/useObjetivoTags";
import { useUpdateLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/hooks/useLeads";

interface EditPacienteTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Lead | null;
}

export const EditPacienteTagDialog = ({ open, onOpenChange, paciente }: EditPacienteTagDialogProps) => {
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const { data: objetivoTags = [] } = useObjetivoTags();
  const updatePaciente = useUpdateLead();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!paciente) return;

    try {
      await updatePaciente.mutateAsync({
        id: paciente.id,
        leadData: { objetivo_tag_id: selectedTagId || null }
      });

      toast({
        title: "Sucesso!",
        description: "Tag do paciente atualizada com sucesso.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating paciente tag:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tag. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tag do Paciente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {paciente && (
            <div className="text-center">
              <p className="font-medium">{paciente.nome}</p>
              <p className="text-sm text-gray-600">{paciente.telefone}</p>
            </div>
          )}

          <div>
            <Select value={selectedTagId} onValueChange={setSelectedTagId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem tag</SelectItem>
                {objetivoTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.cor }}
                      />
                      {tag.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={updatePaciente.isPending} className="flex-1">
              {updatePaciente.isPending ? "Salvando..." : "Salvar"}
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
