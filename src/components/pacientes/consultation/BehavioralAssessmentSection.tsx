
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { toast } from "sonner";

interface BehavioralAssessmentSectionProps {
  patientId: string;
}

export const BehavioralAssessmentSection = ({ patientId }: BehavioralAssessmentSectionProps) => {
  const { saveBehavioralAssessment, isLoading } = useConsultationData(patientId);
  
  const [formData, setFormData] = useState({
    planConsistency: "",
    mealFrequency: "",
    mealTime: "",
    vegetableFruits: "",
    fluidIntake: ""
  });

  const handleSave = async () => {
    try {
      await saveBehavioralAssessment({
        plan_consistency: formData.planConsistency,
        meal_frequency: formData.mealFrequency,
        meal_time: formData.mealTime,
        vegetable_fruits: formData.vegetableFruits,
        fluid_intake: formData.fluidIntake
      });
      toast.success("Avaliação comportamental salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar avaliação comportamental");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Avaliação Comportamental
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Consistência no Plano</Label>
            <Select value={formData.planConsistency} onValueChange={(value) => setFormData({...formData, planConsistency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim - Sigo pelo menos 90% do plano</SelectItem>
                <SelectItem value="nao">Não - Tenho dificuldades para seguir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Frequência de Refeições</Label>
            <Select value={formData.mealFrequency} onValueChange={(value) => setFormData({...formData, mealFrequency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-3">2 a 3 refeições por dia, sem horários definidos</SelectItem>
                <SelectItem value="4">Em torno de 4 refeições por dia</SelectItem>
                <SelectItem value="5-6">Faço 5 a 6 refeições por dia, com intervalos regulares</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tempo de Refeição</Label>
            <Select value={formData.mealTime} onValueChange={(value) => setFormData({...formData, mealTime: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menos-10">Como em menos de 10 minutos</SelectItem>
                <SelectItem value="15">Levo em média 15 minutos</SelectItem>
                <SelectItem value="15-25">Levo de 15 a 25 minutos, comendo com calma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Consumo de Frutas / Verduras</Label>
            <Select value={formData.vegetableFruits} onValueChange={(value) => setFormData({...formData, vegetableFruits: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="1-2">Sim. Em 1 ou 2 refeições por dia</SelectItem>
                <SelectItem value="3-mais">Sim. Em 3 ou mais refeições no dia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Ingestão de Líquido</Label>
            <Select value={formData.fluidIntake} onValueChange={(value) => setFormData({...formData, fluidIntake: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menos-1.8">Acho que não chego nem a 1,8L</SelectItem>
                <SelectItem value="1.8-2.3">Bebo entre 1,8L e 2,3L dependendo do dia</SelectItem>
                <SelectItem value="mais-2.3">Sim, bebo mais de 2,3L por dia com constância</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Salvando..." : "Salvar Dados"}
        </Button>
      </CardContent>
    </Card>
  );
};
