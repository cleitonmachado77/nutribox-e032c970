
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
      id: 'ansiedade',
      label: 'Ansiedade',
      tooltip: 'Sentimento de preocupação, nervosismo ou inquietação sobre algo com resultado incerto'
    },
    {
      id: 'depressao',
      label: 'Depressão',
      tooltip: 'Estado persistente de tristeza, perda de interesse e diminuição da capacidade de sentir prazer'
    },
    {
      id: 'compulsao_alimentar',
      label: 'Compulsão Alimentar',
      tooltip: 'Episódios recorrentes de ingestão de grandes quantidades de comida em pouco tempo'
    },
    {
      id: 'baixa_autoestima',
      label: 'Baixa Autoestima',
      tooltip: 'Percepção negativa de si mesmo, sentimentos de inadequação e falta de confiança'
    },
    {
      id: 'perfeccionismo',
      label: 'Perfeccionismo',
      tooltip: 'Tendência a estabelecer padrões irrealisticamente altos e ser excessivamente crítico'
    },
    {
      id: 'stress',
      label: 'Stress',
      tooltip: 'Resposta física e emocional a pressões e demandas do dia a dia'
    },
    {
      id: 'distorcao_imagem',
      label: 'Distorção da Imagem Corporal',
      tooltip: 'Percepção distorcida ou negativa da própria aparência física'
    },
    {
      id: 'culpa_alimentar',
      label: 'Culpa Alimentar',
      tooltip: 'Sentimentos de culpa e vergonha relacionados às escolhas alimentares'
    },
    {
      id: 'isolamento_social',
      label: 'Isolamento Social',
      tooltip: 'Tendência a se afastar do convívio social e das atividades em grupo'
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
