
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Target, 
  Activity, 
  Heart,
  Scale,
  TrendingUp,
  Camera,
  MessageSquare,
  Bell,
  Settings
} from "lucide-react";
import { usePacientes } from "@/hooks/usePacientes";

const PainelPaciente = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { data: pacientes = [], isLoading, error } = usePacientes();

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.lead.telefone.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Header title="Painel do Paciente" description="Acompanhe o progresso dos seus pacientes" />
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
              <p className="text-gray-500 text-sm">Carregando painel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Header title="Painel do Paciente" description="Acompanhe o progresso dos seus pacientes" />
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Erro ao carregar dados: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Header title="Painel do Paciente" description="Acompanhe o progresso dos seus pacientes" />
        
        {!selectedPatient ? (
          <div className="space-y-6">
            {/* Barra de pesquisa */}
            <Card className="bg-white border-gray-200 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Selecionar Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar paciente por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-modern"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de pacientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPacientes.map((paciente) => (
                <Card 
                  key={paciente.id} 
                  className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedPatient(paciente)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{paciente.lead.nome}</h3>
                          <p className="text-sm text-gray-500">{paciente.lead.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={paciente.status_tratamento === 'ativo' ? 'default' : 'secondary'}
                        className={paciente.status_tratamento === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {paciente.status_tratamento}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Cadastrado em {new Date(paciente.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {paciente.lead.objetivo && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 mr-2" />
                          <span>{paciente.lead.objetivo}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPacientes.length === 0 && (
              <Card className="bg-white border-gray-200 shadow-soft">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    {searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header do paciente */}
            <Card className="bg-white border-gray-200 shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{selectedPatient.lead.nome}</h1>
                      <p className="text-gray-600">{selectedPatient.lead.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant={selectedPatient.status_tratamento === 'ativo' ? 'default' : 'secondary'}
                          className={selectedPatient.status_tratamento === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {selectedPatient.status_tratamento}
                        </Badge>
                        {selectedPatient.lead.objetivo && (
                          <Badge variant="outline" className="border-purple-200 text-purple-600">
                            {selectedPatient.lead.objetivo}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedPatient(null)}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    Voltar
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs do painel */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-100">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  <Activity className="w-4 h-4 mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Progresso
                </TabsTrigger>
                <TabsTrigger value="consultations" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Consultas
                </TabsTrigger>
                <TabsTrigger value="photos" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Fotos
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Mensagens
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white border-gray-200 shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Peso Atual</CardTitle>
                      <Scale className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">--</div>
                      <p className="text-xs text-gray-500">Não informado</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200 shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">IMC</CardTitle>
                      <Heart className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">--</div>
                      <p className="text-xs text-gray-500">Não calculado</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200 shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Consultas</CardTitle>
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <p className="text-xs text-gray-500">Total realizadas</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-gray-200 shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Progresso</CardTitle>
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{selectedPatient.lead.progresso || 0}%</div>
                      <p className="text-xs text-gray-500">Meta atual</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="progress">
                <Card className="bg-white border-gray-200 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Acompanhamento de Progresso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="consultations">
                <Card className="bg-white border-gray-200 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Histórico de Consultas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Nenhuma consulta registrada ainda.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <Card className="bg-white border-gray-200 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Fotos de Progresso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Nenhuma foto adicionada ainda.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card className="bg-white border-gray-200 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Mensagens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Nenhuma mensagem ainda.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-white border-gray-200 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Configurações do Paciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Configurações em desenvolvimento...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default PainelPaciente;
