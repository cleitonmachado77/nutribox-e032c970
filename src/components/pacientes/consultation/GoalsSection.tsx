
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, TrendingUp, Activity, Heart } from "lucide-react";
import { usePatientCurrentData } from "@/hooks/usePatientCurrentData";

interface GoalsSectionProps {
  patientId: string;
  consultationId?: string;
}

export const GoalsSection = ({ patientId, consultationId }: GoalsSectionProps) => {
  const { currentData, isLoading } = usePatientCurrentData(patientId);
  
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

  const formatValue = (value?: string) => {
    return value && value.trim() !== "" ? value : "Não informado";
  };

  return (
    <div className="space-y-6">
      {/* Dados Atuais do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Dados Atuais do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Carregando dados atuais...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dados Físicos */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Dados Físicos Atuais
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peso Atual:</span>
                    <Badge variant="outline">{formatValue(currentData.peso_atual)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IMC:</span>
                    <Badge variant="outline">{formatValue(currentData.imc)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">% Gordura Corporal:</span>
                    <Badge variant="outline">{formatValue(currentData.gordura_corporal)}</Badge>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600 font-medium">Circunferências:</span>
                    <div className="ml-2 space-y-1 mt-1">
                      <div className="flex justify-between text-xs">
                        <span>Cintura:</span>
                        <span>{formatValue(currentData.circunferencia_cintura)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Quadril:</span>
                        <span>{formatValue(currentData.circunferencia_quadril)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Braço:</span>
                        <span>{formatValue(currentData.circunferencia_braco)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Coxa:</span>
                        <span>{formatValue(currentData.circunferencia_coxa)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Comportamentais */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Comportamento Atual
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Consistência no Plano:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.plan_consistency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Frequência de Refeições:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.meal_frequency)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Consumo de Frutas/Verduras:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.vegetable_fruits)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ingestão de Líquido:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.fluid_intake)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dados de Bem-Estar */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Bem-Estar Atual
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Energia Física:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.physical_energy)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Atividade Física:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.physical_activity)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Qualidade do Sono:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.sleep)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Confiança na Jornada:</span>
                    <p className="text-xs mt-1 p-2 bg-gray-50 rounded">
                      {formatValue(currentData.journey_confidence)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Metas Definidas pelo Médico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Metas Definidas pelo Médico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Meta Física</Label>
                <Textarea 
                  value={goals.physical}
                  onChange={(e) => setGoals({...goals, physical: e.target.value})}
                  placeholder="Ex: Reduzir 5kg em 3 meses, diminuir gordura corporal para 20%..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Meta Comportamental</Label>
                <Textarea 
                  value={goals.behavioral}
                  onChange={(e) => setGoals({...goals, behavioral: e.target.value})}
                  placeholder="Ex: Fazer 5 refeições por dia, beber 2L de água diariamente..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Meta de Bem-Estar</Label>
                <Textarea 
                  value={goals.wellness}
                  onChange={(e) => setGoals({...goals, wellness: e.target.value})}
                  placeholder="Ex: Praticar exercícios 3x por semana, dormir 8h por noite..."
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Checklist de Acompanhamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(checklistItems).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium capitalize">
                    {category === "behavioral" ? "Comportamental" : 
                     category === "emotional" ? "Emocional" : "Bem-Estar"}
                  </h4>
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
              Salvar Metas e Dados
            </Button>
            <Button variant="outline" onClick={handleExport}>
              Exportar Comparativo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
