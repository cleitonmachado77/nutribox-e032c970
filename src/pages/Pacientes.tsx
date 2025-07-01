
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, Download, Users, UserPlus, Calendar, Eye, Tag, Trash, Edit, Archive, ArchiveRestore } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewPacienteDialog } from "@/components/NewPacienteDialog";
import { Header } from "@/components/Header";
import { usePacientes } from "@/hooks/usePacientes";
import { format } from "date-fns";
import { PacientesFilter, FilterCriteria } from "@/components/PacientesFilter";
import { ImportPacientesDialog } from "@/components/ImportPacientesDialog";
import { ExportPacientesButton } from "@/components/ExportPacientesButton";
import { EditPacienteTagDialog } from "@/components/EditPacienteTagDialog";
import { DeletePacienteDialog } from "@/components/DeletePacienteDialog";
import { EditPacienteDialog } from "@/components/EditPacienteDialog";
import { getLeadProgressByStatus, getStatusDisplayName, getProgressColor } from "@/hooks/useLeadProgress";
import { useArchiveLead } from "@/hooks/useArchiveLead";
import { useUpdateLead } from "@/hooks/useUpdateLead";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/types/lead";

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPacienteDialog, setShowNewPacienteDialog] = useState(false);
  const [selectedPacienteForTagEdit, setSelectedPacienteForTagEdit] = useState<Lead | null>(null);
  const [selectedPacienteForDelete, setSelectedPacienteForDelete] = useState<Lead | null>(null);
  const [selectedPacienteForEdit, setSelectedPacienteForEdit] = useState<Lead | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({});
  
  const { data: pacientesData, isLoading, error } = usePacientes();
  const archivePaciente = useArchiveLead();
  const updatePaciente = useUpdateLead();
  const { toast } = useToast();

  // Convert pacientes data to leads format for compatibility
  const pacientes = pacientesData?.map(paciente => paciente.lead) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500";
      case "inativo":
        return "bg-red-500";
      case "em_tratamento":
        return "bg-blue-500";
      case "acompanhamento":
        return "bg-orange-500";
      case "arquivado":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getObjetivoColor = (objetivoTag: any) => {
    if (objetivoTag) {
      return objetivoTag.cor;
    }
    return "#6B7280";
  };

  const formatStatusDisplay = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "inativo":
        return "Inativo";
      case "em_tratamento":
        return "Em Tratamento";
      case "acompanhamento":
        return "Acompanhamento";
      default:
        return status;
    }
  };

  // Filtrar pacientes baseado no termo de busca
  const applyFilters = (pacientes: Lead[], filters: FilterCriteria, searchTerm: string) => {
    return pacientes.filter(paciente => {
      const matchesSearch = searchTerm === "" || 
        paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paciente.telefone.includes(searchTerm) || 
        paciente.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paciente.cidade?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || paciente.status === filters.status;
      const matchesEstado = !filters.estado || paciente.estado?.toLowerCase().includes(filters.estado.toLowerCase());
      const matchesTag = !filters.objetivo_tag_id || paciente.objetivo_tag_id === filters.objetivo_tag_id;
      const matchesProgressoMin = filters.progresso_min === undefined || paciente.progresso >= filters.progresso_min;
      const matchesProgressoMax = filters.progresso_max === undefined || paciente.progresso <= filters.progresso_max;
      
      let matchesDataRange = true;
      if (filters.data_inicio || filters.data_fim) {
        const pacienteDate = new Date(paciente.created_at);
        if (filters.data_inicio) {
          matchesDataRange = matchesDataRange && pacienteDate >= new Date(filters.data_inicio);
        }
        if (filters.data_fim) {
          matchesDataRange = matchesDataRange && pacienteDate <= new Date(filters.data_fim + 'T23:59:59');
        }
      }
      
      return matchesSearch && matchesStatus && matchesEstado && matchesTag && matchesProgressoMin && matchesProgressoMax && matchesDataRange;
    });
  };

  const filteredPacientes = pacientes ? applyFilters(pacientes, activeFilters, searchTerm) : [];

  const handleFilter = (filters: FilterCriteria) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  // Calcular estatísticas baseadas nos dados reais
  const totalPacientes = pacientes?.length || 0;
  const pacientesHoje = pacientes?.filter(paciente => {
    const hoje = new Date();
    const dataCadastro = new Date(paciente.created_at);
    return dataCadastro.toDateString() === hoje.toDateString();
  }).length || 0;
  
  const pacientesOntem = pacientes?.filter(paciente => {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataCadastro = new Date(paciente.created_at);
    return dataCadastro.toDateString() === ontem.toDateString();
  }).length || 0;
  
  const pacientesUltimos7Dias = pacientes?.filter(paciente => {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const dataCadastro = new Date(paciente.created_at);
    return dataCadastro >= seteDiasAtras;
  }).length || 0;

  const handleArchivePaciente = async (paciente: Lead) => {
    const isArchived = paciente.status === 'arquivado';
    try {
      await archivePaciente.mutateAsync({
        leadId: paciente.id,
        archived: !isArchived
      });
      toast({
        title: "Sucesso!",
        description: `Paciente ${isArchived ? 'desarquivado' : 'arquivado'} com sucesso.`
      });
    } catch (error) {
      console.error('Error archiving paciente:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${isArchived ? 'desarquivar' : 'arquivar'} paciente. Tente novamente.`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Pacientes" description="Gerencie seus pacientes" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Pacientes" description="Gerencie seus pacientes" />
        <div className="text-center text-red-500">
          Erro ao carregar pacientes: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-indigo-950">
      <Header title="Pacientes" description="Gerencie seus pacientes" />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPacientes}</div>
            <p className="text-xs text-indigo-200">
              {totalPacientes === 0 ? "Nenhum paciente cadastrado" : "Total de pacientes cadastrados"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Hoje</CardTitle>
            <UserPlus className="h-4 w-4 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pacientesHoje}</div>
            <p className="text-xs text-emerald-200">
              {pacientesHoje === 0 ? "Nenhum paciente hoje" : `${pacientesHoje} paciente${pacientesHoje > 1 ? 's' : ''} hoje`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Ontem</CardTitle>
            <Calendar className="h-4 w-4 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pacientesOntem}</div>
            <p className="text-xs text-orange-200">
              {pacientesOntem === 0 ? "Nenhum paciente ontem" : `${pacientesOntem} paciente${pacientesOntem > 1 ? 's' : ''} ontem`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Últimos 7 dias</CardTitle>
            <Calendar className="h-4 w-4 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pacientesUltimos7Dias}</div>
            <p className="text-xs text-purple-200">
              {pacientesUltimos7Dias === 0 ? "Sem atividade recente" : `${pacientesUltimos7Dias} paciente${pacientesUltimos7Dias > 1 ? 's' : ''} na semana`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setShowNewPacienteDialog(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Paciente
          </Button>
          <ImportPacientesDialog>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
          </ImportPacientesDialog>
          <ExportPacientesButton pacientes={filteredPacientes} />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar pacientes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
          </div>
          <PacientesFilter onFilter={handleFilter} onClearFilters={handleClearFilters} />
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Filtros ativos:</span>
          {Object.entries(activeFilters).map(([key, value]) => 
            value && (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {String(value)}
              </Badge>
            )
          )}
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Limpar filtros
          </Button>
        </div>
      )}

      {/* Tabela de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados: {filteredPacientes.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPacientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {(pacientes?.length || 0) === 0 
                ? "Nenhum paciente cadastrado. Clique em 'Novo Paciente' para começar." 
                : "Nenhum paciente encontrado com os filtros aplicados."
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Próx. Consulta</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.map((paciente) => {
                  const progressoAtual = getLeadProgressByStatus(paciente.status);
                  const progressColor = getProgressColor(progressoAtual);
                  const isArchived = paciente.status === 'arquivado';

                  return (
                    <TableRow key={paciente.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {paciente.foto_perfil && (
                              <AvatarImage src={paciente.foto_perfil} alt={paciente.nome} className="object-cover" />
                            )}
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              {paciente.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{paciente.nome}</div>
                            <div className="text-sm text-gray-500">{paciente.telefone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{paciente.estado || '-'}</TableCell>
                      <TableCell>
                        {paciente.objetivo_tag ? (
                          <Badge 
                            variant="secondary" 
                            className="text-white cursor-pointer"
                            style={{ backgroundColor: paciente.objetivo_tag.cor }}
                            onClick={() => setSelectedPacienteForTagEdit(paciente)}
                          >
                            {paciente.objetivo_tag.nome}
                          </Badge>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedPacienteForTagEdit(paciente)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Tag className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(paciente.status)}>
                          {formatStatusDisplay(paciente.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                              style={{ width: `${progressoAtual}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-[35px]">{progressoAtual}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(paciente.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {paciente.proxima_consulta ? (
                          <span className="text-sm font-medium text-blue-600">
                            {format(new Date(paciente.proxima_consulta), 'dd/MM/yyyy HH:mm')}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedPacienteForEdit(paciente)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleArchivePaciente(paciente)}
                            className="text-yellow-600 hover:text-yellow-700"
                            disabled={archivePaciente.isPending}
                          >
                            {isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedPacienteForDelete(paciente)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewPacienteDialog open={showNewPacienteDialog} onOpenChange={setShowNewPacienteDialog} />
      
      <EditPacienteTagDialog 
        open={!!selectedPacienteForTagEdit} 
        onOpenChange={(open) => !open && setSelectedPacienteForTagEdit(null)} 
        paciente={selectedPacienteForTagEdit} 
      />

      <DeletePacienteDialog 
        open={!!selectedPacienteForDelete} 
        onOpenChange={(open) => !open && setSelectedPacienteForDelete(null)} 
        paciente={selectedPacienteForDelete} 
      />

      <EditPacienteDialog 
        open={!!selectedPacienteForEdit} 
        onOpenChange={(open) => !open && setSelectedPacienteForEdit(null)} 
        paciente={selectedPacienteForEdit} 
      />
    </div>
  );
};

export default Pacientes;
