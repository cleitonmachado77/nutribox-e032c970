
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { toast } from "sonner";

interface WellnessAssessmentSectionProps {
  patientId: string;
}

export const WellnessAssessmentSection = ({ patientId }: WellnessAssessmentSectionProps) => {
  const { saveWellnessAssessment, isLoading } = useConsultationData(patientId);
  
  const [formData, setFormData] = useState({
    bodyImage: "",
    physicalEnergy: "",
    physicalActivity: "",
    sleep: "",
    journeyConfidence: ""
  });

  const handleSave = async () => {
    try {
      await saveWellnessAssessment({
        body_image: formData.bodyImage,
        physical_energy: formData.physicalEnergy,
        physical_activity: formData.physicalActivity,
        sleep: formData.sleep,
        journey_confidence: formData.journeyConfidence
      });
      toast.success("Avaliação de bem-estar salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar avaliação de bem-estar");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-5 h-5" />
          Avaliação de Bem Estar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Satisfação com o Corpo Atual</Label>
            <Select value={formData.bodyImage} onValueChange={(value) => setFormData({...formData, bodyImage: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Como você se sente com seu corpo hoje?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infeliz">Infeliz</SelectItem>
                <SelectItem value="neutro">Neutro(a)</SelectItem>
                <SelectItem value="feliz">Feliz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Energia Física</Label>
            <Select value={formData.physicalEnergy} onValueChange={(value) => setFormData({...formData, physicalEnergy: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Como você avalia sua energia física?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="moderada">Moderada</SelectItem>
                <SelectItem value="boa">Boa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Atividade Física</Label>
            <Select value={formData.physicalActivity} onValueChange={(value) => setFormData({...formData, physicalActivity: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Você realiza atividade física regularmente?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Qualidade do Sono</Label>
            <Select value={formData.sleep} onValueChange={(value) => setFormData({...formData, sleep: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Quantas horas de sono você tira durante a noite?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menos-6">Durmo menos de 6 horas por dia</SelectItem>
                <SelectItem value="7">Durmo aprox. 7 horas por dia</SelectItem>
                <SelectItem value="mais-8">Durmo mais de 8 horas por dia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Confiança na Jornada</Label>
            <Select value={formData.journeyConfidence} onValueChange={(value) => setFormData({...formData, journeyConfidence: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Como está seu nível de confiança na jornada?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Confiança baixa</SelectItem>
                <SelectItem value="media">Confiança média</SelectItem>
                <SelectItem value="alta">Confiança alta</SelectItem>
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
