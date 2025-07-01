
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImportPacientesDialogProps {
  children: React.ReactNode;
}

export const ImportPacientesDialog = ({ children }: ImportPacientesDialogProps) => {
  const { toast } = useToast();

  const handleImport = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A importação de pacientes estará disponível em breve.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Pacientes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Funcionalidade em desenvolvimento...</p>
          <Button onClick={handleImport} className="w-full">
            Importar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
