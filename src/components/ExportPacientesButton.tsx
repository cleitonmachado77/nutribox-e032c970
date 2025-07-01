
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportPacientesButtonProps {
  pacientes: any[];
}

export const ExportPacientesButton = ({ pacientes }: ExportPacientesButtonProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exportação de pacientes estará disponível em breve.",
    });
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="w-4 h-4 mr-2" />
      Exportar
    </Button>
  );
};
