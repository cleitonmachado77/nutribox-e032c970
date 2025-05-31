
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, UserPlus, Calendar, TrendingUp, MessageCircle, UserCheck, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";

const Dashboard = () => {
  // Mock data dos pacientes para calcular estatísticas dinâmicas
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

  // Calcula os dados dos estados dinamicamente baseado nos pacientes
  const getEstadosData = () => {
    const estadosCount = mockPatients.reduce((acc, patient) => {
      acc[patient.estado] = (acc[patient.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(estadosCount)
      .map(([estado, pacientes]) => ({ estado, pacientes }))
      .sort((a, b) => b.pacientes - a.pacientes);
  };

  const estadosData = getEstadosData();

  // Mock data for charts
  const monthlyData = [{
    month: 'Jan',
    leads: 45,
    consultas: 28
  }, {
    month: 'Fev',
    leads: 52,
    consultas: 31
  }, {
    month: 'Mar',
    leads: 38,
    consultas: 22
  }, {
    month: 'Abr',
    leads: 61,
    consultas: 45
  }, {
    month: 'Mai',
    leads: 58,
    consultas: 41
  }, {
    month: 'Jun',
    leads: 67,
    consultas: 52
  }];
  
  const objetivosData = [{
    name: 'Perda de Peso',
    value: 45,
    color: '#FF6B6B' // Coral vibrante para perda de peso
  }, {
    name: 'Ganho de Massa',
    value: 30,
    color: '#4ECDC4' // Turquesa para ganho de massa
  }, {
    name: 'Manutenção',
    value: 15,
    color: '#45B7D1' // Azul céu para manutenção
  }, {
    name: 'Outros',
    value: 10,
    color: '#FFA07A' // Salmão claro para outros
  }];
  
  const motivosAbandonoData = [{
    name: 'Preço',
    value: 35,
    color: '#FF9F43' // Laranja vibrante para preço
  }, {
    name: 'Falta de Tempo',
    value: 25,
    color: '#6C5CE7' // Roxo suave para falta de tempo
  }, {
    name: 'Sem Interesse',
    value: 20,
    color: '#A29BFE' // Lavanda para sem interesse
  }, {
    name: 'Problemas Pessoais',
    value: 20,
    color: '#FD79A8' // Rosa vibrante para problemas pessoais
  }];

  return (
    <div className="p-6 space-y-6">
      <Header title="Dashboard" description="Visão geral do seu negócio" />
      
      {/* Métricas de Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-100">Total de Leads (Novo)</CardTitle>
            <Users className="h-4 w-4 text-cyan-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">248</div>
            <p className="text-xs text-cyan-200">+12% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-100">Leads Qualificados</CardTitle>
            <UserCheck className="h-4 w-4 text-teal-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">104</div>
            <p className="text-xs text-teal-200">+8% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Consultas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-amber-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">78</div>
            <p className="text-xs text-amber-200">+5% vs período anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">Consultas Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-rose-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">68</div>
            <p className="text-xs text-rose-200">+10% vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-lime-500 to-lime-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-lime-100">Leads → Qualificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">41.9%</div>
            <p className="text-sm text-lime-200">+3.2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-pink-100">Qualificados → Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">75.0%</div>
            <p className="text-sm text-pink-200">-1.2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-100">Agendados → Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">87.2%</div>
            <p className="text-sm text-emerald-200">+2.4% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-violet-100">Leads → Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">27.4%</div>
            <p className="text-sm text-violet-200">+1.8% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Leads vs Consultas */}
        <Card>
          <CardHeader>
            <CardTitle>Leads x Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#3B82F6" name="Leads" />
                <Bar dataKey="consultas" fill="#10B981" name="Consultas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Objetivos */}
        <Card>
          <CardHeader>
            <CardTitle>Objetivos dos Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={objetivosData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {objetivosData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras Horizontal - Estados com Dados Reais */}
        <Card>
          <CardHeader>
            <CardTitle>Pacientes por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadosData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis type="number" />
                <YAxis dataKey="estado" type="category" width={50} />
                <Tooltip />
                <Bar dataKey="pacientes" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Motivos de Abandono */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos de Perda de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={motivosAbandonoData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {motivosAbandonoData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
