
import { useState } from "react";
import { Header } from "@/components/Header";
import { usePacientes } from "@/hooks/usePacientes";
import { ConsultaRealizadaDialog } from "@/components/ConsultaRealizadaDialog";
import { DeletePacienteDialog } from "@/components/DeletePacienteDialog";
import { PacientesStats } from "@/components/pacientes/PacientesStats";
import { PacientesList } from "@/components/pacientes/PacientesList";
import { PatientProfile } from "@/components/pacientes/PatientProfile";
import React from "react";

const Pacientes = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [consultaDialogOpen, setConsultaDialogOpen] = useState(false);
  const [selectedPacienteForDelete, setSelectedPacienteForDelete] = useState<any>(null);
  const { data: pacientes = [], isLoading, error } = usePacientes();

  // Limpar paciente selecionado se ele foi deletado
  React.useEffect(() => {
    if (selectedPatient && !pacientes.find(p => p.id === selectedPatient.id)) {
      setSelectedPatient(null);
    }
  }, [pacientes, selectedPatient]);

  const handleDeletePatient = (paciente: any) => {
    setSelectedPacienteForDelete(paciente);
  };

  const handleDeleteSuccess = (deletedPacienteId: string) => {
    // Limpar seleção se for o paciente deletado
    if (selectedPatient?.id === deletedPacienteId) {
      setSelectedPatient(null);
    }
    // Fechar dialog de exclusão
    setSelectedPacienteForDelete(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Pacientes" description="Gerencie seus pacientes convertidos de leads" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Pacientes" description="Gerencie seus pacientes convertidos de leads" />
        <div className="text-center text-red-500">
          Erro ao carregar pacientes: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8 bg-gray-950 min-h-screen">
      <Header title="Pacientes" description="Gerencie seus pacientes convertidos de leads" />

      <PacientesStats pacientes={pacientes} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PacientesList
          pacientes={pacientes}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          onDeletePatient={handleDeletePatient}
        />

        <PatientProfile
          selectedPatient={selectedPatient}
          onOpenConsultaDialog={() => setConsultaDialogOpen(true)}
        />
      </div>

      {/* Dialog para registrar consulta */}
      {selectedPatient && (
        <ConsultaRealizadaDialog
          open={consultaDialogOpen}
          onOpenChange={setConsultaDialogOpen}
          paciente={selectedPatient}
        />
      )}

      {/* Dialog para excluir paciente */}
      <DeletePacienteDialog
        open={!!selectedPacienteForDelete}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPacienteForDelete(null);
          }
        }}
        paciente={selectedPacienteForDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default Pacientes;
