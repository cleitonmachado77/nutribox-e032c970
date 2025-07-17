import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { useConsultationDataLoader } from "@/hooks/useConsultationDataLoader";
import { toast } from "sonner";

interface PhysicalAssessmentSectionProps {
  patientId: string;
  consultationId?: string;
}

export const PhysicalAssessmentSection = ({ patientId, consultationId }: PhysicalAssessmentSectionProps) => {
  const { savePhysicalAssessment, isLoading } = useConsultationData(patientId, consultationId);
  const { loadPhysicalAssessment } = useConsultationDataLoader(patientId, consultationId);
  
  const [formData, setFormData] = useState({
    // Objetivos do Paciente
    objetivos: {
      estetica: false,
      emagrecimento: false,
      saudeLongevidade: false,
      performanceEsportiva: false
    },
    // Avaliação Antropométrica
    pesoAtual: "",
    altura: "",
    imc: "",
    gorduraCorporal: "",
    circunferencias: {
      cintura: "",
      quadril: "",
      braco: "",
      coxa: ""
    }
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const data = await loadPhysicalAssessment();
        if (data) {
          setFormData({
            objetivos: {
              estetica: data.objetivo_estetica,
              emagrecimento: data.objetivo_emagrecimento,
              saudeLongevidade: data.objetivo_saude_longevidade,
              performanceEsportiva: data.objetivo_performance_esportiva
            },
            pesoAtual: data.peso_atual,
            altura: data.altura,
            imc: data.imc,
            gorduraCorporal: data.gordura_corporal,
            circunferencias: {
              cintura: data.circunferencia_cintura,
              quadril: data.circunferencia_quadril,
              braco: data.circunferencia_braco,
              coxa: data.circunferencia_coxa
            }
          });
        }
      } catch (error) {
        console.error('Error loading physical assessment data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [patientId, consultationId]);

  const handleObjetivoChange = (objetivo: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      objetivos: {
        ...prev.objetivos,
        [objetivo]: checked
      }
    }));
  };

  const handleCircunferenciaChange = (tipo: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      circunferencias: {
        ...prev.circunferencias,
        [tipo]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      await savePhysicalAssessment({
        objetivo_estetica: formData.objetivos.estetica,
        objetivo_emagrecimento: formData.objetivos.emagrecimento,
        objetivo_saude_longevidade: formData.objetivos.saudeLongevidade,
        objetivo_performance_esportiva: formData.objetivos.performanceEsportiva,
        peso_atual: formData.pesoAtual,
        altura: formData.altura,
        imc: formData.imc,
        gordura_corporal: formData.gorduraCorporal,
        circunferencia_cintura: formData.circunferencias.cintura,
        circunferencia_quadril: formData.circunferencias.quadril,
        circunferencia_braco: formData.circunferencias.braco,
        circunferencia_coxa: formData.circunferencias.coxa
      });
      toast.success("Avaliação física salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar avaliação física");
    }
  };

  if (isLoadingData) {
    return (
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Avaliação Física
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
          <Activity className="w-5 h-5" />
          Avaliação Física
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Objetivo do Paciente */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Objetivo do Paciente:
              </h3>
              <p className="text-sm text-gray-600 mb-4">(selecione apenas uma opção)</p>
              
              <div className="space-y-3">
                {[
                  { key: 'estetica', label: 'Estética' },
                  { key: 'emagrecimento', label: 'Emagrecimento' },
                  { key: 'saudeLongevidade', label: 'Saúde e Longevidade' },
                  { key: 'performanceEsportiva', label: 'Performance Esportiva' }
                ].map((objetivo) => (
                  <div key={objetivo.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={objetivo.key}
                      checked={formData.objetivos[objetivo.key as keyof typeof formData.objetivos]}
                      onCheckedChange={(checked) => handleObjetivoChange(objetivo.key, checked as boolean)}
                      className="border-purple-300"
                    />
                    <Label 
                      htmlFor={objetivo.key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {objetivo.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Avaliação Antropométrica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Avaliação Antropométrica:
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pesoAtual" className="text-sm font-medium">
                    Peso Atual
                  </Label>
                  <Input 
                    id="pesoAtual"
                    value={formData.pesoAtual}
                    onChange={(e) => setFormData(prev => ({...prev, pesoAtual: e.target.value}))}
                    placeholder="kg"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="altura" className="text-sm font-medium">
                    Altura
                  </Label>
                  <Input 
                    id="altura"
                    value={formData.altura}
                    onChange={(e) => setFormData(prev => ({...prev, altura: e.target.value}))}
                    placeholder="cm"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imc" className="text-sm font-medium">
                    IMC
                  </Label>
                  <Input 
                    id="imc"
                    value={formData.imc}
                    onChange={(e) => setFormData(prev => ({...prev, imc: e.target.value}))}
                    placeholder="kg/m²"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gorduraCorporal" className="text-sm font-medium">
                    % Gordura Corporal
                  </Label>
                  <Input 
                    id="gorduraCorporal"
                    value={formData.gorduraCorporal}
                    onChange={(e) => setFormData(prev => ({...prev, gorduraCorporal: e.target.value}))}
                    placeholder="%"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Circunferências:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'cintura', label: 'Cintura:' },
                    { key: 'quadril', label: 'Quadril:' },
                    { key: 'braco', label: 'Braço:' },
                    { key: 'coxa', label: 'Coxa:' }
                  ].map((circunferencia) => (
                    <div key={circunferencia.key} className="flex items-center gap-2">
                      <Label className="text-sm w-16 flex-shrink-0">
                        {circunferencia.label}
                      </Label>
                      <Input 
                        value={formData.circunferencias[circunferencia.key as keyof typeof formData.circunferencias]}
                        onChange={(e) => handleCircunferenciaChange(circunferencia.key, e.target.value)}
                        placeholder="cm"
                        className="flex-1 border-purple-200 focus:border-purple-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
    </Card>
  );
};
