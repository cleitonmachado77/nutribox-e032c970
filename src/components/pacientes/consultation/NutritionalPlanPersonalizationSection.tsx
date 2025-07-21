import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { useConsultationDataLoader } from "@/hooks/useConsultationDataLoader";
import { toast } from "sonner";

interface NutritionalPlanPersonalizationSectionProps {
  patientId: string;
  consultationId?: string;
}

export const NutritionalPlanPersonalizationSection = ({ patientId, consultationId }: NutritionalPlanPersonalizationSectionProps) => {
  const { saveNutritionalPersonalization, isLoading } = useConsultationData(patientId, consultationId);
  const { loadNutritionalPersonalization } = useConsultationDataLoader(patientId, consultationId);
  
  const [formData, setFormData] = useState({
    preferredMeals: "",
    avoidedMeals: "",
    preferredFoods: "",
    avoidedFoods: "",
    perfectMeals: "",
    vegetables: "",
    fruits: "",
    objects: "",
    limitations: ""
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const data = await loadNutritionalPersonalization();
        if (data) {
          setFormData({
            preferredMeals: data.preferred_meals,
            avoidedMeals: data.avoided_meals,
            preferredFoods: data.preferred_foods,
            avoidedFoods: data.avoided_foods,
            perfectMeals: data.perfect_meals,
            vegetables: data.vegetables,
            fruits: data.fruits,
            objects: data.objects,
            limitations: data.limitations
          });
        }
      } catch (error) {
        console.error('Error loading nutritional personalization data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [patientId, consultationId]);

  const handleSave = async () => {
    try {
      await saveNutritionalPersonalization({
        preferred_meals: formData.preferredMeals,
        avoided_meals: formData.avoidedMeals,
        preferred_foods: formData.preferredFoods,
        avoided_foods: formData.avoidedFoods,
        perfect_meals: formData.perfectMeals,
        vegetables: formData.vegetables,
        fruits: formData.fruits,
        objects: formData.objects,
        limitations: formData.limitations
      });
      toast.success("Personalização do plano alimentar salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar personalização do plano alimentar");
    }
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Personalização do Plano Alimentar
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
          <Heart className="w-5 h-5" />
          Personalização do Plano Alimentar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Refeições Preferidas</Label>
            <Textarea 
              value={formData.preferredMeals}
              onChange={(e) => setFormData({...formData, preferredMeals: e.target.value})}
              placeholder="Quais as refeições de um dia mais te dá prazer e/ou apetite?"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Refeições Preteridas</Label>
            <Textarea 
              value={formData.avoidedMeals}
              onChange={(e) => setFormData({...formData, avoidedMeals: e.target.value})}
              placeholder="Quais as refeições de um dia menos te dá prazer e/ou apetite?"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Alimentos Preferidos</Label>
            <Textarea 
              value={formData.preferredFoods}
              onChange={(e) => setFormData({...formData, preferredFoods: e.target.value})}
              placeholder="Quais alimentos você mais gosta e gostaria que estivessem no plano?"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Alimentos Preteridos</Label>
            <Textarea 
              value={formData.avoidedFoods}
              onChange={(e) => setFormData({...formData, avoidedFoods: e.target.value})}
              placeholder="Quais alimentos você não gosta e gostaria de se evitar no plano?"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Refeição Perfeita</Label>
            <Textarea 
              value={formData.perfectMeals}
              onChange={(e) => setFormData({...formData, perfectMeals: e.target.value})}
              placeholder="Cite 2 refeições que você considera perfeita e você comeria todos os dias"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Verduras ou Legumes</Label>
            <Textarea 
              value={formData.vegetables}
              onChange={(e) => setFormData({...formData, vegetables: e.target.value})}
              placeholder="Quais as verduras ou legumes você mais gosta ou é mais suscetível a comer?"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Frutas</Label>
            <Textarea 
              value={formData.fruits}
              onChange={(e) => setFormData({...formData, fruits: e.target.value})}
              placeholder="Quais frutas você mais gosta ou é mais suscetível a comer?"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Objetos</Label>
            <Textarea 
              value={formData.objects}
              onChange={(e) => setFormData({...formData, objects: e.target.value})}
              placeholder="Você tem acessos a micro-ondas, fogão, airfryer e marmitas?"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label>Limitações</Label>
            <Textarea 
              value={formData.limitations}
              onChange={(e) => setFormData({...formData, limitations: e.target.value})}
              placeholder="Tem alguma limitação de tempo ou recursos para cozinhar?"
            />
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
