import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, UserCheck, UserX, Search, Filter, FileText, Camera, Video, ShoppingCart, StickyNote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Pacientes = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const mockPatients = [{
    id: 1,
    nome: "Maria Silva",
    telefone: "(11) 99123-4567",
    email: "maria@email.com",
    objetivo: "Perda de Peso",
    status: "Em acompanhamento",
    foto: null,
    planoAlimentar: "Dieta de 1500 calorias com foco em proteínas...",
    anotacoes: "Paciente muito dedicada, seguindo bem as orientações..."
  }, {
    id: 2,
    nome: "João Santos",
    telefone: "(21) 98765-4321",
    email: "joao@email.com",
    objetivo: "Ganho de Massa",
    status: "Em acompanhamento",
    foto: null,
    planoAlimentar: "Dieta hipercalórica com 2800 calorias...",
    anotacoes: "Paciente ativo, pratica musculação 5x por semana..."
  }];
  return <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">Pacientes</h1>
          <p className="text-gray-400">Gerencie seus pacientes ativos</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-500">Em Acompanhamento</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Interação</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pacientes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar pacientes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockPatients.map(patient => <Card key={patient.id} className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedPatient?.id === patient.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedPatient(patient)}>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={patient.foto} />
                    <AvatarFallback>{patient.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{patient.nome}</p>
                    <p className="text-sm text-gray-600">{patient.telefone}</p>
                    <Badge variant="outline" className="mt-1">
                      {patient.objetivo}
                    </Badge>
                  </div>
                </div>
              </Card>)}
          </CardContent>
        </Card>

        {/* Perfil do Paciente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedPatient ? `Perfil de ${selectedPatient.nome}` : 'Selecione um paciente'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPatient ? <Tabs defaultValue="geral" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="geral">Geral</TabsTrigger>
                  <TabsTrigger value="plano">Plano Alimentar</TabsTrigger>
                  <TabsTrigger value="fotos">Fotos</TabsTrigger>
                  <TabsTrigger value="compras">Lista de Compras</TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Informações Básicas</h3>
                      <p><strong>Nome:</strong> {selectedPatient.nome}</p>
                      <p><strong>Telefone:</strong> {selectedPatient.telefone}</p>
                      <p><strong>Email:</strong> {selectedPatient.email}</p>
                      <p><strong>Objetivo:</strong> {selectedPatient.objetivo}</p>
                      <p><strong>Status:</strong> 
                        <Badge className="ml-2" variant="outline">
                          {selectedPatient.status}
                        </Badge>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Anotações</h3>
                      <Textarea placeholder="Adicione suas anotações sobre o paciente..." value={selectedPatient.anotacoes} className="min-h-32" />
                      <Button className="mt-2" size="sm">
                        <StickyNote className="w-4 h-4 mr-2" />
                        Salvar Anotações
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="plano" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Plano Alimentar Atual</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Editar Plano
                      </Button>
                      <Button size="sm" variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Adicionar Foto
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-2" />
                        Adicionar Vídeo
                      </Button>
                    </div>
                  </div>
                  <Textarea value={selectedPatient.planoAlimentar} className="min-h-64" placeholder="Digite o plano alimentar do paciente..." />
                  <Button>Salvar Plano</Button>
                </TabsContent>

                <TabsContent value="fotos" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Foto de Perfil</h4>
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button className="mt-2" size="sm" variant="outline">
                        Alterar Foto
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Fotos do Corpo (Antes/Depois)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <Button className="mt-2" size="sm" variant="outline">
                        Adicionar Fotos
                      </Button>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="compras" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Lista de Compras</h3>
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Nova Lista
                    </Button>
                  </div>
                  <Card className="p-4">
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma lista de compras criada ainda.
                    </p>
                  </Card>
                </TabsContent>
              </Tabs> : <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecione um paciente para ver detalhes</p>
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Pacientes;