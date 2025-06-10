import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientGeneralTab } from "./PatientGeneralTab";
import { PatientPlanTab } from "./PatientPlanTab";
import { PatientPhotosTab } from "./PatientPhotosTab";
import { PatientShoppingTab } from "./PatientShoppingTab";
import { PatientHistoryTab } from "./PatientHistoryTab";
import { PatientClinicalHistory } from "./PatientClinicalHistory";
import { Paciente } from "@/hooks/usePacientes";
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
  return <Tabs defaultValue="geral" className="w-full">
      <TabsList className="grid w-full grid-cols-6 bg-purple-100">
        <TabsTrigger value="geral" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Geral</TabsTrigger>
        <TabsTrigger value="clinico" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Histórico Clínico</TabsTrigger>
        <TabsTrigger value="plano" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Plano Alimentar</TabsTrigger>
        <TabsTrigger value="fotos" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Fotos</TabsTrigger>
        <TabsTrigger value="compras" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Lista de Compras</TabsTrigger>
        
      </TabsList>

      <TabsContent value="geral" className="space-y-6 mt-6">
        <PatientGeneralTab selectedPatient={selectedPatient} onOpenConsultaDialog={onOpenConsultaDialog} getObjetivoColor={getObjetivoColor} getStatusColor={getStatusColor} getProgressColor={getProgressColor} />
      </TabsContent>

      <TabsContent value="clinico" className="space-y-6 mt-6">
        <PatientClinicalHistory selectedPatient={selectedPatient} />
      </TabsContent>

      <TabsContent value="plano" className="space-y-6 mt-6">
        <PatientPlanTab selectedPatient={selectedPatient} />
      </TabsContent>

      <TabsContent value="fotos" className="space-y-6 mt-6">
        <PatientPhotosTab selectedPatient={selectedPatient} />
      </TabsContent>

      <TabsContent value="compras" className="space-y-6 mt-6">
        <PatientShoppingTab />
      </TabsContent>

      <TabsContent value="historico" className="space-y-6 mt-6">
        <PatientHistoryTab selectedPatient={selectedPatient} onOpenConsultaDialog={onOpenConsultaDialog} />
      </TabsContent>
    </Tabs>;
};