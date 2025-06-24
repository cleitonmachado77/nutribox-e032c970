
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  User, 
  Phone,
  Mail,
  Target,
  Scale,
  Activity,
  Heart,
  Brain,
  Utensils,
  Clock,
  AlertCircle,
  CheckCircle,
  Send,
  FileText,
  Settings,
  MoreVertical
} from "lucide-react";
import { usePacientes } from "@/hooks/usePacientes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const PatientProfiles = () => {
  const { data: pacientes = [], isLoading } = usePacientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Filtrar e processar pacientes
  const filteredPatients = useMemo(() => {
    return pacientes.filter(paciente => {
      const matchesSearch = paciente.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paciente.lead.telefone.includes(searchTerm);
      
      const matchesFilter = filterStatus === "all" || 
                           paciente.status_tratamento === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [pacientes, searchTerm, filterStatus]);

  // Estatísticas dos pacientes
  const stats = useMemo(() => {
    const total = pacientes.length;
    const active = pacientes.filter(p => p.status_tratamento === 'ativo').length;
    const inactive = pacientes.filter(p => p.status_tratamento === 'inativo').length;
    const avgProgress = pacientes.reduce((acc, p) => acc + (p.lead.progresso || 0), 0) / total || 0;
    
    return { total, active, inactive, avgProgress };
  }, [pacientes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'inativo': return 'bg-red-500';
      case 'pausado': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSendMessage = (patient: any) => {
    console.log('Enviando mensagem para:', patient.lead.nome);
    // Aqui integraria com o sistema de mensagens
  };

  const handleScheduleConsultation = (patient: any) => {
    console.log('Agendando consulta para:', patient.lead.nome);
    // Aqui integraria com o sistema de agendamento
  };

  const handleGenerateReport = (patient: any) => {
    console.log('Gerando relatório para:', patient.lead.nome);
    // Aqui integraria com o sistema de relatórios
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Inativos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgProgress.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Perfis dos Pacientes</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                  <SelectItem value="pausado">Pausados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pacientes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pacientes ({filteredPatients.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredPatients.map((paciente) => (
                <div
                  key={paciente.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedPatient?.id === paciente.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatient(paciente)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={paciente.lead.foto_perfil} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                        {paciente.lead.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{paciente.lead.nome}</p>
                      <p className="text-xs text-gray-500">{paciente.lead.telefone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(paciente.status_tratamento)} text-white`}>
                          {paciente.status_tratamento}
                        </Badge>
                        <span className={`text-xs font-medium ${getProgressColor(paciente.lead.progresso || 0)}`}>
                          {paciente.lead.progresso || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPatients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum paciente encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Paciente */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedPatient.lead.foto_perfil} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                        {selectedPatient.lead.nome.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPatient.lead.nome}</h2>
                      <p className="text-gray-600">{selectedPatient.lead.email}</p>
                      <Badge className={`${getStatusColor(selectedPatient.status_tratamento)} text-white mt-1`}>
                        {selectedPatient.status_tratamento}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendMessage(selectedPatient)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleScheduleConsultation(selectedPatient)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Consulta
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGenerateReport(selectedPatient)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar Relatório
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="progress">Progresso</TabsTrigger>
                    <TabsTrigger value="interactions">Interações</TabsTrigger>
                    <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{selectedPatient.lead.telefone}</span>
                            </div>
                            {selectedPatient.lead.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{selectedPatient.lead.email}</span>
                              </div>
                            )}
                            {selectedPatient.lead.objetivo && (
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{selectedPatient.lead.objetivo}</span>
                              </div>
                            )}
                            {selectedPatient.lead.cidade && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{selectedPatient.lead.cidade}, {selectedPatient.lead.estado}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            {selectedPatient.lead.peso && (
                              <div className="flex items-center gap-2">
                                <Scale className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">Peso: {selectedPatient.lead.peso}</span>
                              </div>
                            )}
                            {selectedPatient.lead.altura && (
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">Altura: {selectedPatient.lead.altura}</span>
                              </div>
                            )}
                            {selectedPatient.lead.imc && (
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">IMC: {selectedPatient.lead.imc}</span>
                              </div>
                            )}
                            {selectedPatient.data_primeira_consulta && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  Primeira consulta: {new Date(selectedPatient.data_primeira_consulta).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {selectedPatient.lead.anotacoes && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Anotações</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedPatient.lead.anotacoes}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="progress" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Progresso Geral
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progresso atual</span>
                              <span className={getProgressColor(selectedPatient.lead.progresso || 0)}>
                                {selectedPatient.lead.progresso || 0}%
                              </span>
                            </div>
                            <Progress 
                              value={selectedPatient.lead.progresso || 0} 
                              className="h-2"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <Utensils className="h-4 w-4" />
                                Alimentação
                              </h4>
                              <Progress value={75} className="h-2" />
                              <p className="text-xs text-gray-600">Aderência ao plano alimentar</p>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Exercícios
                              </h4>
                              <Progress value={60} className="h-2" />
                              <p className="text-xs text-gray-600">Cumprimento dos exercícios</p>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <Brain className="h-4 w-4" />
                                Bem-estar Mental
                              </h4>
                              <Progress value={80} className="h-2" />
                              <p className="text-xs text-gray-600">Níveis de motivação</p>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                Saúde Geral
                              </h4>
                              <Progress value={85} className="h-2" />
                              <p className="text-xs text-gray-600">Indicadores de saúde</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="interactions" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Histórico de Interações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>Nenhuma interação registrada ainda</p>
                            <Button 
                              className="mt-4" 
                              onClick={() => handleSendMessage(selectedPatient)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Iniciar Conversa
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recomendações do NutriCoach</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <h4 className="font-medium text-blue-800 mb-2">Sugestão Nutricional</h4>
                            <p className="text-sm text-blue-700">
                              Com base no progresso atual, considere ajustar a ingestão de proteínas para otimizar os resultados.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <h4 className="font-medium text-green-800 mb-2">Motivação</h4>
                            <p className="text-sm text-green-700">
                              O paciente tem mostrado boa aderência ao plano. Continue encorajando com feedback positivo.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                            <h4 className="font-medium text-yellow-800 mb-2">Atenção Necessária</h4>
                            <p className="text-sm text-yellow-700">
                              Considere agendar uma consulta de acompanhamento para revisar os objetivos.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Selecione um paciente para ver os detalhes</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
