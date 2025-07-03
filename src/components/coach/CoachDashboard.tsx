
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell,
  Brain,
  Target,
  TrendingUp,
  Activity
} from "lucide-react";
import { PatientProfiles } from "./PatientProfiles";
import { CoachMessaging } from "./CoachMessaging";
import { SchedulingSystem } from "./SchedulingSystem";
import { AdvancedReports } from "./AdvancedReports";
import { CoachSettings } from "./CoachSettings";
import { NotificationSystem } from "./NotificationSystem";

export const CoachDashboard = () => {
  const [activeTab, setActiveTab] = useState("patients");

  const menuItems = [
    {
      id: "patients",
      label: "Pacientes",
      icon: Users,
      component: PatientProfiles,
      description: "Perfis e acompanhamento de pacientes"
    },
    {
      id: "messaging",
      label: "Mensagens",
      icon: MessageSquare,
      component: CoachMessaging,
      description: "Sistema de mensagens inteligentes"
    },
    {
      id: "scheduling",
      label: "Agendamentos",
      icon: Calendar,
      component: SchedulingSystem,
      description: "Gestão de consultas e horários"
    },
    {
      id: "reports",
      label: "Relatórios",
      icon: BarChart3,
      component: AdvancedReports,
      description: "Análises e insights avançados"
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      component: NotificationSystem,
      description: "Central de notificações"
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      component: CoachSettings,
      description: "Configurações do NutriCoach"
    }
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || PatientProfiles;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-soft">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              NutriCoach IA
            </h1>
            <p className="text-gray-600">Assistente inteligente para nutricionistas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg px-4 py-2 shadow-soft border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">IA Ativa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 p-1 bg-gray-50">
            {menuItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-soft"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {menuItems.map((item) => (
            <TabsContent key={item.id} value={item.id} className="p-6 mt-0">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{item.label}</h2>
                </div>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <ActiveComponent />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Sistema operacional</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">IA treinada e otimizada</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">Melhorando continuamente</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
};
