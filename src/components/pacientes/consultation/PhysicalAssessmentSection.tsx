
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

interface PhysicalAssessmentSectionProps {
  patientId: string;
}

export const PhysicalAssessmentSection = ({ patientId }: PhysicalAssessmentSectionProps) => {
  const [formData, setFormData] = useState({
    currentWeight: "",
    currentIMC: "",
    bodyFatPercentage: "",
    waistCircumference: "",
    hipCircumference: "",
    armCircumference: "",
    thighCircumference: ""
  });

  const handleSave = () => {
    console.log("Saving physical assessment for patient:", patientId, formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Avaliação Física
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Peso Atual</Label>
            <Input 
              value={formData.currentWeight}
              onChange={(e) => setFormData({...formData, currentWeight: e.target.value})}
              placeholder="kg"
            />
          </div>
          
          <div className="space-y-2">
            <Label>IMC</Label>
            <Input 
              value={formData.currentIMC}
              onChange={(e) => setFormData({...formData, currentIMC: e.target.value})}
              placeholder="kg/m²"
            />
          </div>
          
          <div className="space-y-2">
            <Label>% Gordura Corporal</Label>
            <Input 
              value={formData.bodyFatPercentage}
              onChange={(e) => setFormData({...formData, bodyFatPercentage: e.target.value})}
              placeholder="%"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Circunferências:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cintura</Label>
              <Input 
                value={formData.waistCircumference}
                onChange={(e) => setFormData({...formData, waistCircumference: e.target.value})}
                placeholder="cm"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Quadril</Label>
              <Input 
                value={formData.hipCircumference}
                onChange={(e) => setFormData({...formData, hipCircumference: e.target.value})}
                placeholder="cm"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Braço</Label>
              <Input 
                value={formData.armCircumference}
                onChange={(e) => setFormData({...formData, armCircumference: e.target.value})}
                placeholder="cm"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Coxa</Label>
              <Input 
                value={formData.thighCircumference}
                onChange={(e) => setFormData({...formData, thighCircumference: e.target.value})}
                placeholder="cm"
              />
            </div>
          </div>
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Salvar Dados
        </Button>
      </CardContent>
    </Card>
  );
};
