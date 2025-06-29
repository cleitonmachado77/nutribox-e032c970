import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Target } from "lucide-react";

interface GoalsSectionProps {
  patientId: string;
  consultationId?: string;
}

export const GoalsSection = ({ patientId, consultationId }: GoalsSectionProps) => {
  const [goals, setGoals] = useState({
    physical: "",
    behavioral: "",
    wellness: ""
  });

  const [checklist, setChecklist] = useState({
    behavioral: [] as string[],
    emotional: [] as string[],
    wellness: [] as string[]
  });

  const checklistItems = {
    behavioral: [
      "Seguir horários das refeições",
      "Mastigar devagar",
      "Beber água antes das refeições",
      "Evitar distrações durante as refeições"
    ],
    emotional: [
      "Praticar mindfulness",
      "Identificar gatilhos emocionais",
      "Buscar alternativas ao comer emocional",
      "Celebrar pequenas conquistas"
    ],
    wellness: [
      "Dormir 8 horas por noite",
      "Praticar atividade física 3x por semana",
      "Dedicar tempo para relaxar",
      "Manter hidratação adequada"
    ]
  };

  const toggleChecklistItem = (category: keyof typeof checklist, item: string) => {
    setChecklist(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const handleSave = () => {
    console.log("Saving goals for patient:", patientId, { goals, checklist });
  };

  const handleExport = () => {
    console.log("Exporting goals and checklist for patient:", patientId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Metas e Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Metas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Meta Física</Label>
              <Textarea 
                value={goals.physical}
                onChange={(e) => setGoals({...goals, physical: e.target.value})}
                placeholder="Definir meta física..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Meta Comportamental</Label>
              <Textarea 
                value={goals.behavioral}
                onChange={(e) => setGoals({...goals, behavioral: e.target.value})}
                placeholder="Definir meta comportamental..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Meta de Bem-Estar</Label>
              <Textarea 
                value={goals.wellness}
                onChange={(e) => setGoals({...goals, wellness: e.target.value})}
                placeholder="Definir meta de bem-estar..."
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(checklistItems).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium capitalize">{category === "behavioral" ? "Comportamental" : category === "emotional" ? "Emocional" : "Bem Estar"}</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={checklist[category as keyof typeof checklist].includes(item)}
                        onCheckedChange={() => toggleChecklistItem(category as keyof typeof checklist, item)}
                      />
                      <label className="text-sm">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Salvar Dados
          </Button>
          <Button variant="outline" onClick={handleExport}>
            Exportar Metas e Checklist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
