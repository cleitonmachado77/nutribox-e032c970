import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, FileText, ShoppingCart, Pill, Target } from "lucide-react";

interface PrintsSectionProps {
  patientId: string;
  consultationId?: string;
}

export const PrintsSection = ({ patientId, consultationId }: PrintsSectionProps) => {
  const handlePrint = (type: string) => {
    console.log(`Printing ${type} for patient:`, patientId);
  };

  const printOptions = [
    {
      id: "plano-alimentar",
      title: "Plano Alimentar",
      description: "Imprime o plano alimentar completo do paciente",
      icon: FileText
    },
    {
      id: "lista-compras",
      title: "Lista de Compras",
      description: "Imprime a lista de compras consolidada",
      icon: ShoppingCart
    },
    {
      id: "prescricoes",
      title: "Prescrições",
      description: "Imprime prescrições e orientações",
      icon: Pill
    },
    {
      id: "metas-checklist",
      title: "Metas e Checklist",
      description: "Imprime as metas e checklist do paciente",
      icon: Target
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="w-5 h-5" />
          Impressos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Todas as edições devem ter sido feitas e salvas nas seções anteriores. 
          Aqui você pode apenas imprimir os documentos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {printOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card key={option.id} className="border-2 hover:border-purple-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium">{option.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  <Button 
                    onClick={() => handlePrint(option.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
