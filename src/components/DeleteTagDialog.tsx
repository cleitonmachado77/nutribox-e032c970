
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: { id: string; nome: string; cor: string } | null;
}

export const DeleteTagDialog = ({ open, onOpenChange, tag }: DeleteTagDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteTag = async () => {
    if (!tag) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('objetivo_tags')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Tag de objetivo excluída com sucesso.",
      });

      queryClient.invalidateQueries({ queryKey: ['objetivo-tags'] });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir tag. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!tag) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir Tag</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Tem certeza que deseja excluir a tag <strong>{tag.nome}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            Esta ação não pode ser desfeita. A tag será removida de todos os leads que a utilizam.
          </p>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleDeleteTag} 
              disabled={isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? "Excluindo..." : "Excluir Tag"}
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
