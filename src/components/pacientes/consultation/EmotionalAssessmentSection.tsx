
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface EmotionalAssessmentSectionProps {
  patientId: string;
}

const emotionalLimitations = [
  { id: "compulsao", name: "Compulsão Alimentar Noturna", description: "Você costuma comer em excesso à noite, mesmo sem fome real?" },
  { id: "ansiedade", name: "Ansiedade Pré-Refeição", description: "Você costuma ter uma cobrança excessiva com 'comer certo' ou 'engordar'?" },
  { id: "fome-emocional", name: "Fome Emocional", description: "Você costuma ter vontade de comer quando está triste, estressada, feliz ou carente?" },
  { id: "recompensa", name: "Episódios de Recompensa Alimentar", description: "É comum você comer algo 'proibido' como forma de compensação?" },
  { id: "culpa", name: "Culpa Pós-Alimentação", description: "Você costuma ter raiva de si, culpa ou arrependimento após comer?" },
  { id: "ciclo-menstrual", name: "Oscilação de Humor no Ciclo Menstrual", description: "Durante o seu ciclo menstrual, você sente mais vontade de doces?" },
  { id: "autoimagem", name: "Autoimagem Negativa (Body-Shame)", description: "É normal episódios em que você pensa que seu corpo 'não tem mais jeito'?" },
  { id: "controle", name: "Sensação de Falta de Controle", description: "É comum você sentir que 'perde o controle' diante de algum tipo de comida específico?" },
  { id: "estresse", name: "Estresse Crônico", description: "Você costuma comer de forma acelerada, sem tempo ou beliscando devido ao excesso de tensão?" }
];

export const EmotionalAssessmentSection = ({ patientId }: EmotionalAssessmentSectionProps) => {
  const [selectedLimitations, setSelectedLimitations] = useState<string[]>([]);

  const toggleLimitation = (limitationId: string) => {
    if (selectedLimitations.includes(limitationId)) {
      setSelectedLimitations(selectedLimitations.filter(id => id !== limitationId));
    } else if (selectedLimitations.length < 3) {
      setSelectedLimitations([...selectedLimitations, limitationId]);
    }
  };

  const handleSave = () => {
    console.log("Saving emotional assessment for patient:", patientId, selectedLimitations);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Avaliação Emocional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">
            Selecione as 3 limitações mais comuns (clique sobre o tema):
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emotionalLimitations.map((limitation) => (
              <div key={limitation.id} className="relative group">
                <Badge
                  variant={selectedLimitations.includes(limitation.id) ? "default" : "outline"}
                  className={`cursor-pointer p-3 w-full justify-start transition-colors ${
                    selectedLimitations.includes(limitation.id) 
                      ? "bg-purple-600 text-white" 
                      : "hover:bg-purple-50"
                  } ${
                    selectedLimitations.length >= 3 && !selectedLimitations.includes(limitation.id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => toggleLimitation(limitation.id)}
                >
                  {limitation.name}
                </Badge>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 bg-gray-800 text-white text-xs rounded p-2 w-64 shadow-lg">
                  {limitation.description}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Selecionadas: {selectedLimitations.length}/3
          </div>
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Salvar Dados
        </Button>
      </CardContent>
    </Card>
  );
};
