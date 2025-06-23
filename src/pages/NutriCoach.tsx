
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Brain, Users, MessageSquare, BarChart3, Settings, Bot, Calendar, Target, Bell, Clock } from "lucide-react";
import { CoachDashboard } from "@/components/coach/CoachDashboard";
import { CoachSettings } from "@/components/coach/CoachSettings";
import { BehavioralQuestions } from "@/components/coach/BehavioralQuestions";
import { PatientInteractions } from "@/components/coach/PatientInteractions";
import { ProgressTracking } from "@/components/coach/ProgressTracking";
import { WhatsAppIntegration } from "@/components/coach/WhatsAppIntegration";
import { CoachMessaging } from "@/components/coach/CoachMessaging";
import { PatientProfiles } from "@/components/coach/PatientProfiles";
import { SchedulingSystem } from "@/components/coach/SchedulingSystem";
import { GoalsTracking } from "@/components/coach/GoalsTracking";
import { AdvancedReports } from "@/components/coach/AdvancedReports";
import { NotificationSystem } from "@/components/coach/NotificationSystem";

export default function NutriCoach() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header 
        title="NutriCoach" 
        description="Seu assistente virtual para acompanhamento e coaching nutricional via WhatsApp"
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-muted">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="pacientes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Pacientes</span>
          </TabsTrigger>
          <TabsTrigger value="questionarios" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Questionários</span>
          </TabsTrigger>
          <TabsTrigger value="interacoes" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Interações</span>
          </TabsTrigger>
          <TabsTrigger value="agendamento" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Agendamento</span>
          </TabsTrigger>
          <TabsTrigger value="metas" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Metas</span>
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Relatórios</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <WhatsAppIntegration />
            </div>
            <div className="space-y-6">
              <CoachMessaging />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pacientes" className="space-y-6">
          <PatientProfiles />
        </TabsContent>

        <TabsContent value="questionarios" className="space-y-6">
          <BehavioralQuestions />
        </TabsContent>

        <TabsContent value="interacoes" className="space-y-6">
          <PatientInteractions />
        </TabsContent>

        <TabsContent value="agendamento" className="space-y-6">
          <SchedulingSystem />
        </TabsContent>

        <TabsContent value="metas" className="space-y-6">
          <GoalsTracking />
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <AdvancedReports />
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <NotificationSystem />
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <CoachSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
