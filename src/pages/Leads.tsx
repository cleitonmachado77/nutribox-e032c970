
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Upload, Users, UserPlus, Calendar, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewLeadDialog } from "@/components/NewLeadDialog";
import { Header } from "@/components/Header";
import { useLeads } from "@/hooks/useLeads";
import { format } from "date-fns";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const { data: leads, isLoading, error } = useLeads();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-cyan-500";
      case "qualificado":
        return "bg-teal-500";
      case "consulta_agendada":
        return "bg-amber-500";
      case "em_acompanhamento":
        return "bg-green-500";
      case "perdido":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getObjetivoColor = (objetivo: string) => {
    switch (objetivo) {
      case "Perda de Peso":
        return "bg-rose-500";
      case "Ganho de Massa":
        return "bg-emerald-500";
      case "Manutenção":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
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
  const filteredLeads = leads?.filter(lead => 
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.telefone.includes(searchTerm) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
    <div className="p-6 space-y-6 bg-gray-900">
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
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar leads..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 w-64" 
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Tabela de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados: {filteredLeads.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {totalLeads === 0 
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
                  <TableHead>Últ. Consulta</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={lead.foto_perfil || undefined} 
                            alt={lead.nome}
                          />
                          <AvatarFallback>
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
                      {lead.objetivo ? (
                        <Badge variant="secondary" className={getObjetivoColor(lead.objetivo)}>
                          {lead.objetivo}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {formatStatusDisplay(lead.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${lead.progresso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{lead.progresso}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(lead.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {lead.ultima_consulta 
                        ? format(new Date(lead.ultima_consulta), 'dd/MM/yyyy') 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewLeadDialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog} />
    </div>
  );
};

export default Leads;
