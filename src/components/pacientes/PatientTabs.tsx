
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientGeneralTab } from "./PatientGeneralTab";
import { PatientHistoryTab } from "./PatientHistoryTab";
import { PatientPhotosTab } from "./PatientPhotosTab";
import { PatientPlanTab } from "./PatientPlanTab";
import { PatientShoppingTab } from "./PatientShoppingTab";
import { PatientClinicalHistory } from "./PatientClinicalHistory";
import { PatientDashboardTab } from "./PatientDashboardTab";
import { PatientCoachHistoryTab } from "./PatientCoachHistoryTab";
import { NewConsultationTab } from "./NewConsultationTab";
import { PatientSummaryTab } from "./PatientSummaryTab";
import { PatientComparisonTab } from "./PatientComparisonTab";
import { Paciente } from "@/hooks/usePacientes";
import { 
  User, 
  Calendar, 
  BarChart3, 
  History, 
  Bot,
  FileText,
  Camera,
  ShoppingCart,
  Stethoscope,
  Plus,
  TrendingUp,
  FileBarChart
} from "lucide-react";

interface PatientTabsProps {
  selectedPatient: Paciente;
  onOpenConsultaDialog: () => void;
  getObjetivoColor: (objetivo: string) => string;
  getStatusColor: (status: string) => string;
  getProgressColor: (progress: number) => string;
}

export const PatientTabs = ({ 
  selectedPatient, 
  onOpenConsultaDialog,
  getObjetivoColor,
  getStatusColor,
  getProgressColor
}: PatientTabsProps) => {
  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList className="grid w-full grid-cols-7 bg-muted h-12">
        <TabsTrigger value="geral" className="flex items-center gap-2 text-xs">
          <User className="w-4 h-4" />
          Geral
        </TabsTrigger>
        <TabsTrigger value="consultas" className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4" />
          Consultas
        </TabsTrigger>
        <TabsTrigger value="painel" className="flex items-center gap-2 text-xs">
          <BarChart3 className="w-4 h-4" />
          Painel
        </TabsTrigger>
        <TabsTrigger value="historico" className="flex items-center gap-2 text-xs">
          <History className="w-4 h-4" />
          Histórico
        </TabsTrigger>
        <TabsTrigger value="nutricoach" className="flex items-center gap-2 text-xs">
          <Bot className="w-4 h-4" />
          NutriCoach
        </TabsTrigger>
        <TabsTrigger value="resumo" className="flex items-center gap-2 text-xs">
          <FileBarChart className="w-4 h-4" />
          Resumo
        </TabsTrigger>
        <TabsTrigger value="comparativo" className="flex items-center gap-2 text-xs">
          <TrendingUp className="w-4 h-4" />
          Comparativo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="geral" className="space-y-6 mt-6">
        <PatientGeneralTab 
          selectedPatient={selectedPatient}
          onOpenConsultaDialog={onOpenConsultaDialog}
          getObjetivoColor={getObjetivoColor}
          getStatusColor={getStatusColor}
          getProgressColor={getProgressColor}
        />
      </TabsContent>

      <TabsContent value="consultas" className="space-y-6 mt-6">
        <PatientHistoryTab 
          selectedPatient={selectedPatient}
          onOpenConsultaDialog={onOpenConsultaDialog}
        />
      </TabsContent>

      <TabsContent value="painel" className="space-y-6 mt-6">
        <PatientDashboardTab selectedPatient={selectedPatient} />
      </TabsContent>

      <TabsContent value="historico" className="space-y-6 mt-6">
        <PatientHistoryTab 
          selectedPatient={selectedPatient}
          onOpenConsultaDialog={onOpenConsultaDialog}
        />
      </TabsContent>

      <TabsContent value="nutricoach" className="space-y-6 mt-6">
        <PatientCoachHistoryTab selectedPatient={selectedPatient} />
      </TabsContent>

      <TabsContent value="resumo" className="space-y-6 mt-6">
        <PatientSummaryTab selectedPatient={selectedPatient} />
      </TabsContent>

      <TabsContent value="comparativo" className="space-y-6 mt-6">
        <PatientComparisonTab selectedPatient={selectedPatient} />
      </TabsContent>
    </Tabs>
  );
};
