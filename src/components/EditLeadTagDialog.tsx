import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useObjetivoTags } from "@/hooks/useObjetivoTags";
import { useUpdateLead, Lead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";

interface EditLeadTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export const EditLeadTagDialog = ({ open, onOpenChange, lead }: EditLeadTagDialogProps) => {
  const { data: objetivoTags = [] } = useObjetivoTags();
  const updateLead = useUpdateLead();
  const { toast } = useToast();
  
  const [selectedTagId, setSelectedTagId] = useState<string>(lead?.objetivo_tag_id || "none");

  const handleUpdateTag = async () => {
    if (!lead) return;

    try {
      await updateLead.mutateAsync({
        id: lead.id,
        leadData: {
          objetivo_tag_id: selectedTagId === "none" ? null : selectedTagId,
        }
      });

      toast({
        title: "Sucesso!",
        description: "Tag de objetivo atualizada com sucesso.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar tag. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tag de Objetivo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Lead: <strong>{lead.nome}</strong>
            </p>
            <Select 
              value={selectedTagId} 
              onValueChange={setSelectedTagId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem tag</SelectItem>
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

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleUpdateTag} 
              disabled={updateLead.isPending}
              className="flex-1"
            >
              {updateLead.isPending ? "Salvando..." : "Salvar Tag"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
