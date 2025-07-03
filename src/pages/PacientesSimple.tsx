
import { useState } from "react";
import { Header } from "@/components/Header";
import { usePacientes } from "@/hooks/usePacientes";
import { PacientesToolbar } from "@/components/pacientes/PacientesToolbar";
import { PacientesList } from "@/components/pacientes/PacientesList";
import { PacientesStats } from "@/components/pacientes/PacientesStats";
import { PatientProfile } from "@/components/pacientes/PatientProfile";
import { NewPacienteDialog } from "@/components/NewPacienteDialog";
import { EditPacienteDialog } from "@/components/EditPacienteDialog";
import { DeletePacienteDialog } from "@/components/DeletePacienteDialog";
import { NewConsultationTab } from "@/components/pacientes/NewConsultationTab";
import React from "react";

const PacientesSimple = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newPacienteDialogOpen, setNewPacienteDialogOpen] = useState(false);
  const [editPacienteDialogOpen, setEditPacienteDialogOpen] = useState(false);
  const [deletePacienteDialogOpen, setDeletePacienteDialogOpen] = useState(false);
  const [selectedPacienteForEdit, setSelectedPacienteForEdit] = useState<any>(null);
  const [selectedPacienteForDelete, setSelectedPacienteForDelete] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: pacientes = [], isLoading, error } = usePacientes();

  // Limpar paciente selecionado se ele foi deletado
  React.useEffect(() => {
    if (selectedPatient && !pacientes.find(p => p.id === selectedPatient.id)) {
      setSelectedPatient(null);
    }
  }, [pacientes, selectedPatient]);

  const handleEditPatient = (paciente: any) => {
    setSelectedPacienteForEdit(paciente);
    setEditPacienteDialogOpen(true);
  };

  const handleDeletePatient = (paciente: any) => {
    setSelectedPacienteForDelete(paciente);
    setDeletePacienteDialogOpen(true);
  };

  const handleDeleteSuccess = (deletedPacienteId: string) => {
    if (selectedPatient?.id === deletedPacienteId) {
      setSelectedPatient(null);
    }
    setSelectedPacienteForDelete(null);
    setDeletePacienteDialogOpen(false);
  };

  // Filtrar e ordenar pacientes
  const filteredAndSortedPacientes = React.useMemo(() => {
    let filtered = pacientes.filter(paciente => {
      const matchesSearch = paciente.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paciente.lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paciente.lead.telefone.includes(searchTerm);

      const matchesTags = selectedTags.length === 0 || 
        (paciente.lead.tags && paciente.lead.tags.some((tag: any) => selectedTags.includes(tag.id)));

      return matchesSearch && matchesTags;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (sortBy) {
        case 'name':
          valueA = a.lead.nome.toLowerCase();
          valueB = b.lead.nome.toLowerCase();
          break;
        case 'created_at':
          valueA = new Date(a.created_at);
          valueB = new Date(b.created_at);
          break;
        case 'progresso':
          valueA = a.lead.progresso || 0;
          valueB = b.lead.progresso || 0;
          break;
        case 'ultima_consulta':
          valueA = a.lead.ultima_consulta ? new Date(a.lead.ultima_consulta) : new Date(0);
          valueB = b.lead.ultima_consulta ? new Date(b.lead.ultima_consulta) : new Date(0);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return filtered;
  }, [pacientes, searchTerm, selectedTags, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Header title="Pacientes" description="Gerencie seus pacientes" />
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
              <p className="text-gray-500 text-sm">Carregando pacientes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Header title="Pacientes" description="Gerencie seus pacientes" />
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Erro ao carregar pacientes: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se um paciente está selecionado, mostrar perfil em tela cheia
  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50">
        {activeTab === "consultation" ? (
          <NewConsultationTab
            selectedPatient={selectedPatient}
            onBack={() => setActiveTab("overview")}
          />
        ) : (
          <PatientProfile
            selectedPatient={selectedPatient}
            onBack={() => setSelectedPatient(null)}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            onStartConsultation={() => setActiveTab("consultation")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Header title="Pacientes" description="Gerencie seus pacientes" />
        
        <PacientesStats pacientes={pacientes} />

        <PacientesToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddNew={() => setNewPacienteDialogOpen(true)}
        />

        <PacientesList
          pacientes={filteredAndSortedPacientes}
          viewMode={viewMode}
          onSelectPatient={setSelectedPatient}
          onEditPatient={handleEditPatient}
          onDeletePatient={handleDeletePatient}
        />

        <NewPacienteDialog 
          open={newPacienteDialogOpen} 
          onOpenChange={setNewPacienteDialogOpen} 
        />

        {selectedPacienteForEdit && (
          <EditPacienteDialog 
            open={editPacienteDialogOpen} 
            onOpenChange={setEditPacienteDialogOpen} 
            paciente={selectedPacienteForEdit} 
          />
        )}

        {selectedPacienteForDelete && (
          <DeletePacienteDialog 
            open={deletePacienteDialogOpen} 
            onOpenChange={setDeletePacienteDialogOpen} 
            paciente={selectedPacienteForDelete} 
            onDeleteSuccess={handleDeleteSuccess} 
          />
        )}
      </div>
    </div>
  );
};

export default PacientesSimple;
