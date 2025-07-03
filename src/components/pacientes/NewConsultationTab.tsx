
import { MultiStepConsultationForm } from "./consultation/MultiStepConsultationForm";
import { Paciente } from "@/hooks/usePacientes";

interface NewConsultationTabProps {
  selectedPatient: Paciente;
}

export const NewConsultationTab = ({ selectedPatient }: NewConsultationTabProps) => {
  return (
    <MultiStepConsultationForm selectedPatient={selectedPatient} />
  );
};
