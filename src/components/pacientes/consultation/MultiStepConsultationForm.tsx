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

interface MultiStepConsultationFormProps {
  selectedPatient: Paciente;
}

const steps = [
  { id: 1, title: "Histórico Clínico", description: "Informações médicas e histórico de saúde" },
  { 
    id: 2, 
    title: "Avaliação", 
    description: "Avaliações física, emocional, comportamental e bem-estar",
    subSteps: [
      { id: "2a", title: "Física", description: "Medidas corporais e composição" },
      { id: "2b", title: "Emocional", description: "Aspectos psicológicos e comportamentais" },
      { id: "2c", title: "Comportamental", description: "Hábitos alimentares e rotina" },
      { id: "2d", title: "Bem-Estar", description: "Qualidade de vida e satisfação" }
    ]
  },
  { 
    id: 3, 
    title: "Plano Alimentar", 
    description: "Estrutura, personalização e criação do plano nutricional",
    subSteps: [
      { id: "3a", title: "Estrutura", description: "Base nutricional e macronutrientes" },
      { id: "3b", title: "Personalização", description: "Preferências e restrições alimentares" },
      { id: "3c", title: "Plano", description: "Cardápio personalizado" }
    ]
  },
  { id: 4, title: "Metas e Objetivos", description: "Definição de metas e acompanhamento" },
  { id: 5, title: "Documentos", description: "Impressos e materiais de apoio" },
  { id: 6, title: "Resumo", description: "Resumo completo do estado atual do paciente" },
  { id: 7, title: "Comparativo", description: "Comparação entre consultas anteriores" }
];

export const MultiStepConsultationForm = ({ selectedPatient }: MultiStepConsultationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState<string>("2a");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConsultationManager, setShowConsultationManager] = useState(true);
  
  const { currentConsultation, totalConsultations, createNewConsultation, isLoading, setActiveConsultation, loadConsultations } = useConsultations(selectedPatient.id);

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

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

  const getCurrentStepInfo = () => {
    const step = steps.find(s => s.id === currentStep);
    if (currentStep === 2) {
      const subStep = step?.subSteps?.find(s => s.id === currentSubStep);
      return {
        title: `${step?.title} - ${subStep?.title}`,
        description: subStep?.description || step?.description
      };
    } else if (currentStep === 3) {
      const subStep = step?.subSteps?.find(s => s.id === currentSubStep);
      return {
        title: `${step?.title} - ${subStep?.title}`,
        description: subStep?.description || step?.description
      };
    }
    return {
      title: step?.title || "",
      description: step?.description || ""
    };
  };

  // Função para determinar se estamos no primeiro passo
  const isFirstStep = () => {
    return currentStep === 1;
  };

  // Função para determinar se estamos no último passo
  const isLastStep = () => {
    return currentStep === totalSteps;
  };

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

  return (
    <div className="space-y-6">
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
                key={step.id}
                variant={currentStep === step.id ? "default" : completedSteps.includes(step.id) ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleStepClick(step.id)}
                className={`relative ${
                  currentStep === step.id 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : completedSteps.includes(step.id)
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "hover:bg-gray-100"
                }`}
              >
                {completedSteps.includes(step.id) && (
                  <Check className="w-3 h-3 mr-1" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </Button>
            ))}
          </div>

          {/* Substeps da Avaliação */}
          {currentStep === 2 && (
            <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-200">
              {steps[1].subSteps?.map((subStep) => (
                <Button
                  key={subStep.id}
                  variant={currentSubStep === subStep.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSubStepClick(subStep.id)}
                  className={`text-xs ${
                    currentSubStep === subStep.id 
                      ? "bg-purple-500 hover:bg-purple-600 text-white" 
                      : "hover:bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {subStep.title}
                </Button>
              ))}
            </div>
          )}

          {/* Substeps do Plano Alimentar */}
          {currentStep === 3 && (
            <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-200">
              {steps[2].subSteps?.map((subStep) => (
                <Button
                  key={subStep.id}
                  variant={currentSubStep === subStep.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSubStepClick(subStep.id)}
                  className={`text-xs ${
                    currentSubStep === subStep.id 
                      ? "bg-purple-500 hover:bg-purple-600 text-white" 
                      : "hover:bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {subStep.title}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conteúdo da etapa atual */}
      <div className="min-h-[600px] transition-all duration-300 ease-in-out">
        {renderStepContent()}
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
              onClick={handleNext}
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
  );
};
