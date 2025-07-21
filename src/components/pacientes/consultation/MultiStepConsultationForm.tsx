import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { ClinicalHistorySection } from "./ClinicalHistorySection";
import { PhysicalAssessmentSection } from "./PhysicalAssessmentSection";
import { EmotionalAssessmentSection } from "./EmotionalAssessmentSection";
import { BehavioralAssessmentSection } from "./BehavioralAssessmentSection";
import { WellnessAssessmentSection } from "./WellnessAssessmentSection";
import { NutritionalPlanStructureSection } from "./NutritionalPlanStructureSection";
import { NutritionalPlanPersonalizationSection } from "./NutritionalPlanPersonalizationSection";
import { NutritionalPlanSection } from "./NutritionalPlanSection";
import { GoalsSection } from "./GoalsSection";
import { PrintsSection } from "./PrintsSection";
import { ConsultationManager } from "@/components/consultas/ConsultationManager";
import { Paciente } from "@/hooks/usePacientes";
import { useConsultations, type Consultation } from "@/hooks/useConsultations";
import { PatientSummarySection } from "./PatientSummarySection";
import { PatientComparisonSection } from "./PatientComparisonSection";
import { Sidebar } from "@/components/ui/sidebar";
import { useToast } from '@/hooks/use-toast';

interface MultiStepConsultationFormProps {
  selectedPatient: Paciente;
}

const steps = [
  { step: 1, title: "Histórico Clínico", required: true },
  { step: 2, title: "Avaliações", required: true },
  { step: 3, title: "Plano Alimentar", required: true },
  { step: 4, title: "Metas", required: false },
  { step: 5, title: "Impressões/Relatórios", required: false },
  { step: 6, title: "Resumo do Paciente", required: false },
  { step: 7, title: "Comparativo de Consultas", required: false },
];

export const MultiStepConsultationForm = ({ selectedPatient }: MultiStepConsultationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState<string>("2a");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConsultationManager, setShowConsultationManager] = useState(true);
  
  const { currentConsultation, totalConsultations, createNewConsultation, isLoading, setActiveConsultation, loadConsultations } = useConsultations(selectedPatient.id);
  const { toast } = useToast();

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  // Função para checar se a etapa está preenchida (placeholder, pode ser aprimorada)
  const isStepCompleted = (step: number) => {
    // TODO: lógica real de validação de preenchimento
    return step < currentStep; // Considera etapas anteriores como preenchidas
  };

  // Função de validação obrigatória para cada etapa
  function validateCurrentStep() {
    // Exemplo de validação (deve ser expandido para cada etapa real)
    if (currentStep === 1) {
      // Exemplo: validar que o campo "histórico clínico" foi preenchido
      // if (!clinicalHistory) {
      //   return { valid: false, message: 'Preencha o histórico clínico.' };
      // }
      return { valid: true };
    }
    if (currentStep === 2) {
      // Exemplo: validar avaliações
      // if (!physicalAssessment) {
      //   return { valid: false, message: 'Preencha a avaliação física.' };
      // }
      return { valid: true };
    }
    if (currentStep === 3) {
      // Exemplo: validar plano alimentar
      // if (!nutritionalPlan) {
      //   return { valid: false, message: 'Preencha o plano alimentar.' };
      // }
      return { valid: true };
    }
    // ... outras etapas
    return { valid: true };
  }

  const handleNewConsultation = async (consultation: Consultation) => {
    // Primeiro atualizar o currentConsultation manualmente para evitar delay
    setActiveConsultation(consultation);
    // Depois esconder o manager e resetar o form
    setShowConsultationManager(false);
    setCurrentStep(1);
    setCurrentSubStep("2a");
    setCompletedSteps([]);
    // Recarregar as consultas em background
    await loadConsultations();
  };

  const handleSelectConsultation = async (consultation: Consultation) => {
    // Primeiro atualizar o currentConsultation manualmente
    setActiveConsultation(consultation);
    // Depois esconder o manager e resetar o form
    setShowConsultationManager(false);
    setCurrentStep(1);
    setCurrentSubStep("2a");
    setCompletedSteps([]);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // Navegar pelos substeps da Avaliação
      const subSteps = ["2a", "2b", "2c", "2d"];
      const currentIndex = subSteps.indexOf(currentSubStep);
      
      if (currentIndex < subSteps.length - 1) {
        setCurrentSubStep(subSteps[currentIndex + 1]);
      } else {
        // Finalizar o step 2 e ir para o próximo
        setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep]);
        setCurrentStep(3);
        setCurrentSubStep("3a");
      }
    } else if (currentStep === 3) {
      // Navegar pelos substeps do Plano Alimentar
      const subSteps = ["3a", "3b", "3c"];
      const currentIndex = subSteps.indexOf(currentSubStep);
      
      if (currentIndex < subSteps.length - 1) {
        setCurrentSubStep(subSteps[currentIndex + 1]);
      } else {
        // Finalizar o step 3 e ir para o próximo
        setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep]);
        setCurrentStep(4);
        setCurrentSubStep("2a");
      }
    } else {
      if (currentStep < totalSteps) {
        setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep]);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      // Navegar pelos substeps da Avaliação
      const subSteps = ["2a", "2b", "2c", "2d"];
      const currentIndex = subSteps.indexOf(currentSubStep);
      
      if (currentIndex > 0) {
        setCurrentSubStep(subSteps[currentIndex - 1]);
      } else {
        // Voltar para o step anterior
        setCurrentStep(1);
      }
    } else if (currentStep === 3) {
      // Navegar pelos substeps do Plano Alimentar
      const subSteps = ["3a", "3b", "3c"];
      const currentIndex = subSteps.indexOf(currentSubStep);
      
      if (currentIndex > 0) {
        setCurrentSubStep(subSteps[currentIndex - 1]);
      } else {
        // Voltar para o step anterior (Avaliação)
        setCurrentStep(2);
        setCurrentSubStep("2d");
      }
    } else if (currentStep === 4) {
      // Ao voltar do step 4, ir para o último substep do Plano Alimentar
      setCurrentStep(3);
      setCurrentSubStep("3c");
    } else {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        // Definir substep apropriado se necessário
        if (currentStep - 1 === 2) {
          setCurrentSubStep("2a");
        } else if (currentStep - 1 === 3) {
          setCurrentSubStep("3a");
        }
      }
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    if (stepId === 2) {
      setCurrentSubStep("2a");
    } else if (stepId === 3) {
      setCurrentSubStep("3a");
    }
  };

  const handleSubStepClick = (subStepId: string) => {
    setCurrentSubStep(subStepId);
  };

  // Corrigir getCurrentStepInfo para não depender de description/subSteps
  const getCurrentStepInfo = () => {
    const step = steps.find(s => s.step === currentStep);
    return step || { step: currentStep, title: '', required: false };
  };

  // Função para determinar se estamos no primeiro passo
  const isFirstStep = () => {
    return currentStep === 1;
  };

  // Função para determinar se estamos no último passo
  const isLastStep = () => {
    return currentStep === totalSteps;
  };

  // Adicionar etapa de resumo final
  const isSummaryStep = currentStep === totalSteps;

  function renderSummary() {
    // Placeholder: buscar dados reais de cada etapa
    return (
      <Card className="border-2 border-green-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Resumo Final da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Histórico Clínico</h3>
            {/* Exibir dados do histórico */}
            <pre className="bg-gray-50 p-2 rounded text-xs text-gray-700">{/* dados do histórico */}</pre>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Avaliações</h3>
            {/* Exibir dados das avaliações */}
            <pre className="bg-gray-50 p-2 rounded text-xs text-gray-700">{/* dados das avaliações */}</pre>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Plano Alimentar</h3>
            {/* Exibir dados do plano alimentar */}
            <pre className="bg-gray-50 p-2 rounded text-xs text-gray-700">{/* dados do plano alimentar */}</pre>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Metas</h3>
            {/* Exibir dados das metas */}
            <pre className="bg-gray-50 p-2 rounded text-xs text-gray-700">{/* dados das metas */}</pre>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handlePrevious}>Voltar</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {/* lógica de finalização */}}>Finalizar Consulta</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderStepContent = () => {
    // Se está carregando, mostrar loading
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando consulta...</p>
          </div>
        </div>
      );
    }

    // Se não há consulta ativa, mostrar mensagem
    if (!currentConsultation) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Nenhuma consulta ativa encontrada</p>
            <Button onClick={() => setShowConsultationManager(true)}>
              Gerenciar Consultas
            </Button>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <ClinicalHistorySection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
      case 2:
        switch (currentSubStep) {
          case "2a":
            return <PhysicalAssessmentSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
          case "2b":
            return <EmotionalAssessmentSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
          case "2c":
            return <BehavioralAssessmentSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
          case "2d":
            return <WellnessAssessmentSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
          default:
            return <PhysicalAssessmentSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
        }
      case 3:
        switch (currentSubStep) {
          case "3a":
            return <NutritionalPlanStructureSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
          case "3b":
            return <NutritionalPlanPersonalizationSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
          case "3c":
            return <NutritionalPlanSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
          default:
            return <NutritionalPlanStructureSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
        }
      case 4:
        return <GoalsSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
      case 5:
        return <PrintsSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
      case 6:
        return <PatientSummarySection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
      case 7:
        return <PatientComparisonSection patientId={selectedPatient.id} consultationId={currentConsultation.id} />;
      default:
        return null;
    }
  };

  if (showConsultationManager) {
    return (
      <div className="space-y-6">
        <ConsultationManager
          patientId={selectedPatient.id}
          patientName={selectedPatient.lead.nome}
          onNewConsultation={handleNewConsultation}
          onSelectConsultation={handleSelectConsultation}
          currentConsultation={currentConsultation}
        />
      </div>
    );
  }

  const currentStepInfo = getCurrentStepInfo();

  const handleNextValidated = () => {
    const validation = validateCurrentStep();
    if (!validation.valid) {
      toast({ title: 'Atenção', description: validation.message || 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }
    handleNext();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar de etapas */}
      <aside className="md:w-1/4 w-full mb-4 md:mb-0">
        <nav aria-label="Etapas da Consulta" className="space-y-2 sticky top-4">
          {steps.map(({ step, title, required }) => (
            <button
              key={step}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all
                ${currentStep === step ? 'bg-purple-600 text-white font-bold shadow' : 'bg-purple-100 text-purple-900'}
                ${required ? 'border-l-4 border-purple-500' : ''}
                ${isStepCompleted(step) ? 'opacity-100' : 'opacity-70'}`}
              onClick={() => setCurrentStep(step)}
              aria-current={currentStep === step ? 'step' : undefined}
              aria-label={title + (required ? ' (obrigatório)' : '')}
            >
              <span className="flex items-center gap-2">
                {isStepCompleted(step) ? <Check className="w-4 h-4 text-green-500" /> : <ChevronRight className="w-4 h-4 text-purple-400" />}
                {title}
                {required && <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">obrigatório</span>}
              </span>
            </button>
          ))}
        </nav>
      </aside>
      {/* Conteúdo da etapa atual */}
      <div className="flex-1">
        {/* Header com informações da consulta */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Consulta #{currentConsultation?.consultation_number || 'N/A'} - {selectedPatient.lead.nome}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  Etapa {currentStep} de {totalSteps}: {currentStepInfo.title}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConsultationManager(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Ver Consultas ({totalConsultations})
                </Button>
                <div className="text-right">
                  <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                  <div className="text-sm text-purple-100">Concluído</div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <Progress value={progress} className="w-full h-2 mb-4" />
              <p className="text-sm text-gray-600">{currentStepInfo.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Navegação por etapas */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {steps.map((step) => (
                <Button
                  key={step.step}
                  variant={currentStep === step.step ? "default" : completedSteps.includes(step.step) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleStepClick(step.step)}
                  className={`relative ${
                    currentStep === step.step 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : completedSteps.includes(step.step)
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {completedSteps.includes(step.step) && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.step}</span>
                </Button>
              ))}
            </div>

            {/* Substeps da Avaliação */}
            {currentStep === 2 && typeof handleSubStepClick === 'function' && (
              <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-200">
                {["2a", "2b", "2c", "2d"].map((subStep) => (
                  <Button
                    key={subStep}
                    variant={currentSubStep === subStep ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSubStepClick(subStep)}
                    className={`text-xs ${currentSubStep === subStep ? "bg-purple-500 hover:bg-purple-600 text-white" : "hover:bg-purple-50 text-purple-700 border-purple-200"}`}
                  >
                    {subStep}
                  </Button>
                ))}
              </div>
            )}

            {/* Substeps do Plano Alimentar */}
            {currentStep === 3 && typeof handleSubStepClick === 'function' && (
              <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-200">
                {["3a", "3b", "3c"].map((subStep) => (
                  <Button
                    key={subStep}
                    variant={currentSubStep === subStep ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSubStepClick(subStep)}
                    className={`text-xs ${currentSubStep === subStep ? "bg-purple-500 hover:bg-purple-600 text-white" : "hover:bg-purple-50 text-purple-700 border-purple-200"}`}
                  >
                    {subStep}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conteúdo da etapa atual */}
        <div className="min-h-[600px] transition-all duration-300 ease-in-out">
          {isSummaryStep ? renderSummary() : renderStepContent()}
        </div>

        {/* Navegação inferior */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep()}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="text-sm text-gray-500">
                {currentStep === 2 ? (
                  <span>Avaliação: {steps[1].subSteps?.find(s => s.id === currentSubStep)?.title}</span>
                ) : currentStep === 3 ? (
                  <span>Plano Alimentar: {steps[2].subSteps?.find(s => s.id === currentSubStep)?.title}</span>
                ) : (
                  <span>Etapa {currentStep} de {totalSteps}</span>
                )}
              </div>

              <Button
                onClick={handleNextValidated}
                disabled={isLastStep()}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                {isLastStep() ? "Concluído" : "Próximo"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
