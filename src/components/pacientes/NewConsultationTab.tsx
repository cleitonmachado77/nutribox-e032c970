
import { MultiStepConsultationForm } from "./consultation/MultiStepConsultationForm";
import { Paciente } from "@/hooks/usePacientes";

interface NewConsultationTabProps {
  selectedPatient: Paciente;
  onBack?: () => void;
}

export const NewConsultationTab = ({ selectedPatient, onBack }: NewConsultationTabProps) => {
  return (
    <MultiStepConsultationForm selectedPatient={selectedPatient} />
  );
};
