
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, UserPlus, Filter, ChevronDown, Eye, Edit, Trash, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { usePacientes, Paciente } from "@/hooks/usePacientes";
import { NewPacienteDialog } from "@/components/NewPacienteDialog";
import { EditPacienteDialog } from "@/components/EditPacienteDialog";
import { DeletePacienteDialog } from "@/components/DeletePacienteDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PacientesModern = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPacienteDialogOpen, setNewPacienteDialogOpen] = useState(false);
  const [editPacienteDialogOpen, setEditPacienteDialogOpen] = useState(false);
  const [deletePacienteDialogOpen, setDeletePacienteDialogOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Filtros
  const [filters, setFilters] = useState({
    status: "all",
    objetivo: "all",
    stage: "all",
    source: "all",
    dateRange: "all"
  });
  
  const { data: pacientesData, isLoading, error } = usePacientes();
  const pacientes = pacientesData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 border-green-200";
      case "inativo":
        return "bg-red-100 text-red-800 border-red-200";
      case "em_tratamento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "acompanhamento":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "novo":
        return "bg-blue-100 text-blue-800";
      case "qualificado":
        return "bg-purple-100 text-purple-800";
      case "consulta_agendada":
        return "bg-yellow-100 text-yellow-800";
      case "consulta_realizada":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const toggleRowExpansion = (pacienteId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(pacienteId)) {
      newExpanded.delete(pacienteId);
    } else {
      newExpanded.add(pacienteId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredPacientes = pacientes.filter(paciente => {
    const lead = paciente.lead;
    if (!lead) return false;
    
    const matchesSearch = searchTerm === "" || 
      (lead.nome && lead.nome.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (lead.telefone && lead.telefone.includes(searchTerm)) || 
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filters.status === "all" || lead.status === filters.status;
    const matchesObjetivo = filters.objetivo === "all" || lead.objetivo === filters.objetivo;
    
    return matchesSearch && matchesStatus && matchesObjetivo;
  });

  const handleViewPaciente = (paciente: Paciente) => {
    console.log('Visualizar paciente:', paciente.lead.nome);
  };

  const handleEditPaciente = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setEditPacienteDialogOpen(true);
  };

  const handleDeletePaciente = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setDeletePacienteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setSelectedPaciente(null);
    setDeletePacienteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <Header title="Pacientes" description="Gerencie seus pacientes" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <Header title="Pacientes" description="Gerencie seus pacientes" />
        <div className="text-center text-red-500">
          Erro ao carregar pacientes: {error.message}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-8 bg-gray-50 min-h-screen">
        <Header title="Pacientes" description="Gerencie seus pacientes com facilidade" />

        {/* Métricas do Topo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Pacientes</CardTitle>
              <Users className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{pacientes.length}</div>
              <p className="text-sm text-gray-500 mt-1">
                {pacientes.length === 0 ? "Nenhum paciente cadastrado" : "Pacientes ativos na plataforma"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pacientes Filtrados</CardTitle>
              <UserPlus className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{filteredPacientes.length}</div>
              <p className="text-sm text-gray-500 mt-1">
                Resultados da busca atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controles Superiores */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex gap-3">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg rounded-xl px-6"
              onClick={() => setNewPacienteDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar pacientes..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-10 w-80 border-gray-200 rounded-xl shadow-sm focus:ring-purple-500 focus:border-purple-500" 
              />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6 bg-white shadow-sm border-0 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-lg font-semibold text-gray-900">Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="rounded-lg border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="em_tratamento">Em Tratamento</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.objetivo} onValueChange={(value) => setFilters({...filters, objetivo: value})}>
                <SelectTrigger className="rounded-lg border-gray-200">
                  <SelectValue placeholder="Objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Objetivos</SelectItem>
                  <SelectItem value="Perda de Peso">Perda de Peso</SelectItem>
                  <SelectItem value="Ganho de Massa">Ganho de Massa</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.stage} onValueChange={(value) => setFilters({...filters, stage: value})}>
                <SelectTrigger className="rounded-lg border-gray-200">
                  <SelectValue placeholder="Estágio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estágios</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="qualificado">Qualificado</SelectItem>
                  <SelectItem value="consulta_agendada">Consulta Agendada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.source} onValueChange={(value) => setFilters({...filters, source: value})}>
                <SelectTrigger className="rounded-lg border-gray-200">
                  <SelectValue placeholder="Fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Fontes</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="ads">Anúncios</SelectItem>
                  <SelectItem value="referral">Indicação</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                <SelectTrigger className="rounded-lg border-gray-200">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o Período</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Pacientes */}
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Pacientes ({filteredPacientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPacientes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Nenhum paciente encontrado</h3>
                <p className="text-gray-400">
                  {pacientes.length === 0 
                    ? "Clique em 'Novo Paciente' para começar" 
                    : "Tente ajustar os filtros de busca"
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100">
                      <TableHead className="font-semibold text-gray-700">Paciente</TableHead>
                      <TableHead className="font-semibold text-gray-700">UF</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Cadastro</TableHead>
                      <TableHead className="font-semibold text-gray-700">Checklist</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPacientes.map((paciente) => {
                      const lead = paciente.lead;
                      if (!lead) return null;

                      const isExpanded = expandedRows.has(paciente.id);

                      return (
                        <>
                          <TableRow key={paciente.id} className="border-gray-100 hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                                  {lead.foto_perfil && (
                                    <AvatarImage src={lead.foto_perfil} alt={lead.nome || 'Paciente'} className="object-cover" />
                                  )}
                                  <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                                    {lead.nome ? lead.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'P'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold text-gray-900">{lead.nome || 'Nome não informado'}</div>
                                  <div className="text-sm text-gray-500">{lead.telefone || 'Telefone não informado'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-700 font-medium">{lead.estado || '-'}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(lead.status || 'inativo')} rounded-full px-3 py-1 text-xs font-medium border`}>
                                {formatStatusDisplay(lead.status || 'inativo')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-600">
                                {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : '-'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(paciente.id)}
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                              >
                                <Info className="w-4 h-4 mr-1" />
                                Detalhes
                                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleViewPaciente(paciente)}
                                      className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Visualizar</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleEditPaciente(paciente)}
                                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Editar</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleDeletePaciente(paciente)}
                                      className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Excluir</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Linha Expandida com Checklist */}
                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={6} className="bg-gray-50 p-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor('medium')}`}></div>
                                    Checklist Rápido - {lead.nome}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Objetivo</label>
                                        <p className="text-gray-900 font-medium">{lead.objetivo || 'Não definido'}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Estágio no Kanban</label>
                                        <Badge className={`${getStageColor(lead.status)} mt-1`}>
                                          {lead.status === 'novo' ? 'Novo Lead' : 
                                           lead.status === 'qualificado' ? 'Qualificado' :
                                           lead.status === 'consulta_agendada' ? 'Consulta Agendada' :
                                           lead.status === 'consulta_realizada' ? 'Consulta Realizada' : 'Indefinido'}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Consultas Realizadas</label>
                                        <p className="text-gray-900 font-medium">{lead.consultas_realizadas || 0}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Primeiro Contato</label>
                                        <p className="text-gray-900">{lead.data_conversao ? new Date(lead.data_conversao).toLocaleDateString('pt-BR') : 'Não registrado'}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Fonte do Lead</label>
                                        <p className="text-gray-900 font-medium">Instagram</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Anotações</label>
                                        <p className="text-gray-600 text-sm">{lead.anotacoes || 'Sem anotações registradas'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <NewPacienteDialog 
          open={newPacienteDialogOpen} 
          onOpenChange={setNewPacienteDialogOpen} 
        />
        
        <EditPacienteDialog 
          open={editPacienteDialogOpen} 
          onOpenChange={setEditPacienteDialogOpen}
          paciente={selectedPaciente}
        />
        
        <DeletePacienteDialog 
          open={deletePacienteDialogOpen} 
          onOpenChange={setDeletePacienteDialogOpen}
          paciente={selectedPaciente}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
    </TooltipProvider>
  );
};

export default PacientesModern;
