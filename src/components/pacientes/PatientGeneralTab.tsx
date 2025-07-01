
import { PatientPersonalInfoCard } from "./cards/PatientPersonalInfoCard";
import { PatientStatusCard } from "./cards/PatientStatusCard";
import { PatientActivityCard } from "./cards/PatientActivityCard";
import { Paciente } from "@/hooks/usePacientes";

interface PatientGeneralTabProps {
  selectedPatient: Paciente;
  onOpenConsultaDialog: () => void;
  getObjetivoColor: (objetivo: string) => string;
  getStatusColor: (status: string) => string;
  getProgressColor: (progress: number) => string;
}

export const PatientGeneralTab = ({ 
  selectedPatient, 
  onOpenConsultaDialog,
  getObjetivoColor,
  getStatusColor,
  getProgressColor
}: PatientGeneralTabProps) => {
  const handleConsultasClick = () => {
    // Alternar para a aba de consultas
    const consultasTab = document.querySelector('[value="consultas"]') as HTMLElement;
    if (consultasTab) {
      consultasTab.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PatientPersonalInfoCard 
        selectedPatient={selectedPatient}
        onConsultasClick={handleConsultasClick}
      />
      
      <PatientStatusCard 
        selectedPatient={selectedPatient}
        getObjetivoColor={getObjetivoColor}
        getStatusColor={getStatusColor}
        getProgressColor={getProgressColor}
      />
      
      <PatientActivityCard 
        selectedPatient={selectedPatient}
      />
    </div>
  );
};
