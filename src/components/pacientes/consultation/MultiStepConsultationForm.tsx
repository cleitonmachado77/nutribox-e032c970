
import { useState } from "react";
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
import { Paciente } from "@/hooks/usePacientes";

interface MultiStepConsultationFormProps {
  selectedPatient: Paciente;
}

const steps = [
  { id: 1, title: "Histórico Clínico", description: "Informações médicas e histórico de saúde" },
  { id: 2, title: "Avaliação Física", description: "Medidas corporais e composição" },
  { id: 3, title: "Avaliação Emocional", description: "Aspectos psicológicos e comportamentais" },
  { id: 4, title: "Avaliação Comportamental", description: "Hábitos alimentares e rotina" },
  { id: 5, title: "Bem-Estar", description: "Qualidade de vida e satisfação" },
  { id: 6, title: "Estrutura do Plano", description: "Base nutricional e macronutrientes" },
  { id: 7, title: "Personalização", description: "Preferências e restrições alimentares" },
  { id: 8, title: "Plano Alimentar", description: "Cardápio personalizado" },
  { id: 9, title: "Metas e Objetivos", description: "Definição de metas e acompanhamento" },
  { id: 10, title: "Documentos", description: "Impressos e materiais de apoio" }
];

export const MultiStepConsultationForm = ({ selectedPatient }: MultiStepConsultationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => [...prev.filter(s => s !== currentStep), currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ClinicalHistorySection patientId={selectedPatient.id} />;
      case 2:
        return <PhysicalAssessmentSection patientId={selectedPatient.id} />;
      case 3:
        return <EmotionalAssessmentSection patientId={selectedPatient.id} />;
      case 4:
        return <BehavioralAssessmentSection patientId={selectedPatient.id} />;
      case 5:
        return <WellnessAssessmentSection patientId={selectedPatient.id} />;
      case 6:
        return <NutritionalPlanStructureSection patientId={selectedPatient.id} />;
      case 7:
        return <NutritionalPlanPersonalizationSection patientId={selectedPatient.id} />;
      case 8:
        return <NutritionalPlanSection patientId={selectedPatient.id} />;
      case 9:
        return <GoalsSection patientId={selectedPatient.id} />;
      case 10:
        return <PrintsSection patientId={selectedPatient.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com progresso */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Nova Consulta - {selectedPatient.lead.nome}</h2>
              <p className="text-purple-100 text-sm mt-1">
                Etapa {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
              <div className="text-sm text-purple-100">Concluído</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <Progress value={progress} className="w-full h-2 mb-4" />
            <p className="text-sm text-gray-600">{steps[currentStep - 1]?.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Navegação por etapas */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 justify-center">
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
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="text-sm text-gray-500">
              Etapa {currentStep} de {steps.length}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              {currentStep === steps.length ? "Finalizar" : "Próximo"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
