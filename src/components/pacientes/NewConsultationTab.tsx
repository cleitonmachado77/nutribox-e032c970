
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClinicalHistorySection } from "./consultation/ClinicalHistorySection";
import { PhysicalAssessmentSection } from "./consultation/PhysicalAssessmentSection";
import { EmotionalAssessmentSection } from "./consultation/EmotionalAssessmentSection";
import { BehavioralAssessmentSection } from "./consultation/BehavioralAssessmentSection";
import { WellnessAssessmentSection } from "./consultation/WellnessAssessmentSection";
import { NutritionalPlanStructureSection } from "./consultation/NutritionalPlanStructureSection";
import { NutritionalPlanPersonalizationSection } from "./consultation/NutritionalPlanPersonalizationSection";
import { NutritionalPlanSection } from "./consultation/NutritionalPlanSection";
import { GoalsSection } from "./consultation/GoalsSection";
import { PrintsSection } from "./consultation/PrintsSection";
import { Paciente } from "@/hooks/usePacientes";
import { 
  Stethoscope, 
  Activity, 
  Heart, 
  Brain, 
  Smile, 
  Target,
  FileText,
  Printer,
  Utensils,
  Settings,
  PlusCircle
} from "lucide-react";

interface NewConsultationTabProps {
  selectedPatient: Paciente;
}

export const NewConsultationTab = ({ selectedPatient }: NewConsultationTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Nova Consulta - {selectedPatient.lead.nome}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="historico-clinico" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-muted">
              <TabsTrigger value="historico-clinico" className="flex items-center gap-2 text-xs">
                <Stethoscope className="w-4 h-4" />
                Histórico Clínico
              </TabsTrigger>
              <TabsTrigger value="avaliacao" className="flex items-center gap-2 text-xs">
                <Activity className="w-4 h-4" />
                Avaliação
              </TabsTrigger>
              <TabsTrigger value="plano-alimentar" className="flex items-center gap-2 text-xs">
                <Utensils className="w-4 h-4" />
                Plano Alimentar
              </TabsTrigger>
              <TabsTrigger value="metas" className="flex items-center gap-2 text-xs">
                <Target className="w-4 h-4" />
                Metas
              </TabsTrigger>
              <TabsTrigger value="impressos" className="flex items-center gap-2 text-xs">
                <Printer className="w-4 h-4" />
                Impressos
              </TabsTrigger>
              <TabsTrigger value="anamnese" className="flex items-center gap-2 text-xs">
                <FileText className="w-4 h-4" />
                Anamnese
              </TabsTrigger>
            </TabsList>

            <TabsContent value="historico-clinico" className="mt-6">
              <ClinicalHistorySection patientId={selectedPatient.id} />
            </TabsContent>

            <TabsContent value="avaliacao" className="mt-6">
              <Tabs defaultValue="fisica" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="fisica" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Física
                  </TabsTrigger>
                  <TabsTrigger value="emocional" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Emocional
                  </TabsTrigger>
                  <TabsTrigger value="comportamental" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Comportamental
                  </TabsTrigger>
                  <TabsTrigger value="bem-estar" className="flex items-center gap-2">
                    <Smile className="w-4 h-4" />
                    Bem Estar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="fisica">
                  <PhysicalAssessmentSection patientId={selectedPatient.id} />
                </TabsContent>
                <TabsContent value="emocional">
                  <EmotionalAssessmentSection patientId={selectedPatient.id} />
                </TabsContent>
                <TabsContent value="comportamental">
                  <BehavioralAssessmentSection patientId={selectedPatient.id} />
                </TabsContent>
                <TabsContent value="bem-estar">
                  <WellnessAssessmentSection patientId={selectedPatient.id} />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="plano-alimentar" className="mt-6">
              <Tabs defaultValue="estrutura" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="estrutura" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Estrutura
                  </TabsTrigger>
                  <TabsTrigger value="personalizacao" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Personalização
                  </TabsTrigger>
                  <TabsTrigger value="plano" className="flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    Plano
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="estrutura">
                  <NutritionalPlanStructureSection patientId={selectedPatient.id} />
                </TabsContent>
                <TabsContent value="personalizacao">
                  <NutritionalPlanPersonalizationSection patientId={selectedPatient.id} />
                </TabsContent>
                <TabsContent value="plano">
                  <NutritionalPlanSection patientId={selectedPatient.id} />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="metas" className="mt-6">
              <GoalsSection patientId={selectedPatient.id} />
            </TabsContent>

            <TabsContent value="impressos" className="mt-6">
              <PrintsSection patientId={selectedPatient.id} />
            </TabsContent>

            <TabsContent value="anamnese" className="mt-6">
              <div className="text-center py-8">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Anamnese Nutricional</h3>
                <p className="text-gray-600">
                  A anamnese será gerada automaticamente com base nas informações coletadas nas outras seções.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
