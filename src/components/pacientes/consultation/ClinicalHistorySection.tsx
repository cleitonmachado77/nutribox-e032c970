import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { useConsultationDataLoader } from "@/hooks/useConsultationDataLoader";
import { toast } from "sonner";

interface ClinicalHistorySectionProps {
  patientId: string;
  consultationId?: string;
}

export const ClinicalHistorySection = ({ patientId, consultationId }: ClinicalHistorySectionProps) => {
  const { saveClinicalHistory, isLoading } = useConsultationData(patientId, consultationId);
  const { loadClinicalHistory } = useConsultationDataLoader(patientId, consultationId);
  
  const [formData, setFormData] = useState({
    preExistingConditions: "",
    surgeries: "",
    medications: "",
    supplements: "",
    allergies: "",
    familyHistory: "",
    hereditaryDiseases: ""
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const data = await loadClinicalHistory();
        if (data) {
          setFormData({
            preExistingConditions: data.pre_existing_conditions,
            surgeries: data.surgeries,
            medications: data.medications,
            supplements: data.supplements,
            allergies: data.allergies,
            familyHistory: data.family_history,
            hereditaryDiseases: data.hereditary_diseases
          });
        }
      } catch (error) {
        console.error('Error loading clinical history data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [patientId, consultationId]);

  const handleSave = async () => {
    try {
      await saveClinicalHistory({
        pre_existing_conditions: formData.preExistingConditions,
        surgeries: formData.surgeries,
        medications: formData.medications,
        supplements: formData.supplements,
        allergies: formData.allergies,
        family_history: formData.familyHistory,
        hereditary_diseases: formData.hereditaryDiseases
      });
      toast.success("Histórico clínico salvo com sucesso!");
    } catch (error) {
      console.error('Error saving clinical history:', error);
      toast.error("Erro ao salvar histórico clínico");
    }
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Histórico Clínico
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
          <Stethoscope className="w-5 h-5" />
          Histórico Clínico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Doenças Pré-Existentes</Label>
            <Textarea 
              value={formData.preExistingConditions}
              onChange={(e) => setFormData({...formData, preExistingConditions: e.target.value})}
              placeholder="Descreva doenças pré-existentes..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Cirurgias</Label>
            <Textarea 
              value={formData.surgeries}
              onChange={(e) => setFormData({...formData, surgeries: e.target.value})}
              placeholder="Histórico de cirurgias..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Uso de Medicamentos</Label>
            <Textarea 
              value={formData.medications}
              onChange={(e) => setFormData({...formData, medications: e.target.value})}
              placeholder="Medicamentos em uso..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Uso de Suplementos</Label>
            <Textarea 
              value={formData.supplements}
              onChange={(e) => setFormData({...formData, supplements: e.target.value})}
              placeholder="Suplementos em uso..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Alergias ou Intolerâncias Alimentares</Label>
            <Textarea 
              value={formData.allergies}
              onChange={(e) => setFormData({...formData, allergies: e.target.value})}
              placeholder="Alergias e intolerâncias..."
            />
          </div>
          
          <div className="space-y-2">
            <Label>Histórico Familiar</Label>
            <Textarea 
              value={formData.familyHistory}
              onChange={(e) => setFormData({...formData, familyHistory: e.target.value})}
              placeholder="Histórico familiar relevante..."
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Doenças Hereditárias</Label>
          <Textarea 
            value={formData.hereditaryDiseases}
            onChange={(e) => setFormData({...formData, hereditaryDiseases: e.target.value})}
            placeholder="Doenças hereditárias..."
          />
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
