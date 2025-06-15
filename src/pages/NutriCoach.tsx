
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Brain, Users, MessageSquare, BarChart3, Settings } from "lucide-react";
import { CoachDashboard } from "@/components/coach/CoachDashboard";
import { CoachSettings } from "@/components/coach/CoachSettings";
import { BehavioralQuestions } from "@/components/coach/BehavioralQuestions";
import { PatientInteractions } from "@/components/coach/PatientInteractions";
import { ProgressTracking } from "@/components/coach/ProgressTracking";

export default function NutriCoach() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header 
        title="NutriCoach" 
        description="Seu assistente virtual para acompanhamento e coaching nutricional"
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="pacientes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Pacientes
          </TabsTrigger>
          <TabsTrigger value="questionarios" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Questionários
          </TabsTrigger>
          <TabsTrigger value="interacoes" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Interações
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CoachDashboard />
        </TabsContent>

        <TabsContent value="pacientes" className="space-y-6">
          <ProgressTracking />
        </TabsContent>

        <TabsContent value="questionarios" className="space-y-6">
          <BehavioralQuestions />
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
