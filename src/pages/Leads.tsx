import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, Download, Users, UserPlus, Calendar, Eye, Tag, Trash, Edit, Archive, ArchiveRestore } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewLeadDialog } from "@/components/NewLeadDialog";
import { Header } from "@/components/Header";
import { useLeads } from "@/hooks/useLeads";
import { Lead } from "@/types/lead";
import { format } from "date-fns";
import { LeadsFilter, FilterCriteria } from "@/components/LeadsFilter";
import { ImportLeadsDialog } from "@/components/ImportLeadsDialog";
import { ExportLeadsButton } from "@/components/ExportLeadsButton";
import { EditLeadTagDialog } from "@/components/EditLeadTagDialog";
import { DeleteLeadDialog } from "@/components/DeleteLeadDialog";
import { EditLeadDialog } from "@/components/EditLeadDialog";
import { getLeadProgressByStatus, getStatusDisplayName, getProgressColor } from "@/hooks/useLeadProgress";
import { useArchiveLead } from "@/hooks/useArchiveLead";
import { useUpdateLead } from "@/hooks/useUpdateLead";
import { useCreatePaciente } from "@/hooks/usePacientes";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const [selectedLeadForTagEdit, setSelectedLeadForTagEdit] = useState<Lead | null>(null);
  const [selectedLeadForDelete, setSelectedLeadForDelete] = useState<Lead | null>(null);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<Lead | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({});
  
  const { data: leads, isLoading, error } = useLeads();
  const archiveLead = useArchiveLead();
  const updateLead = useUpdateLead();
  const createPaciente = useCreatePaciente();
  const { data: userSettings } = useUserSettings();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-cyan-500";
      case "qualificado":
        return "bg-teal-500";
      case "consulta_agendada":
        return "bg-amber-500";
      case "consulta_realizada":
        return "bg-orange-500";
      case "em_acompanhamento":
        return "bg-green-500";
      case "perdido":
        return "bg-red-500";
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
    return "#6B7280"; // gray color for no tag
  };
  const formatStatusDisplay = (status: string) => {
    switch (status) {
      case "novo":
        return "Novo";
      case "qualificado":
        return "Qualificado";
      case "consulta_agendada":
        return "Consulta Agendada";
      case "em_acompanhamento":
        return "Em Acompanhamento";
      case "perdido":
        return "Perdido";
      default:
        return status;
    }
  };

  // Filtrar leads baseado no termo de busca
  const applyFilters = (leads: Lead[], filters: FilterCriteria, searchTerm: string) => {
    return leads.filter(lead => {
      // Filtro de busca por texto
      const matchesSearch = searchTerm === "" || lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || lead.telefone.includes(searchTerm) || lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || lead.cidade?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtros específicos
      const matchesStatus = !filters.status || lead.status === filters.status;
      const matchesEstado = !filters.estado || lead.estado?.toLowerCase().includes(filters.estado.toLowerCase());
      const matchesTag = !filters.objetivo_tag_id || lead.objetivo_tag_id === filters.objetivo_tag_id;
      const matchesProgressoMin = filters.progresso_min === undefined || lead.progresso >= filters.progresso_min;
      const matchesProgressoMax = filters.progresso_max === undefined || lead.progresso <= filters.progresso_max;
      let matchesDataRange = true;
      if (filters.data_inicio || filters.data_fim) {
        const leadDate = new Date(lead.created_at);
        if (filters.data_inicio) {
          matchesDataRange = matchesDataRange && leadDate >= new Date(filters.data_inicio);
        }
        if (filters.data_fim) {
          matchesDataRange = matchesDataRange && leadDate <= new Date(filters.data_fim + 'T23:59:59');
        }
      }
      return matchesSearch && matchesStatus && matchesEstado && matchesTag && matchesProgressoMin && matchesProgressoMax && matchesDataRange;
    });
  };
  const filteredLeads = leads ? applyFilters(leads, activeFilters, searchTerm) : [];
  const handleFilter = (filters: FilterCriteria) => {
    setActiveFilters(filters);
  };
  const handleClearFilters = () => {
    setActiveFilters({});
  };

  // Calcular estatísticas baseadas nos dados reais
  const totalLeads = leads?.length || 0;
  const leadsHoje = leads?.filter(lead => {
    const hoje = new Date();
    const dataConversao = new Date(lead.data_conversao || lead.created_at);
    return dataConversao.toDateString() === hoje.toDateString();
  }).length || 0;
  const leadsOntem = leads?.filter(lead => {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataConversao = new Date(lead.data_conversao || lead.created_at);
    return dataConversao.toDateString() === ontem.toDateString();
  }).length || 0;
  const leadsUltimos7Dias = leads?.filter(lead => {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const dataConversao = new Date(lead.data_conversao || lead.created_at);
    return dataConversao >= seteDiasAtras;
  }).length || 0;

  const handleScheduleConsultation = async (lead: Lead) => {
    if (!userSettings?.google_calendar_link) {
      toast({
        title: "Link do Google Calendar não configurado",
        description: "Configure o link do Google Calendar nas configurações antes de agendar consultas.",
        variant: "destructive",
      });
      return;
    }

    // Criar evento no Google Calendar com data/hora padrão (hoje + 1 dia às 14:00)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    
    const eventTitle = encodeURIComponent(`Consulta - ${lead.nome}`);
    const eventDetails = encodeURIComponent(`Consulta agendada para ${lead.nome}\nTelefone: ${lead.telefone}\nEmail: ${lead.email || 'Não informado'}`);
    
    const startTime = tomorrow.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(tomorrow.getTime() + 60 * 60 * 1000); // 1 hora depois
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDetails}`;

    // Abrir Google Calendar
    window.open(calendarUrl, '_blank');

    try {
      // Atualizar o lead para "consulta_agendada" e definir próxima consulta
      await updateLead.mutateAsync({
        id: lead.id,
        leadData: { 
          status: 'consulta_agendada',
          proxima_consulta: tomorrow.toISOString()
        }
      });

      // Criar paciente
      await createPaciente.mutateAsync(lead.id);

      toast({
        title: "Consulta agendada!",
        description: `${lead.nome} foi movido para "Consulta Agendada" e convertido em paciente.`,
      });
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Erro ao agendar consulta",
        description: "Não foi possível atualizar o status do lead. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveLead = async (lead: Lead) => {
    const isArchived = lead.status === 'arquivado';
    try {
      await archiveLead.mutateAsync({
        leadId: lead.id,
        archived: !isArchived
      });
      toast({
        title: "Sucesso!",
        description: `Lead ${isArchived ? 'desarquivado' : 'arquivado'} com sucesso.`
      });
    } catch (error) {
      console.error('Error archiving lead:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${isArchived ? 'desarquivar' : 'arquivar'} lead. Tente novamente.`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Leads" description="Gerencie seus potenciais clientes" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Leads" description="Gerencie seus potenciais clientes" />
        <div className="text-center text-red-500">
          Erro ao carregar leads: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-indigo-950">
      <Header title="Leads" description="Gerencie seus potenciais clientes" />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <p className="text-xs text-indigo-200">
              {totalLeads === 0 ? "Nenhum lead cadastrado" : "Total de leads cadastrados"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Hoje</CardTitle>
            <UserPlus className="h-4 w-4 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{leadsHoje}</div>
            <p className="text-xs text-emerald-200">
              {leadsHoje === 0 ? "Nenhum lead hoje" : `${leadsHoje} lead${leadsHoje > 1 ? 's' : ''} hoje`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Ontem</CardTitle>
            <Calendar className="h-4 w-4 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{leadsOntem}</div>
            <p className="text-xs text-orange-200">
              {leadsOntem === 0 ? "Nenhum lead ontem" : `${leadsOntem} lead${leadsOntem > 1 ? 's' : ''} ontem`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Últimos 7 dias</CardTitle>
            <Calendar className="h-4 w-4 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{leadsUltimos7Dias}</div>
            <p className="text-xs text-purple-200">
              {leadsUltimos7Dias === 0 ? "Sem atividade recente" : `${leadsUltimos7Dias} lead${leadsUltimos7Dias > 1 ? 's' : ''} na semana`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setShowNewLeadDialog(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
          <ImportLeadsDialog>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
          </ImportLeadsDialog>
          <ExportLeadsButton leads={filteredLeads} />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
          </div>
          <LeadsFilter onFilter={handleFilter} onClearFilters={handleClearFilters} />
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {Object.keys(activeFilters).length > 0 && <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Filtros ativos:</span>
          {Object.entries(activeFilters).map(([key, value]) => value && <Badge key={key} variant="secondary" className="text-xs">
                {key}: {String(value)}
              </Badge>)}
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Limpar filtros
          </Button>
        </div>}

      {/* Tabela de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados: {filteredLeads.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {(leads?.length || 0) === 0 
                ? "Nenhum lead cadastrado. Clique em 'Novo Lead' para começar." 
                : "Nenhum lead encontrado com os filtros aplicados."
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
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
                {filteredLeads.map((lead) => {
                  const progressoAtual = getLeadProgressByStatus(lead.status);
                  const progressColor = getProgressColor(progressoAtual);
                  const isArchived = lead.status === 'arquivado';

                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {lead.foto_perfil && (
                              <AvatarImage src={lead.foto_perfil} alt={lead.nome} className="object-cover" />
                            )}
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              {lead.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{lead.nome}</div>
                            <div className="text-sm text-gray-500">{lead.telefone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.estado || '-'}</TableCell>
                      <TableCell>
                        {lead.objetivo_tag ? (
                          <Badge 
                            variant="secondary" 
                            className="text-white cursor-pointer"
                            style={{ backgroundColor: lead.objetivo_tag.cor }}
                            onClick={() => setSelectedLeadForTagEdit(lead)}
                          >
                            {lead.objetivo_tag.nome}
                          </Badge>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedLeadForTagEdit(lead)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Tag className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>
                          {getStatusDisplayName(lead.status)}
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
                        {format(new Date(lead.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {lead.proxima_consulta ? (
                          <span className="text-sm font-medium text-blue-600">
                            {format(new Date(lead.proxima_consulta), 'dd/MM/yyyy HH:mm')}
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
                            onClick={() => setSelectedLeadForEdit(lead)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {(lead.status === 'novo' || lead.status === 'qualificado') && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleScheduleConsultation(lead)}
                              className="text-green-600 hover:text-green-700"
                              disabled={updateLead.isPending || createPaciente.isPending}
                            >
                              <Calendar className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleArchiveLead(lead)}
                            className="text-yellow-600 hover:text-yellow-700"
                            disabled={archiveLead.isPending}
                          >
                            {isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedLeadForDelete(lead)}
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

      <NewLeadDialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog} />
      
      <EditLeadTagDialog 
        open={!!selectedLeadForTagEdit} 
        onOpenChange={(open) => !open && setSelectedLeadForTagEdit(null)} 
        lead={selectedLeadForTagEdit} 
      />

      <DeleteLeadDialog 
        open={!!selectedLeadForDelete} 
        onOpenChange={(open) => !open && setSelectedLeadForDelete(null)} 
        lead={selectedLeadForDelete} 
      />

      <EditLeadDialog 
        open={!!selectedLeadForEdit} 
        onOpenChange={(open) => !open && setSelectedLeadForEdit(null)} 
        lead={selectedLeadForEdit} 
      />
    </div>
  );
};

export default Leads;
