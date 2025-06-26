
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, Info } from "lucide-react";

interface EmotionalAssessmentSectionProps {
  patientId: string;
}

export const EmotionalAssessmentSection = ({ patientId }: EmotionalAssessmentSectionProps) => {
  const [selectedLimitations, setSelectedLimitations] = useState<string[]>([]);

  const limitacoes = [
    {
      id: 'compulsao_alimentar_noturna',
      label: 'Compulsão Alimentar Noturna',
      tooltip: 'Você costuma comer em excesso à noite, mesmo sem fome real?'
    },
    {
      id: 'ansiedade_pre_refeicao',
      label: 'Ansiedade Pré-Refeição',
      tooltip: 'Você costuma ter uma cobrança excessiva com "comer certo" ou "engordar"?'
    },
    {
      id: 'fome_emocional',
      label: 'Fome Emocional',
      tooltip: 'Você costuma ter vontade de comer quando está triste, estressada, feliz ou carente (sem fome real)?'
    },
    {
      id: 'episodios_recompensa',
      label: 'Episódios de Recompensa Alimentar',
      tooltip: 'É comum você comer algo "proibido" como forma de compensação (ex: "eu mereço")?'
    },
    {
      id: 'culpa_pos_alimentacao',
      label: 'Culpa Pós-Alimentação',
      tooltip: 'Você costuma ter raiva de si, culpa ou arrependimento após comer?'
    },
    {
      id: 'oscilacao_humor_ciclo',
      label: 'Oscilação de Humor no Ciclo Menstrual',
      tooltip: 'Durante o seu ciclo menstrual, você sente mais vontade de doces ou percebe episódios de compulsão? (para mulheres)'
    },
    {
      id: 'autoimagem_negativa',
      label: 'Autoimagem Negativa (Body-Shame)',
      tooltip: 'É normal episódios em que você pensa que seu corpo "não tem mais jeito" ou "não vale a pena tentar" e por isso você come mal?'
    },
    {
      id: 'falta_controle',
      label: 'Sensação de Falta de Controle',
      tooltip: 'É comum você sentir que "perde o controle" diante de algum tipo de comida específico?'
    },
    {
      id: 'estresse_cronico',
      label: 'Estresse Crônico',
      tooltip: 'Você costuma comer de forma acelerada, sem tempo ou beliscando devido ao excesso de tensão do trabalho, rotina ou família?'
    }
  ];

  const handleLimitationChange = (limitationId: string, checked: boolean) => {
    if (checked) {
      if (selectedLimitations.length < 3) {
        setSelectedLimitations(prev => [...prev, limitationId]);
      }
    } else {
      setSelectedLimitations(prev => prev.filter(id => id !== limitationId));
    }
  };

  const handleSave = () => {
    console.log("Saving emotional assessment for patient:", patientId, selectedLimitations);
  };

  return (
    <Card className="border-2 border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Avaliação Emocional
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Limitações Emocionais:
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Selecione até 3 limitações que mais impactam o paciente (máximo 3 opções)
          </p>
          
          <div className="mb-4">
            <span className="text-sm font-medium text-purple-600">
              {selectedLimitations.length}/3 selecionadas
            </span>
          </div>

          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {limitacoes.map((limitacao) => {
                const isSelected = selectedLimitations.includes(limitacao.id);
                const isDisabled = !isSelected && selectedLimitations.length >= 3;
                
                return (
                  <div 
                    key={limitacao.id} 
                    className={`p-4 border rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'border-purple-400 bg-purple-50' 
                        : isDisabled 
                        ? 'border-gray-200 bg-gray-50 opacity-50' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={limitacao.id}
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={(checked) => handleLimitationChange(limitacao.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label 
                            htmlFor={limitacao.id}
                            className={`text-sm font-medium cursor-pointer ${
                              isDisabled ? 'text-gray-400' : 'text-gray-700'
                            }`}
                          >
                            {limitacao.label}
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-gray-400 hover:text-purple-600 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">{limitacao.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
        
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button 
            onClick={handleSave} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            Salvar Dados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
