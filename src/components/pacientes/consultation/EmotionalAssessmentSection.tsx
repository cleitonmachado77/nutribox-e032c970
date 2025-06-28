
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { useConsultationDataLoader } from "@/hooks/useConsultationDataLoader";
import { toast } from "sonner";

interface EmotionalAssessmentSectionProps {
  patientId: string;
}

interface LimitacaoResponse {
  id: string;
  intensity: 'demais' | 'as_vezes' | 'raramente';
}

export const EmotionalAssessmentSection = ({ patientId }: EmotionalAssessmentSectionProps) => {
  const { saveEmotionalAssessment, isLoading } = useConsultationData(patientId);
  const { loadEmotionalAssessment } = useConsultationDataLoader(patientId);
  
  const [selectedLimitations, setSelectedLimitations] = useState<LimitacaoResponse[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLimitacao, setCurrentLimitacao] = useState<any>(null);
  const [currentIntensity, setCurrentIntensity] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  const limitacoes = [
    {
      id: 'compulsao_alimentar_noturna',
      label: 'Compulsão Alimentar Noturna',
      pergunta: 'Você costuma comer em excesso à noite, mesmo sem fome real?'
    },
    {
      id: 'ansiedade_pre_refeicao',
      label: 'Ansiedade Pré-Refeição',
      pergunta: 'Você costuma ter uma cobrança excessiva com "comer certo" ou "engordar"?'
    },
    {
      id: 'fome_emocional',
      label: 'Fome Emocional',
      pergunta: 'Você costuma ter vontade de comer quando está triste, estressada, feliz ou carente (sem fome real)?'
    },
    {
      id: 'episodios_recompensa',
      label: 'Episódios de Recompensa Alimentar',
      pergunta: 'É comum você comer algo "proibido" como forma de compensação (ex: "eu mereço")?'
    },
    {
      id: 'culpa_pos_alimentacao',
      label: 'Culpa Pós-Alimentação',
      pergunta: 'Você costuma ter raiva de si, culpa ou arrependimento após comer?'
    },
    {
      id: 'oscilacao_humor_ciclo',
      label: 'Oscilação de Humor no Ciclo Menstrual',
      pergunta: 'Durante o seu ciclo menstrual, você sente mais vontade de doces ou percebe episódios de compulsão? (para mulheres)'
    },
    {
      id: 'autoimagem_negativa',
      label: 'Autoimagem Negativa (Body-Shame)',
      pergunta: 'É normal episódios em que você pensa que seu corpo "não tem mais jeito" ou "não vale a pena tentar" e por isso você come mal?'
    },
    {
      id: 'falta_controle',
      label: 'Sensação de Falta de Controle',
      pergunta: 'É comum você sentir que "perde o controle" diante de algum tipo de comida específico?'
    },
    {
      id: 'estresse_cronico',
      label: 'Estresse Crônico',
      pergunta: 'Você costuma comer de forma acelerada, sem tempo ou beliscando devido ao excesso de tensão do trabalho, rotina ou família?'
    }
  ];

  const intensityOptions = [
    { value: 'demais', label: 'Demais (Ruim)', color: 'text-red-600' },
    { value: 'as_vezes', label: 'Às Vezes (Média)', color: 'text-yellow-600' },
    { value: 'raramente', label: 'Raramente ou Nunca (Boa)', color: 'text-green-600' }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const data = await loadEmotionalAssessment();
        if (data) {
          // Parse the emotional assessment data and restore selected limitations
          const triggers = data.eating_triggers ? data.eating_triggers.split(',') : [];
          const restoredLimitations: LimitacaoResponse[] = [];
          
          triggers.forEach(trigger => {
            const [id, intensity] = trigger.split(':');
            if (id && intensity) {
              restoredLimitations.push({
                id: id.trim(),
                intensity: intensity.trim() as 'demais' | 'as_vezes' | 'raramente'
              });
            }
          });
          
          setSelectedLimitations(restoredLimitations);
        }
      } catch (error) {
        console.error('Error loading emotional assessment data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [patientId]);

  const handleLimitationClick = (limitacao: any) => {
    // Se já está selecionada, remover
    const isSelected = selectedLimitations.find(l => l.id === limitacao.id);
    if (isSelected) {
      setSelectedLimitations(prev => prev.filter(l => l.id !== limitacao.id));
      return;
    }

    // Se já tem 3 selecionadas, não permitir mais
    if (selectedLimitations.length >= 3) {
      return;
    }

    // Abrir dialog para selecionar intensidade
    setCurrentLimitacao(limitacao);
    setCurrentIntensity('');
    setDialogOpen(true);
  };

  const handleConfirmSelection = () => {
    if (currentLimitacao && currentIntensity) {
      setSelectedLimitations(prev => [...prev, {
        id: currentLimitacao.id,
        intensity: currentIntensity as 'demais' | 'as_vezes' | 'raramente'
      }]);
      setDialogOpen(false);
      setCurrentLimitacao(null);
      setCurrentIntensity('');
    }
  };

  const getLimitationColor = (limitationId: string) => {
    const selected = selectedLimitations.find(l => l.id === limitationId);
    if (!selected) return '';
    
    switch (selected.intensity) {
      case 'demais': return 'border-red-400 bg-red-50';
      case 'as_vezes': return 'border-yellow-400 bg-yellow-50';
      case 'raramente': return 'border-green-400 bg-green-50';
      default: return '';
    }
  };

  const getIntensityLabel = (limitationId: string) => {
    const selected = selectedLimitations.find(l => l.id === limitationId);
    if (!selected) return '';
    
    const option = intensityOptions.find(opt => opt.value === selected.intensity);
    return option ? option.label : '';
  };

  const handleSave = async () => {
    try {
      // Convert selected limitations to string format for storage
      const eatingTriggersString = selectedLimitations
        .map(l => `${l.id}:${l.intensity}`)
        .join(',');

      await saveEmotionalAssessment({
        relationship_with_food: selectedLimitations.length > 0 ? 'assessed' : '',
        eating_triggers: eatingTriggersString,
        emotional_state: selectedLimitations.some(l => l.intensity === 'demais') ? 'high_stress' : 'normal',
        stress_level: selectedLimitations.filter(l => l.intensity === 'demais').length.toString(),
        food_anxiety: selectedLimitations.some(l => l.id.includes('ansiedade')) ? 'present' : 'absent'
      });
      
      toast.success("Avaliação emocional salva com sucesso!");
    } catch (error) {
      console.error('Error saving emotional assessment:', error);
      toast.error("Erro ao salvar avaliação emocional");
    }
  };

  if (isLoadingData) {
    return (
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {limitacoes.map((limitacao) => {
              const isSelected = selectedLimitations.find(l => l.id === limitacao.id);
              const isDisabled = !isSelected && selectedLimitations.length >= 3;
              
              return (
                <div 
                  key={limitacao.id} 
                  className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? getLimitationColor(limitacao.id)
                      : isDisabled 
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                  onClick={() => !isDisabled && handleLimitationClick(limitacao)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={limitacao.id}
                      checked={!!isSelected}
                      disabled={isDisabled}
                      className="mt-1 pointer-events-none"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={limitacao.id}
                        className={`text-sm font-medium cursor-pointer ${
                          isDisabled ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {limitacao.label}
                      </Label>
                      {isSelected && (
                        <p className="text-xs mt-1 font-medium">
                          {getIntensityLabel(limitacao.id)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            {isLoading ? "Salvando..." : "Salvar Dados"}
          </Button>
        </div>
      </CardContent>

      {/* Dialog para seleção de intensidade */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {currentLimitacao?.label}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {currentLimitacao?.pergunta}
            </p>
            
            <RadioGroup value={currentIntensity} onValueChange={setCurrentIntensity}>
              <div className="space-y-3">
                {intensityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className={`cursor-pointer ${option.color}`}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmSelection}
                disabled={!currentIntensity}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
