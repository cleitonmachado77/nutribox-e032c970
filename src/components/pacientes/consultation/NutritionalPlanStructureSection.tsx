
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";

interface NutritionalPlanStructureSectionProps {
  patientId: string;
}

export const NutritionalPlanStructureSection = ({ patientId }: NutritionalPlanStructureSectionProps) => {
  const [formData, setFormData] = useState({
    patientObjective: "",
    dailyCalories: "",
    carbsPercentage: "",
    carbsGrams: "",
    proteinsPercentage: "",
    proteinsGrams: "",
    fatsPercentage: "",
    fatsGrams: "",
    selectedMeals: [] as string[]
  });

  const meals = [
    "Café da Manhã",
    "Lanche da Manhã", 
    "Almoço",
    "Lanche da Tarde",
    "Pré-Treino",
    "Jantar",
    "Ceia"
  ];

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

  const handleSave = () => {
    console.log("Saving nutritional plan structure for patient:", patientId, formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Estrutura do Plano Alimentar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Objetivo do Paciente</Label>
            <Select value={formData.patientObjective} onValueChange={(value) => setFormData({...formData, patientObjective: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                <SelectItem value="estetica">Estética</SelectItem>
                <SelectItem value="saude-longevidade">Saúde e Longevidade</SelectItem>
                <SelectItem value="performance">Performance Esportiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Quantidade Calórica/Dia</Label>
            <Input 
              value={formData.dailyCalories}
              onChange={(e) => setFormData({...formData, dailyCalories: e.target.value})}
              placeholder="Calorias por dia"
            />
          </div>
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
        
        <Button onClick={handleSave} className="w-full">
          Salvar Dados
        </Button>
      </CardContent>
    </Card>
  );
};
