
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, UserPlus, Filter, ChevronDown, Eye, Edit, Trash, Info, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { useLeads, Lead } from "@/hooks/useLeads";
import { NewLeadDialog } from "@/components/NewLeadDialog";
import { EditLeadDialog } from "@/components/EditLeadDialog";
import { DeleteLeadDialog } from "@/components/DeleteLeadDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const LeadsModern = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newLeadDialogOpen, setNewLeadDialogOpen] = useState(false);
  const [editLeadDialogOpen, setEditLeadDialogOpen] = useState(false);
  const [deleteLeadDialogOpen, setDeleteLeadDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    status: "all",
    objetivo: "all",
    stage: "all",
    source: "all",
    priority: "all",
    dateRange: "all"
  });
  
  const { data: leadsData, isLoading, error } = useLeads();
  const leads = leadsData || [];

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

  const getObjectiveEmoji = (objetivo: string) => {
    switch (objetivo) {
      case "Perda de Peso":
        return "🏃‍♂️";
      case "Ganho de Massa":
        return "💪";
      case "Manutenção":
        return "⚖️";
      case "Hipertrofia":
        return "🔥";
      case "Definição":
        return "✨";
      default:
        return "🎯";
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

  const formatStageDisplay = (stage: string) => {
    switch (stage) {
      case "novo":
        return "🔵 Novo";
      case "qualificado":
        return "🟣 Qualificado";
      case "consulta_agendada":
        return "🟡 Consulta Agendada";
      case "consulta_realizada":
        return "🟢 Consulta Realizada";
      default:
        return stage;
    }
  };

  const toggleRowExpansion = (leadId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === "" || 
      (lead.nome && lead.nome.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (lead.telefone && lead.telefone.includes(searchTerm)) || 
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filters.status === "all" || lead.status === filters.status;
    const matchesObjetivo = filters.objetivo === "all" || lead.objetivo === filters.objetivo;
    const matchesStage = filters.stage === "all" || lead.status === filters.stage;
    
    return matchesSearch && matchesStatus && matchesObjetivo && matchesStage;
  });

  const handleViewLead = (lead: Lead) => {
    console.log('Visualizar lead:', lead.nome);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditLeadDialogOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteLeadDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setSelectedLead(null);
    setDeleteLeadDialogOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      objetivo: "all",
      stage: "all",
      source: "all",
      priority: "all",
      dateRange: "all"
    });
  };

  const applyFilters = () => {
    setFilterModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <Header title="Pacientes" description="Track and manage all new contacts from potential patients" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <Header title="Pacientes" description="Track and manage all new contacts from potential patients" />
        <div className="text-center text-red-500">
          Erro ao carregar pacientes: {error.message}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-8 bg-white min-h-screen">
        <Header title="Pacientes" description="Track and manage all new contacts from potential patients" />

        {/* Métricas do Topo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-0 rounded-xl hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total de Pacientes</CardTitle>
              <Users className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{leads.length}</div>
              <p className="text-sm text-purple-100 mt-1">
                {leads.length === 0 ? "Nenhum paciente cadastrado" : "Pacientes na plataforma"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg border-0 rounded-xl hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Pacientes Filtrados</CardTitle>
              <UserPlus className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{filteredLeads.length}</div>
              <p className="text-sm text-green-100 mt-1">
                Resultados da busca atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controles Superiores */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex gap-3">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg rounded-xl px-6 transform hover:scale-105 transition-all duration-200"
              onClick={() => setNewLeadDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>

            <Sheet open={filterModalOpen} onOpenChange={setFilterModalOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl px-6 transform hover:scale-105 transition-all duration-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-600" />
                    Filtros Avançados
                  </SheetTitle>
                  <SheetDescription>
                    Refine sua busca para encontrar pacientes específicos
                  </SheetDescription>
                </SheetHeader>
                
                <div className="grid gap-6 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                      <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os Status</SelectItem>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="em_tratamento">Em Tratamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Objetivo</label>
                      <Select value={filters.objetivo} onValueChange={(value) => setFilters({...filters, objetivo: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os Objetivos</SelectItem>
                          <SelectItem value="Perda de Peso">🏃‍♂️ Perda de Peso</SelectItem>
                          <SelectItem value="Ganho de Massa">💪 Ganho de Massa</SelectItem>
                          <SelectItem value="Manutenção">⚖️ Manutenção</SelectItem>
                          <SelectItem value="Hipertrofia">🔥 Hipertrofia</SelectItem>
                          <SelectItem value="Definição">✨ Definição</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Estágio no Funil</label>
                      <Select value={filters.stage} onValueChange={(value) => setFilters({...filters, stage: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os Estágios</SelectItem>
                          <SelectItem value="novo">🔵 Novo</SelectItem>
                          <SelectItem value="qualificado">🟣 Qualificado</SelectItem>
                          <SelectItem value="consulta_agendada">🟡 Consulta Agendada</SelectItem>
                          <SelectItem value="consulta_realizada">🟢 Consulta Realizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Fonte</label>
                      <Select value={filters.source} onValueChange={(value) => setFilters({...filters, source: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as Fontes</SelectItem>
                          <SelectItem value="instagram">📸 Instagram</SelectItem>
                          <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                          <SelectItem value="ads">📢 Anúncios</SelectItem>
                          <SelectItem value="referral">👥 Indicação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Prioridade</label>
                      <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as Prioridades</SelectItem>
                          <SelectItem value="high">🔴 Alta</SelectItem>
                          <SelectItem value="medium">🟡 Média</SelectItem>
                          <SelectItem value="low">🟢 Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Período</label>
                      <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Todo o período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todo o Período</SelectItem>
                          <SelectItem value="today">Hoje</SelectItem>
                          <SelectItem value="week">Esta Semana</SelectItem>
                          <SelectItem value="month">Este Mês</SelectItem>
                          <SelectItem value="quarter">Este Trimestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={applyFilters} className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-lg">
                    Aplicar Filtros
                  </Button>
                  <Button onClick={clearFilters} variant="outline" className="flex-1 rounded-lg">
                    Limpar
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
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

        {/* Tabela de Pacientes */}
        <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Pacientes ({filteredLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Nenhum paciente encontrado</h3>
                <p className="text-gray-400">
                  {leads.length === 0 
                    ? "Clique em 'Novo Paciente' para começar" 
                    : "Tente ajustar os filtros de busca"
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100 bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Nome Completo</TableHead>
                      <TableHead className="font-semibold text-gray-700">UF</TableHead>
                      <TableHead className="font-semibold text-gray-700">Estágio do Funil</TableHead>
                      <TableHead className="font-semibold text-gray-700">Objetivo</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Cadastro</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => {
                      const isExpanded = expandedRows.has(lead.id);

                      return (
                        <>
                          <TableRow key={lead.id} className="border-gray-100 hover:bg-purple-50/30 transition-all duration-200 group">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 ring-2 ring-purple-100">
                                  {lead.foto_perfil && (
                                    <AvatarImage src={lead.foto_perfil} alt={lead.nome || 'Paciente'} className="object-cover" />
                                  )}
                                  <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                                    {lead.nome ? lead.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'L'}
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
                              <Badge className={`${getStageColor(lead.status || 'novo')} rounded-full px-3 py-1 text-xs font-medium`}>
                                {formatStageDisplay(lead.status || 'novo')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getObjectiveEmoji(lead.objetivo || '')}</span>
                                <span className="text-gray-700 font-medium">{lead.objetivo || 'Não definido'}</span>
                              </div>
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
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleViewLead(lead)}
                                      className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                                      onClick={() => handleEditLead(lead)}
                                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                                      onClick={() => handleDeleteLead(lead)}
                                      className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                    >
                                      <Trash className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Excluir</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
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
        <NewLeadDialog 
          open={newLeadDialogOpen} 
          onOpenChange={setNewLeadDialogOpen} 
        />
        
        <EditLeadDialog 
          open={editLeadDialogOpen} 
          onOpenChange={setEditLeadDialogOpen}
          lead={selectedLead}
        />
        
        <DeleteLeadDialog 
          open={deleteLeadDialogOpen} 
          onOpenChange={setDeleteLeadDialogOpen}
          lead={selectedLead}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
    </TooltipProvider>
  );
};

export default LeadsModern;
