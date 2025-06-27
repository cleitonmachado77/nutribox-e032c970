
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Utensils } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { toast } from "sonner";

interface NutritionalPlanSectionProps {
  patientId: string;
}

export const NutritionalPlanSection = ({ patientId }: NutritionalPlanSectionProps) => {
  const { generateNutritionalPlan, getSavedNutritionalPlan, isLoading } = useConsultationData(patientId);
  const [planContent, setPlanContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadSavedPlan();
  }, []);

  const loadSavedPlan = async () => {
    try {
      const savedPlan = await getSavedNutritionalPlan();
      if (savedPlan) {
        setPlanContent(savedPlan);
      }
    } catch (error) {
      console.error("Error loading saved plan:", error);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const generatedPlan = await generateNutritionalPlan();
      setPlanContent(generatedPlan);
      toast.success("Plano alimentar gerado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar plano alimentar. Certifique-se de que todas as avaliações foram preenchidas.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPlan = () => {
    if (!planContent) {
      toast.error("Nenhum plano para exportar");
      return;
    }

    const blob = new Blob([planContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-alimentar-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Plano exportado com sucesso!");
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
            disabled={isGenerating || isLoading}
            className="flex-1"
          >
            {isGenerating ? "Gerando..." : "Gerar Plano Inteligente"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportPlan}
            disabled={!planContent}
          >
            Exportar Plano
          </Button>
        </div>
        
        <Textarea
          value={planContent}
          onChange={(e) => setPlanContent(e.target.value)}
          placeholder="O plano alimentar será gerado aqui com base nas informações coletadas das avaliações..."
          className="min-h-[400px] font-mono text-sm"
        />
        
        {planContent && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            💡 <strong>Dica:</strong> Este plano foi gerado automaticamente baseado nas avaliações preenchidas. 
            Você pode editá-lo diretamente no campo acima para personalizar ainda mais conforme necessário.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
