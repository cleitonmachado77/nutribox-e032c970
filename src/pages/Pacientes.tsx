import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, UserCheck, UserX, Search, Filter, FileText, Camera, Video, ShoppingCart, StickyNote, Heart, Star, Phone, Mail, MapPin, Calendar, CheckCircle, History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { usePacientes } from "@/hooks/usePacientes";
import { ConsultaRealizadaDialog } from "@/components/ConsultaRealizadaDialog";
import { HistoricoConsultas } from "@/components/HistoricoConsultas";

const Pacientes = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [consultaDialogOpen, setConsultaDialogOpen] = useState(false);
  const { data: pacientes = [], isLoading, error } = usePacientes();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em acompanhamento":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
      case "Consulta agendada":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "Sem interação":
        return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };
  
  const getObjetivoColor = (objetivo: string) => {
    switch (objetivo) {
      case "Perda de Peso":
        return "bg-gradient-to-r from-pink-500 to-rose-500 text-white";
      case "Ganho de Massa":
        return "bg-gradient-to-r from-indigo-500 to-purple-500 text-white";
      case "Manutenção":
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-gradient-to-r from-emerald-400 to-green-500";
    if (progress >= 60) return "bg-gradient-to-r from-amber-400 to-yellow-500";
    return "bg-gradient-to-r from-rose-400 to-red-500";
  };
  
  const filteredPatients = pacientes.filter(paciente => 
    paciente.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    paciente.lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    paciente.lead.telefone.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Pacientes" description="Gerencie seus pacientes convertidos de leads" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Header title="Pacientes" description="Gerencie seus pacientes convertidos de leads" />
        <div className="text-center text-red-500">
          Erro ao carregar pacientes: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8 bg-gray-950 min-h-screen">
      <Header title="Pacientes" description="Gerencie seus pacientes convertidos de leads" />

      {/* Estatísticas Modernizadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-100">Total de Pacientes</CardTitle>
            <Users className="h-5 w-5 text-violet-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{pacientes.length}</div>
            <p className="text-xs text-violet-200">Convertidos de leads</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Em Acompanhamento</CardTitle>
            <UserCheck className="h-5 w-5 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {pacientes.filter(p => p.status_tratamento === "ativo").length}
            </div>
            <p className="text-xs text-emerald-200">Pacientes ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-red-600 border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">Inativos</CardTitle>
            <UserX className="h-5 w-5 text-rose-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {pacientes.filter(p => p.status_tratamento === "inativo").length}
            </div>
            <p className="text-xs text-rose-200">Necessitam atenção</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Pacientes Modernizada */}
        <Card className="lg:col-span-1 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-white">Lista de Pacientes</CardTitle>
            <div className="flex gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                <Input placeholder="Buscar pacientes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-200" />
              </div>
              <Button variant="secondary" size="icon" className="bg-white/20 hover:bg-white/30 border-white/30">
                <Filter className="w-4 h-4 text-white" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 max-h-[600px] overflow-y-auto">
            {filteredPatients.map(paciente => <Card key={paciente.id} className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] border-2 ${selectedPatient?.id === paciente.id ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`} onClick={() => setSelectedPatient(paciente)}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                      <AvatarImage src={paciente.lead.foto_perfil} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                        {paciente.lead.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getProgressColor(paciente.lead.progresso)} border-2 border-white`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{paciente.lead.nome}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {paciente.lead.telefone}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {paciente.lead.objetivo_tag && (
                        <Badge 
                          className="text-xs text-white"
                          style={{ backgroundColor: paciente.lead.objetivo_tag.cor }}
                        >
                          {paciente.lead.objetivo_tag.nome}
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getStatusColor(paciente.status_tratamento)}`}>
                        {paciente.status_tratamento === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>)}
          </CardContent>
        </Card>

        {/* Perfil do Paciente Modernizado */}
        <Card className="lg:col-span-2 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-t-lg">
            <CardTitle className="text-white flex items-center gap-3">
              {selectedPatient ? <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPatient.lead.foto_perfil} />
                    <AvatarFallback>{selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  Perfil de {selectedPatient.lead.nome}
                </> : 'Selecione um paciente'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedPatient ? (
              <Tabs defaultValue="geral" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100">
                  <TabsTrigger value="geral" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Geral</TabsTrigger>
                  <TabsTrigger value="plano" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Plano Alimentar</TabsTrigger>
                  <TabsTrigger value="fotos" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Fotos</TabsTrigger>
                  <TabsTrigger value="compras" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Lista de Compras</TabsTrigger>
                  <TabsTrigger value="historico" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="space-y-6 mt-6">
                  {/* Informações do Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                        <AvatarImage src={selectedPatient.lead.foto_perfil} />
                        <AvatarFallback className="text-2xl bg-white text-indigo-600">
                          {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">{selectedPatient.lead.nome}</h2>
                        <div className="flex items-center gap-4 mt-2 text-indigo-100">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {selectedPatient.lead.cidade}, {selectedPatient.lead.estado}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Convertido em {selectedPatient.dataConversao}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{selectedPatient.lead.progresso}%</div>
                        <div className="text-indigo-200 text-sm">Progresso</div>
                      </div>
                    </div>
                    
                    {/* Barra de Progresso */}
                    <div className="mt-4">
                      <div className="bg-white/20 rounded-full h-3">
                        <div className={`h-3 rounded-full ${getProgressColor(selectedPatient.lead.progresso)} transition-all duration-500`} style={{
                      width: `${selectedPatient.lead.progresso}%`
                    }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações Básicas */}
                    <Card className="border-2 border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-gray-800 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Informações Básicas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Telefone:</span> {selectedPatient.lead.telefone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Email:</span> {selectedPatient.lead.email}
                        </div>
                        <div>
                          <span className="font-medium">Objetivo:</span>
                          <Badge className={`ml-2 ${getObjetivoColor(selectedPatient.lead.objetivo)}`}>
                            {selectedPatient.lead.objetivo}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <Badge className={`ml-2 ${getStatusColor(selectedPatient.status_tratamento)}`}>
                            {selectedPatient.status_tratamento === 'ativo' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dados Corporais */}
                    <Card className="border-2 border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-gray-800 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Dados Corporais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div><span className="font-medium">Peso:</span> {selectedPatient.lead.peso}</div>
                        <div><span className="font-medium">Altura:</span> {selectedPatient.lead.altura}</div>
                        <div><span className="font-medium">IMC:</span> {selectedPatient.lead.imc}</div>
                        <div><span className="font-medium">Última Consulta:</span> {selectedPatient.lead.ultima_consulta}</div>
                        <div><span className="font-medium">Próxima Consulta:</span> {selectedPatient.lead.proxima_consulta}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Seção de Consultas */}
                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Consultas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setConsultaDialogOpen(true)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Registrar Consulta Realizada
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const tab = document.querySelector('[value="historico"]') as HTMLElement;
                            tab?.click();
                          }}
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <History className="w-4 h-4 mr-2" />
                          Ver Histórico
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Anotações */}
                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-800 flex items-center gap-2">
                        <StickyNote className="w-5 h-5" />
                        Anotações do Profissional
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea placeholder="Adicione suas anotações sobre o paciente..." value={selectedPatient.lead.anotacoes} className="min-h-32 border-2 focus:border-indigo-500" />
                      <Button className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <StickyNote className="w-4 h-4 mr-2" />
                        Salvar Anotações
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="plano" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Plano Alimentar Atual</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                        <FileText className="w-4 h-4 mr-2" />
                        Editar Plano
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                        <Camera className="w-4 h-4 mr-2" />
                        Adicionar Foto
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
                        <Video className="w-4 h-4 mr-2" />
                        Adicionar Vídeo
                      </Button>
                    </div>
                  </div>
                  <Card className="border-2 border-gray-200">
                    <CardContent className="p-6">
                      <Textarea value={selectedPatient.lead.plano_alimentar} className="min-h-64 border-2 focus:border-indigo-500" placeholder="Digite o plano alimentar do paciente..." />
                      <Button className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                        Salvar Plano
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fotos" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-2 border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-gray-800">Foto de Perfil</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-gray-200">
                          <AvatarImage src={selectedPatient.lead.foto_perfil} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                            {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Button size="sm" variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                          <Camera className="w-4 h-4 mr-2" />
                          Alterar Foto
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-2 border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-gray-800">Fotos do Corpo (Antes/Depois)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                          <Camera className="w-4 h-4 mr-2" />
                          Adicionar Fotos
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="compras" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Lista de Compras</h3>
                    <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Nova Lista
                    </Button>
                  </div>
                  <Card className="border-2 border-gray-200">
                    <CardContent className="p-12 text-center">
                      <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Nenhuma lista de compras criada ainda.</p>
                      <p className="text-gray-400 text-sm mt-2">Crie listas personalizadas baseadas no plano alimentar do paciente.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="historico" className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Histórico de Consultas</h3>
                    <Button 
                      onClick={() => setConsultaDialogOpen(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Nova Consulta
                    </Button>
                  </div>
                  <HistoricoConsultas pacienteId={selectedPatient.id} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecione um paciente</h3>
                <p className="text-gray-500">Escolha um paciente da lista para ver seus detalhes e acompanhar seu progresso</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para registrar consulta */}
      {selectedPatient && (
        <ConsultaRealizadaDialog
          open={consultaDialogOpen}
          onOpenChange={setConsultaDialogOpen}
          paciente={selectedPatient}
        />
      )}
    </div>
  );
};

export default Pacientes;
