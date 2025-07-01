
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, UserPlus, Eye, Edit, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { usePacientes, Paciente } from "@/hooks/usePacientes";

const PacientesSimple = () => {
  console.log('PacientesSimple component rendering...');
  
  const [searchTerm, setSearchTerm] = useState("");
  const { data: pacientesData, isLoading, error } = usePacientes();

  console.log('Query state:', { isLoading, error: error?.message, pacientesData });

  const pacientes = pacientesData || [];

  console.log('Pacientes data:', pacientesData);
  console.log('Total pacientes:', pacientes.length);

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

  const filteredPacientes = pacientes.filter(paciente => {
    const lead = paciente.lead;
    if (!lead) return false;
    
    return searchTerm === "" || 
      (lead.nome && lead.nome.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (lead.telefone && lead.telefone.includes(searchTerm)) || 
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  console.log('About to render, isLoading:', isLoading, 'error:', error);

  if (isLoading) {
    console.log('Rendering loading state...');
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
    console.log('Rendering error state:', error);
    return (
      <div className="p-6 space-y-6">
        <Header title="Pacientes" description="Gerencie seus pacientes" />
        <div className="text-center text-red-500">
          Erro ao carregar pacientes: {error.message}
        </div>
      </div>
    );
  }

  console.log('Rendering main content...');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Header title="Pacientes (Versão Simples)" description="Gerencie seus pacientes" />

      {/* Estatísticas Simples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pacientes.length}</div>
            <p className="text-xs text-indigo-200">
              {pacientes.length === 0 ? "Nenhum paciente cadastrado" : "Total de pacientes cadastrados"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Filtrados</CardTitle>
            <UserPlus className="h-4 w-4 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredPacientes.length}</div>
            <p className="text-xs text-emerald-200">
              Pacientes encontrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="flex gap-4 justify-between">
        <div className="flex gap-2">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Paciente
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar pacientes..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="pl-10 w-64" 
          />
        </div>
      </div>

      {/* Tabela de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados: {filteredPacientes.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPacientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {pacientes.length === 0 
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
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.map((paciente) => {
                  const lead = paciente.lead;
                  
                  if (!lead) {
                    console.warn('Paciente sem lead:', paciente);
                    return null;
                  }

                  return (
                    <TableRow key={paciente.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {lead.foto_perfil && (
                              <AvatarImage src={lead.foto_perfil} alt={lead.nome || 'Paciente'} className="object-cover" />
                            )}
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              {lead.nome ? lead.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{lead.nome || 'Nome não informado'}</div>
                            <div className="text-sm text-gray-500">{lead.telefone || 'Telefone não informado'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.estado || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status || 'inativo')}>
                          {formatStatusDisplay(lead.status || 'inativo')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
    </div>
  );
};

export default PacientesSimple;
