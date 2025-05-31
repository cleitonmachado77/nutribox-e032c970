
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Upload, Users, UserPlus, Calendar, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewLeadDialog } from "@/components/NewLeadDialog";
const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);

  // Mock data
  const mockLeads = [{
    id: 1,
    nome: "Maria Silva",
    telefone: "(11) 99123-4567",
    email: "maria@email.com",
    objetivo: "Perda de Peso",
    cidade: "São Paulo",
    estado: "SP",
    status: "Novo",
    cadastro: "06/12/2024",
    ultimaResposta: "Hoje"
  }, {
    id: 2,
    nome: "João Santos",
    telefone: "(21) 98765-4321",
    email: "joao@email.com",
    objetivo: "Ganho de Massa",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    status: "Qualificado",
    cadastro: "05/12/2024",
    ultimaResposta: "Ontem"
  }, {
    id: 3,
    nome: "Ana Costa",
    telefone: "(31) 97654-3210",
    email: "ana@email.com",
    objetivo: "Manutenção",
    cidade: "Belo Horizonte",
    estado: "MG",
    status: "Consulta Agendada",
    cadastro: "04/12/2024",
    ultimaResposta: "10/12/2024, 15:00"
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "bg-blue-500";
      case "Qualificado":
        return "bg-purple-600";
      case "Consulta Agendada":
        return "bg-violet-600";
      case "Perdido":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return <div className="p-6 space-y-6 bg-purple-900">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">Leads</h1>
          <p className="text-gray-400">Gerencie seus potenciais clientes</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ontem</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos 7 dias</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
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
            <Input placeholder="Buscar leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
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
          <CardTitle>Resultados: {mockLeads.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Teste</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Últ. Resposta</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeads.map(lead => <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.nome}</TableCell>
                  <TableCell>{lead.estado}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lead.objetivo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Aproveitadora especial</Badge>
                  </TableCell>
                  <TableCell>{lead.cadastro}</TableCell>
                  <TableCell>{lead.ultimaResposta}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewLeadDialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog} />
    </div>;
};
export default Leads;
