
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { HistoricoConsultas } from "@/components/HistoricoConsultas";
import { Paciente } from "@/hooks/usePacientes";

interface PatientHistoryTabProps {
  selectedPatient: Paciente;
  onOpenConsultaDialog: () => void;
}

export const PatientHistoryTab = ({ selectedPatient, onOpenConsultaDialog }: PatientHistoryTabProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Histórico de Consultas</h3>
        <Button 
          onClick={onOpenConsultaDialog}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Nova Consulta
        </Button>
      </div>
      <HistoricoConsultas pacienteId={selectedPatient.id} />
    </>
  );
};
