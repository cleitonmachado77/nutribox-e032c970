
import { useState } from "react";
import { Header } from "@/components/Header";
import { usePacientes } from "@/hooks/usePacientes";
import { ConsultaRealizadaDialog } from "@/components/ConsultaRealizadaDialog";
import { DeletePacienteDialog } from "@/components/DeletePacienteDialog";
import { PacientesStats } from "@/components/pacientes/PacientesStats";
import { ConsultasProximas } from "@/components/ConsultasProximas";
import { PacientesToolbar } from "@/components/pacientes/PacientesToolbar";
import { PacientesFilters } from "@/components/pacientes/PacientesFilters";
import { ConsultasPatientGrid } from "@/components/consultas/ConsultasPatientGrid";
import { ConsultasPatientProfile } from "@/components/consultas/ConsultasPatientProfile";
import React from "react";

const Consultas = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [consultaDialogOpen, setConsultaDialogOpen] = useState(false);
  const [selectedPacienteForDelete, setSelectedPacienteForDelete] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState({
    status: '',
    objetivo: '',
    progresso: '',
    dataRange: null as any
  });
  
  const { data: pacientes = [], isLoading, error } = usePacientes();

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleExportData = () => {
    console.log('Exportando dados dos pacientes...');
  };

  const handleImportData = () => {
    console.log('Importando dados dos pacientes...');
  };

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
    if (selectedPatient?.id === deletedPacienteId) {
      setSelectedPatient(null);
    }
    setSelectedPacienteForDelete(null);
  };

  // Filtrar e ordenar pacientes
  const filteredAndSortedPacientes = React.useMemo(() => {
    let filtered = pacientes.filter(paciente => {
      const matchesSearch = paciente.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paciente.lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paciente.lead.telefone.includes(searchTerm);

      const matchesStatus = !activeFilters.status || paciente.status_tratamento === activeFilters.status;
      const matchesObjetivo = !activeFilters.objetivo || paciente.lead.objetivo === activeFilters.objetivo;
      
      let matchesProgresso = true;
      if (activeFilters.progresso) {
        const progress = paciente.lead.progresso || 0;
        switch (activeFilters.progresso) {
          case 'low': matchesProgresso = progress < 30; break;
          case 'medium': matchesProgresso = progress >= 30 && progress < 70; break;
          case 'high': matchesProgresso = progress >= 70; break;
        }
      }

      return matchesSearch && matchesStatus && matchesObjetivo && matchesProgresso;
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
  }, [pacientes, searchTerm, activeFilters, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Consultas" description="Gerencie consultas e perfis dos seus pacientes" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Consultas" description="Gerencie consultas e perfis dos seus pacientes" />
        <div className="text-center text-red-500">
          Erro ao carregar pacientes: {error.message}
        </div>
      </div>
    );
  }

  // Se um paciente está selecionado, mostrar perfil em tela cheia
  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-indigo-950">
        <ConsultasPatientProfile
          selectedPatient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          onOpenConsultaDialog={() => setConsultaDialogOpen(true)}
        />
        
        {/* Dialog para registrar consulta */}
        <ConsultaRealizadaDialog 
          open={consultaDialogOpen} 
          onOpenChange={setConsultaDialogOpen} 
          paciente={selectedPatient} 
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-screen bg-indigo-950">
      <Header title="Consultas" description="Gerencie consultas e perfis dos seus pacientes" />

      <PacientesStats pacientes={pacientes} />

      <ConsultasProximas />

      {/* Toolbar com ações principais */}
      <PacientesToolbar 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onExport={handleExportData}
        onImport={handleImportData}
        selectedCount={0}
        totalCount={filteredAndSortedPacientes.length}
      />

      {/* Filtros avançados */}
      <PacientesFilters 
        onFiltersChange={handleFilterChange}
        activeFilters={activeFilters}
      />

      {/* Grid horizontal de pacientes */}
      <ConsultasPatientGrid
        pacientes={filteredAndSortedPacientes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectPatient={setSelectedPatient}
        onDeletePatient={handleDeletePatient}
        viewMode={viewMode}
      />

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

export default Consultas;
