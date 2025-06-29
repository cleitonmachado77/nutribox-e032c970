
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { useConsultationDataLoader } from "@/hooks/useConsultationDataLoader";
import { toast } from "sonner";

interface EmotionalAssessmentSectionProps {
  patientId: string;
  consultationId?: string;
}

export const EmotionalAssessmentSection = ({ patientId, consultationId }: EmotionalAssessmentSectionProps) => {
  const { saveEmotionalAssessment, isLoading } = useConsultationData(patientId, consultationId);
  const { loadEmotionalAssessment } = useConsultationDataLoader(patientId, consultationId);
  
  const [formData, setFormData] = useState({
    relationshipWithFood: "",
    eatingTriggers: "",
    emotionalState: "",
    stressLevel: "",
    foodAnxiety: ""
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const data = await loadEmotionalAssessment();
        if (data) {
          setFormData({
            relationshipWithFood: data.relationship_with_food,
            eatingTriggers: data.eating_triggers,
            emotionalState: data.emotional_state,
            stressLevel: data.stress_level,
            foodAnxiety: data.food_anxiety
          });
        }
      } catch (error) {
        console.error('Error loading emotional assessment data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [patientId, consultationId]);

  const handleSave = async () => {
    try {
      await saveEmotionalAssessment({
        relationship_with_food: formData.relationshipWithFood,
        eating_triggers: formData.eatingTriggers,
        emotional_state: formData.emotionalState,
        stress_level: formData.stressLevel,
        food_anxiety: formData.foodAnxiety
      });
      toast.success("Avaliação emocional salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar avaliação emocional");
    }
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Avaliação Emocional
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
          Avaliação Emocional
          {consultationId && (
            <span className="text-sm text-gray-500 ml-2">
              (Consulta #{consultationId.slice(-4)})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Relação com a Comida</Label>
            <Select value={formData.relationshipWithFood} onValueChange={(value) => setFormData({...formData, relationshipWithFood: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Como você descreveria sua relação com a comida?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saudavel">Saudável e equilibrada</SelectItem>
                <SelectItem value="asiosa">Ansiosa e impulsiva</SelectItem>
                <SelectItem value="restritiva">Restritiva e controlada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Gatilhos Alimentares</Label>
            <Select value={formData.eatingTriggers} onValueChange={(value) => setFormData({...formData, eatingTriggers: value})}>
              <SelectTrigger>
                <SelectValue placeholder="O que te leva a comer?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estresse">Estresse e ansiedade</SelectItem>
                <SelectItem value="emocoes">Emoções como tristeza ou alegria</SelectItem>
                <SelectItem value="habito">Hábito ou tédio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Estado Emocional</Label>
            <Select value={formData.emotionalState} onValueChange={(value) => setFormData({...formData, emotionalState: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Como você se sente geralmente?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calmo">Calmo e relaxado</SelectItem>
                <SelectItem value="ansioso">Ansioso e preocupado</SelectItem>
                <SelectItem value="triste">Triste e desanimado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Nível de Estresse</Label>
            <Select value={formData.stressLevel} onValueChange={(value) => setFormData({...formData, stressLevel: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Qual seu nível de estresse?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixo">Baixo</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Ansiedade por Comida</Label>
            <Select value={formData.foodAnxiety} onValueChange={(value) => setFormData({...formData, foodAnxiety: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Você sente ansiedade por comida?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim, frequentemente</SelectItem>
                <SelectItem value="asVezes">Às vezes</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
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
