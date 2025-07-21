
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { useConsultationDataLoader } from "@/hooks/useConsultationDataLoader";
import { toast } from "sonner";

interface NutritionalPlanStructureSectionProps {
  patientId: string;
  consultationId?: string;
}

export const NutritionalPlanStructureSection = ({ patientId, consultationId }: NutritionalPlanStructureSectionProps) => {
  const { saveNutritionalStructure, isLoading } = useConsultationData(patientId, consultationId);
  const { loadNutritionalStructure } = useConsultationDataLoader(patientId, consultationId);
  
  const [formData, setFormData] = useState({
    dailyCalories: "",
    carbsPercentage: "",
    carbsGrams: "",
    proteinsPercentage: "",
    proteinsGrams: "",
    fatsPercentage: "",
    fatsGrams: "",
    selectedMeals: [] as string[]
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  const meals = [
    "Café da Manhã",
    "Lanche da Manhã", 
    "Almoço",
    "Lanche da Tarde",
    "Pré-Treino",
    "Jantar",
    "Ceia"
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const data = await loadNutritionalStructure();
        if (data) {
          setFormData({
            dailyCalories: data.daily_calories,
            carbsPercentage: data.carbs_percentage,
            carbsGrams: data.carbs_grams,
            proteinsPercentage: data.proteins_percentage,
            proteinsGrams: data.proteins_grams,
            fatsPercentage: data.fats_percentage,
            fatsGrams: data.fats_grams,
            selectedMeals: data.selected_meals
          });
        }
      } catch (error) {
        console.error('Error loading nutritional structure data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [patientId]);

  const toggleMeal = (meal: string) => {
    if (formData.selectedMeals.includes(meal)) {
      setFormData({
        ...formData,
        selectedMeals: formData.selectedMeals.filter(m => m !== meal)
      });
    } else {
      setFormData({
        ...formData,
        selectedMeals: [...formData.selectedMeals, meal]
      });
    }
  };

  const handleSave = async () => {
    try {
      await saveNutritionalStructure({
        daily_calories: formData.dailyCalories,
        carbs_percentage: formData.carbsPercentage,
        carbs_grams: formData.carbsGrams,
        proteins_percentage: formData.proteinsPercentage,
        proteins_grams: formData.proteinsGrams,
        fats_percentage: formData.fatsPercentage,
        fats_grams: formData.fatsGrams,
        selected_meals: formData.selectedMeals
      });
      toast.success("Estrutura do plano alimentar salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar estrutura do plano alimentar");
    }
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Estrutura do Plano Alimentar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Estrutura do Plano Alimentar
          {consultationId && (
            <span className="text-sm text-gray-500 ml-2">
              (Consulta #{consultationId.slice(-4)})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Quantidade Calórica/Dia</Label>
          <Input 
            value={formData.dailyCalories}
            onChange={(e) => setFormData({...formData, dailyCalories: e.target.value})}
            placeholder="Calorias por dia"
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Distribuição dos Macros</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label>Carboidratos</Label>
              <div className="space-y-2">
                <Input 
                  value={formData.carbsPercentage}
                  onChange={(e) => setFormData({...formData, carbsPercentage: e.target.value})}
                  placeholder="% Carboidratos"
                />
                <Input 
                  value={formData.carbsGrams}
                  onChange={(e) => setFormData({...formData, carbsGrams: e.target.value})}
                  placeholder="g/dia"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Proteínas</Label>
              <div className="space-y-2">
                <Input 
                  value={formData.proteinsPercentage}
                  onChange={(e) => setFormData({...formData, proteinsPercentage: e.target.value})}
                  placeholder="% Proteínas"
                />
                <Input 
                  value={formData.proteinsGrams}
                  onChange={(e) => setFormData({...formData, proteinsGrams: e.target.value})}
                  placeholder="g/dia"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Gorduras</Label>
              <div className="space-y-2">
                <Input 
                  value={formData.fatsPercentage}
                  onChange={(e) => setFormData({...formData, fatsPercentage: e.target.value})}
                  placeholder="% Gorduras"
                />
                <Input 
                  value={formData.fatsGrams}
                  onChange={(e) => setFormData({...formData, fatsGrams: e.target.value})}
                  placeholder="g/dia"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Refeições e Quantidade</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {meals.map((meal) => (
              <div key={meal} className="flex items-center space-x-2">
                <Checkbox 
                  checked={formData.selectedMeals.includes(meal)}
                  onCheckedChange={() => toggleMeal(meal)}
                />
                <label className="text-sm">{meal}</label>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !consultationId}
          className="w-full"
        >
          {isLoading ? "Salvando..." : "Salvar Dados"}
        </Button>
        
        {!consultationId && (
          <p className="text-sm text-amber-600 text-center">
            Selecione uma consulta para salvar os dados
          </p>
        )}
      </CardContent>
    </Card>
  );
};
