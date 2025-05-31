
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, UserCheck, UserX, Search, Filter, FileText, Camera, Video, ShoppingCart, StickyNote, Heart, Star, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";

const Pacientes = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data com pacientes convertidos de leads incluindo estados
  const mockPatients = [
    {
      id: 1,
      nome: "Maria Silva",
      telefone: "(11) 99123-4567",
      email: "maria@email.com",
      objetivo: "Perda de Peso",
      status: "Em acompanhamento",
      foto: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop&crop=face",
      cidade: "São Paulo",
      estado: "SP",
      dataConversao: "15/11/2024",
      ultimaConsulta: "28/11/2024",
      proximaConsulta: "05/12/2024",
      peso: "68kg",
      altura: "1.65m",
      imc: "25.0",
      planoAlimentar: "Dieta de 1500 calorias com foco em proteínas magras, vegetais e carboidratos complexos. Inclui 5 refeições diárias com intervalos de 3 horas.",
      anotacoes: "Paciente muito dedicada, seguindo bem as orientações. Demonstra boa evolução na perda de peso e melhora nos hábitos alimentares.",
      progresso: 85
    },
    {
      id: 2,
      nome: "João Santos",
      telefone: "(21) 98765-4321",
      email: "joao@email.com",
      objetivo: "Ganho de Massa",
      status: "Em acompanhamento",
      foto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=face",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      dataConversao: "10/11/2024",
      ultimaConsulta: "25/11/2024",
      proximaConsulta: "02/12/2024",
      peso: "75kg",
      altura: "1.78m",
      imc: "23.7",
      planoAlimentar: "Dieta hipercalórica com 2800 calorias, rica em proteínas e carboidratos. Suplementação com whey protein e creatina.",
      anotacoes: "Paciente ativo, pratica musculação 5x por semana. Boa aderência ao plano alimentar e evolução no ganho de massa magra.",
      progresso: 92
    },
    {
      id: 3,
      nome: "Ana Costa",
      telefone: "(31) 97654-3210",
      email: "ana@email.com",
      objetivo: "Manutenção",
      status: "Consulta agendada",
      foto: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop&crop=face",
      cidade: "Belo Horizonte",
      estado: "MG",
      dataConversao: "20/11/2024",
      ultimaConsulta: "22/11/2024",
      proximaConsulta: "10/12/2024",
      peso: "62kg",
      altura: "1.68m",
      imc: "22.0",
      planoAlimentar: "Plano equilibrado para manutenção do peso atual com foco em alimentação saudável e variada.",
      anotacoes: "Paciente com bons hábitos alimentares, busca orientação para manter o peso ideal e melhorar a qualidade nutricional.",
      progresso: 78
    },
    {
      id: 4,
      nome: "Carlos Oliveira",
      telefone: "(85) 99888-7777",
      email: "carlos@email.com",
      objetivo: "Perda de Peso",
      status: "Em acompanhamento",
      foto: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop&crop=face",
      cidade: "Fortaleza",
      estado: "CE",
      dataConversao: "05/11/2024",
      ultimaConsulta: "30/11/2024",
      proximaConsulta: "07/12/2024",
      peso: "88kg",
      altura: "1.75m",
      imc: "28.7",
      planoAlimentar: "Protocolo de emagrecimento com restrição calórica moderada, aumento de fibras e redução de açúcares.",
      anotacoes: "Paciente motivado, já perdeu 5kg desde o início do acompanhamento. Pratica caminhada regularmente.",
      progresso: 73
    },
    {
      id: 5,
      nome: "Fernanda Lima",
      telefone: "(47) 98777-6666",
      email: "fernanda@email.com",
      objetivo: "Ganho de Massa",
      status: "Sem interação",
      foto: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=200&h=200&fit=crop&crop=face",
      cidade: "Florianópolis",
      estado: "SC",
      dataConversao: "01/11/2024",
      ultimaConsulta: "03/11/2024",
      proximaConsulta: "Não agendada",
      peso: "55kg",
      altura: "1.62m",
      imc: "21.0",
      planoAlimentar: "Plano para ganho de peso saudável com aumento gradual de calorias e proteínas.",
      anotacoes: "Paciente com dificuldades para aderir ao plano. Última consulta há mais de 3 semanas.",
      progresso: 45
    },
    {
      id: 6,
      nome: "Roberto Mendes",
      telefone: "(41) 97555-4444",
      email: "roberto@email.com",
      objetivo: "Perda de Peso",
      status: "Em acompanhamento",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      cidade: "Curitiba",
      estado: "PR",
      dataConversao: "12/11/2024",
      ultimaConsulta: "29/11/2024",
      proximaConsulta: "06/12/2024",
      peso: "92kg",
      altura: "1.80m",
      imc: "28.4",
      planoAlimentar: "Protocolo low carb com foco em proteínas e vegetais. Redução gradual de carboidratos refinados.",
      anotacoes: "Paciente executivo, com rotina corrida. Adaptando plano para facilitar a aderência.",
      progresso: 67
    },
    {
      id: 7,
      nome: "Juliana Reis",
      telefone: "(51) 96333-2222",
      email: "juliana@email.com",
      objetivo: "Manutenção",
      status: "Consulta agendada",
      foto: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=200&h=200&fit=crop&crop=face",
      cidade: "Porto Alegre",
      estado: "RS",
      dataConversao: "18/11/2024",
      ultimaConsulta: "26/11/2024",
      proximaConsulta: "12/12/2024",
      peso: "58kg",
      altura: "1.63m",
      imc: "21.8",
      planoAlimentar: "Dieta equilibrada para manutenção com foco em antioxidantes e alimentos anti-inflamatórios.",
      anotacoes: "Paciente atleta recreativa, busca otimização da performance e recuperação muscular.",
      progresso: 88
    },
    {
      id: 8,
      nome: "Diego Ferreira",
      telefone: "(62) 95222-1111",
      email: "diego@email.com",
      objetivo: "Ganho de Massa",
      status: "Em acompanhamento",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      cidade: "Goiânia",
      estado: "GO",
      dataConversao: "08/11/2024",
      ultimaConsulta: "27/11/2024",
      proximaConsulta: "04/12/2024",
      peso: "70kg",
      altura: "1.76m",
      imc: "22.6",
      planoAlimentar: "Dieta hipercalórica estruturada com 6 refeições diárias. Suplementação específica para ganho de massa.",
      anotacoes: "Paciente jovem, muito motivado. Excelente resposta ao protocolo de ganho de massa.",
      progresso: 91
    }
  ];

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

  const filteredPatients = mockPatients.filter(patient =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telefone.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      <Header title="Pacientes" description="Gerencie seus pacientes convertidos de leads" />

      {/* Estatísticas Modernizadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-100">Total de Pacientes</CardTitle>
            <Users className="h-5 w-5 text-violet-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{mockPatients.length}</div>
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
              {mockPatients.filter(p => p.status === "Em acompanhamento").length}
            </div>
            <p className="text-xs text-emerald-200">Pacientes ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-red-600 border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">Sem Interação</CardTitle>
            <UserX className="h-5 w-5 text-rose-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {mockPatients.filter(p => p.status === "Sem interação").length}
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
                <Input 
                  placeholder="Buscar pacientes..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-200" 
                />
              </div>
              <Button variant="secondary" size="icon" className="bg-white/20 hover:bg-white/30 border-white/30">
                <Filter className="w-4 h-4 text-white" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 max-h-[600px] overflow-y-auto">
            {filteredPatients.map(patient => (
              <Card 
                key={patient.id} 
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] border-2 ${
                  selectedPatient?.id === patient.id 
                    ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300'
                }`} 
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                      <AvatarImage src={patient.foto} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                        {patient.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getProgressColor(patient.progresso)} border-2 border-white`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{patient.nome}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {patient.telefone}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={`text-xs ${getObjetivoColor(patient.objetivo)}`}>
                        {patient.objetivo}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Perfil do Paciente Modernizado */}
        <Card className="lg:col-span-2 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-t-lg">
            <CardTitle className="text-white flex items-center gap-3">
              {selectedPatient ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPatient.foto} />
                    <AvatarFallback>{selectedPatient.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  Perfil de {selectedPatient.nome}
                </>
              ) : (
                'Selecione um paciente'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedPatient ? (
              <Tabs defaultValue="geral" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                  <TabsTrigger value="geral" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Geral</TabsTrigger>
                  <TabsTrigger value="plano" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Plano Alimentar</TabsTrigger>
                  <TabsTrigger value="fotos" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Fotos</TabsTrigger>
                  <TabsTrigger value="compras" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Lista de Compras</TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="space-y-6 mt-6">
                  {/* Informações do Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                        <AvatarImage src={selectedPatient.foto} />
                        <AvatarFallback className="text-2xl bg-white text-indigo-600">
                          {selectedPatient.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">{selectedPatient.nome}</h2>
                        <div className="flex items-center gap-4 mt-2 text-indigo-100">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {selectedPatient.cidade}, {selectedPatient.estado}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Convertido em {selectedPatient.dataConversao}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{selectedPatient.progresso}%</div>
                        <div className="text-indigo-200 text-sm">Progresso</div>
                      </div>
                    </div>
                    
                    {/* Barra de Progresso */}
                    <div className="mt-4">
                      <div className="bg-white/20 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getProgressColor(selectedPatient.progresso)} transition-all duration-500`}
                          style={{ width: `${selectedPatient.progresso}%` }}
                        ></div>
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
                          <span className="font-medium">Telefone:</span> {selectedPatient.telefone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Email:</span> {selectedPatient.email}
                        </div>
                        <div>
                          <span className="font-medium">Objetivo:</span>
                          <Badge className={`ml-2 ${getObjetivoColor(selectedPatient.objetivo)}`}>
                            {selectedPatient.objetivo}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <Badge className={`ml-2 ${getStatusColor(selectedPatient.status)}`}>
                            {selectedPatient.status}
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
                        <div><span className="font-medium">Peso:</span> {selectedPatient.peso}</div>
                        <div><span className="font-medium">Altura:</span> {selectedPatient.altura}</div>
                        <div><span className="font-medium">IMC:</span> {selectedPatient.imc}</div>
                        <div><span className="font-medium">Última Consulta:</span> {selectedPatient.ultimaConsulta}</div>
                        <div><span className="font-medium">Próxima Consulta:</span> {selectedPatient.proximaConsulta}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Anotações */}
                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-800 flex items-center gap-2">
                        <StickyNote className="w-5 h-5" />
                        Anotações do Profissional
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea 
                        placeholder="Adicione suas anotações sobre o paciente..." 
                        value={selectedPatient.anotacoes} 
                        className="min-h-32 border-2 focus:border-indigo-500" 
                      />
                      <Button className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
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
                      <Textarea 
                        value={selectedPatient.planoAlimentar} 
                        className="min-h-64 border-2 focus:border-indigo-500" 
                        placeholder="Digite o plano alimentar do paciente..." 
                      />
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
                          <AvatarImage src={selectedPatient.foto} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                            {selectedPatient.nome.split(' ').map(n => n[0]).join('')}
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
    </div>
  );
};

export default Pacientes;
