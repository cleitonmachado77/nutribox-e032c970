import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Download, Upload, Users, UserPlus, Calendar, Phone, Mail, MapPin, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/Header";
import { EditPatientDialog } from "@/components/EditPatientDialog";

interface Patient {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  objetivo: string;
  cidade: string;
  estado: string;
  status: string;
  cadastro: string;
  ultimaConsulta: string;
  observacoes: string;
  peso: string;
  altura: string;
}

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      nome: "Maria Silva",
      telefone: "(11) 99123-4567",
      email: "maria@email.com",
      objetivo: "Perda de Peso",
      cidade: "São Paulo",
      estado: "SP",
      status: "Ativo",
      cadastro: "06/12/2024",
      ultimaConsulta: "15/12/2024",
      observacoes: "Paciente motivada, seguindo o plano alimentar corretamente.",
      peso: "68.5",
      altura: "165"
    },
    {
      id: 2,
      nome: "João Santos",
      telefone: "(21) 98765-4321",
      email: "joao@email.com",
      objetivo: "Ganho de Massa",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      status: "Ativo",
      cadastro: "05/12/2024",
      ultimaConsulta: "14/12/2024",
      observacoes: "Atleta amador, necessita acompanhamento nutricional para hipertrofia.",
      peso: "75.2",
      altura: "178"
    },
    {
      id: 3,
      nome: "Ana Costa",
      telefone: "(31) 97654-3210",
      email: "ana@email.com",
      objetivo: "Manutenção",
      cidade: "Belo Horizonte",
      estado: "MG",
      status: "Inativo",
      cadastro: "04/12/2024",
      ultimaConsulta: "10/12/2024",
      observacoes: "Paciente com dificuldades para seguir o plano, necessita mais acompanhamento.",
      peso: "62.0",
      altura: "160"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-500";
      case "Inativo":
        return "bg-red-500";
      case "Aguardando Consulta":
        return "bg-yellow-500";
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

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditDialog(true);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients(prev => 
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
    console.log("Paciente atualizado:", updatedPatient);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900">
      <Header title="Pacientes" description="Gerencie seus pacientes" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{patients.length}</div>
            <p className="text-xs text-indigo-200">+12% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Ativos</CardTitle>
            <UserPlus className="h-4 w-4 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{patients.filter(p => p.status === 'Ativo').length}</div>
            <p className="text-xs text-emerald-200">Pacientes em acompanhamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Inativos</CardTitle>
            <Calendar className="h-4 w-4 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{patients.filter(p => p.status === 'Inativo').length}</div>
            <p className="text-xs text-orange-200">Sem acompanhamento atual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-purple-200">Nenhuma consulta agendada</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
          <TabsTrigger value="lista" className="data-[state=active]:bg-purple-600">Lista de Pacientes</TabsTrigger>
          <TabsTrigger value="perfil" className="data-[state=active]:bg-purple-600">Perfil do Paciente</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resultados: {patients.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-300">UF</TableHead>
                    <TableHead className="text-gray-300">Objetivo</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Cadastro</TableHead>
                    <TableHead className="text-gray-300">Últ. Consulta</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="border-gray-700 hover:bg-gray-700">
                      <TableCell className="font-medium text-white">{patient.nome}</TableCell>
                      <TableCell className="text-gray-300">{patient.estado}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getObjetivoColor(patient.objetivo)}>
                          {patient.objetivo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{patient.cadastro}</TableCell>
                      <TableCell className="text-gray-300">{patient.ultimaConsulta}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                            className="text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            Ver Perfil
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPatient(patient)}
                            className="text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfil" className="space-y-6">
          {selectedPatient ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-purple-600 text-white text-lg">
                        {selectedPatient.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white">{selectedPatient.nome}</CardTitle>
                      <p className="text-gray-400">ID: {selectedPatient.id.toString().padStart(4, '0')}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleEditPatient(selectedPatient)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{selectedPatient.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{selectedPatient.cidade}, {selectedPatient.estado}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedPatient.status)}>
                      {selectedPatient.status}
                    </Badge>
                    <Badge variant="secondary" className={getObjetivoColor(selectedPatient.objetivo)}>
                      {selectedPatient.objetivo}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Informações Médicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Peso</p>
                      <p className="text-white font-medium">{selectedPatient.peso} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Altura</p>
                      <p className="text-white font-medium">{selectedPatient.altura} cm</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">IMC</p>
                    <p className="text-white font-medium">
                      {(parseFloat(selectedPatient.peso) / Math.pow(parseFloat(selectedPatient.altura) / 100, 2)).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Cadastro</p>
                    <p className="text-white">{selectedPatient.cadastro}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Última Consulta</p>
                    <p className="text-white">{selectedPatient.ultimaConsulta}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{selectedPatient.observacoes}</p>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Histórico de Consultas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Nenhuma consulta registrada ainda.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-gray-400">Selecione um paciente para ver o perfil</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedPatient && (
        <EditPatientDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          patient={selectedPatient}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
};

export default Pacientes;
