
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Brain, Users, MessageSquare, BarChart3, Settings } from "lucide-react";
import { CoachDashboard } from "@/components/coach/CoachDashboard";
import { CoachSettings } from "@/components/coach/CoachSettings";
import { PatientInteractions } from "@/components/coach/PatientInteractions";
import { WhatsAppIntegration } from "@/components/coach/WhatsAppIntegration";
import { QuestionnaireManager } from "@/components/coach/QuestionnaireManager";

export default function NutriCoach() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header 
        title="NutriCoach" 
        description="Seu assistente virtual para acompanhamento e coaching nutricional via WhatsApp"
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="questionarios" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Questionários</span>
          </TabsTrigger>
          <TabsTrigger value="interacoes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Interações</span>
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CoachDashboard />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <WhatsAppIntegration />
        </TabsContent>

        <TabsContent value="questionarios" className="space-y-6">
          <QuestionnaireManager />
        </TabsContent>

        <TabsContent value="interacoes" className="space-y-6">
          <PatientInteractions />
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <CoachSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
