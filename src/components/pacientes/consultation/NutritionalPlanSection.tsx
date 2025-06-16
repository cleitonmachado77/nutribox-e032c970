
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Utensils } from "lucide-react";

interface NutritionalPlanSectionProps {
  patientId: string;
}

export const NutritionalPlanSection = ({ patientId }: NutritionalPlanSectionProps) => {
  const [planContent, setPlanContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setPlanContent(`
PLANO ALIMENTAR PERSONALIZADO

CAFÉ DA MANHÃ (7h00)
- 1 fatia de pão integral
- 1 ovo cozido
- 1 copo de leite desnatado
- 1 banana média

LANCHE DA MANHÃ (10h00)
- 1 iogurte natural
- 1 colher de sopa de granola

ALMOÇO (12h30)
- 150g de frango grelhado
- 3 colheres de sopa de arroz integral
- 2 colheres de sopa de feijão
- Salada verde à vontade
- 1 colher de sopa de azeite

LANCHE DA TARDE (15h30)
- 1 maçã
- 10 castanhas

JANTAR (19h00)
- 120g de peixe grelhado
- 2 colheres de sopa de quinoa
- Legumes refogados
- Salada de folhas verdes

CEIA (21h30)
- 1 copo de leite desnatado
- 2 castanhas do Brasil
      `);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSavePlan = () => {
    console.log("Saving nutritional plan for patient:", patientId, planContent);
  };

  const handleExportPlan = () => {
    console.log("Exporting nutritional plan for patient:", patientId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Plano Alimentar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={handleGeneratePlan} 
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? "Gerando..." : "Gerar Novo Plano"}
          </Button>
          <Button variant="outline" onClick={handleExportPlan}>
            Exportar Plano
          </Button>
        </div>
        
        <Textarea
          value={planContent}
          onChange={(e) => setPlanContent(e.target.value)}
          placeholder="O plano alimentar será gerado aqui com base nas informações coletadas..."
          className="min-h-[400px] font-mono text-sm"
        />
        
        <div className="flex gap-2">
          <Button onClick={handleSavePlan} className="flex-1">
            Salvar Plano
          </Button>
          <Button variant="outline">
            Editar Plano
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
