import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, UserPlus, Calendar, TrendingUp, MessageCircle, UserCheck, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { useLeadsStats } from "@/hooks/useLeads";
const Dashboard = () => {
  const {
    data: stats,
    isLoading,
    error
  } = useLeadsStats();

  // Mock data para motivos de abandono (pode ser implementado depois)
  const motivosAbandonoData = [{
    name: 'Preço',
    value: 35,
    color: '#FF9F43'
  }, {
    name: 'Falta de Tempo',
    value: 25,
    color: '#6C5CE7'
  }, {
    name: 'Sem Interesse',
    value: 20,
    color: '#A29BFE'
  }, {
    name: 'Problemas Pessoais',
    value: 20,
    color: '#FD79A8'
  }];
  if (isLoading) {
    return <div className="p-6 space-y-6">
        <Header title="Dashboard" description="Visão geral do seu negócio" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>;
  }
  if (error) {
    return <div className="p-6 space-y-6">
        <Header title="Dashboard" description="Visão geral do seu negócio" />
        <div className="text-center text-red-500">
          Erro ao carregar dados: {error.message}
        </div>
      </div>;
  }
  const {
    totalLeads = 0,
    leadsQualificados = 0,
    consultasAgendadas = 0,
    consultasRealizadas = 0,
    estadosData = [],
    objetivosData = [],
    monthlyData = []
  } = stats || {};

  // Calcular taxas de conversão
  const taxaQualificacao = totalLeads > 0 ? (leadsQualificados / totalLeads * 100).toFixed(1) : '0.0';
  const taxaAgendamento = leadsQualificados > 0 ? (consultasAgendadas / leadsQualificados * 100).toFixed(1) : '0.0';
  const taxaRealizacao = consultasAgendadas > 0 ? (consultasRealizadas / consultasAgendadas * 100).toFixed(1) : '0.0';
  const taxaConversaoTotal = totalLeads > 0 ? (consultasRealizadas / totalLeads * 100).toFixed(1) : '0.0';
  return <div className="p-6 space-y-6 bg-gray-900">
      <Header title="Dashboard" description="Visão geral do seu negócio" />
      
      {/* Métricas de Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-100">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-cyan-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <p className="text-xs text-cyan-200">Total de leads cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-100">Leads Qualificados</CardTitle>
            <UserCheck className="h-4 w-4 text-teal-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{leadsQualificados}</div>
            <p className="text-xs text-teal-200">Leads em acompanhamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Consultas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-amber-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{consultasAgendadas}</div>
            <p className="text-xs text-amber-200">Próximas consultas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">Consultas Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-rose-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{consultasRealizadas}</div>
            <p className="text-xs text-rose-200">Últimas consultas</p>
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
            <div className="text-3xl font-bold text-white">{taxaQualificacao}%</div>
            <p className="text-sm text-lime-200">Taxa de qualificação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-pink-100">Qualificados → Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaAgendamento}%</div>
            <p className="text-sm text-pink-200">Taxa de agendamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-100">Agendados → Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaRealizacao}%</div>
            <p className="text-sm text-emerald-200">Taxa de realização</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-violet-100">Leads → Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaConversaoTotal}%</div>
            <p className="text-sm text-violet-200">Taxa de conversão total</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Leads vs Consultas */}
        <Card>
          <CardHeader>
            <CardTitle>Leads x Consultas (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {monthlyData.length > 0 ? <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#3B82F6" name="Leads" />
                  <Bar dataKey="consultas" fill="#10B981" name="Consultas" />
                </BarChart> : <div className="flex items-center justify-center h-full text-gray-500">
                  Nenhum dado disponível
                </div>}
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
              {objetivosData.length > 0 ? <PieChart>
                  <Pie data={objetivosData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {objetivosData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart> : <div className="flex items-center justify-center h-full text-gray-500">
                  Nenhum dado disponível
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras Horizontal - Estados */}
        <Card>
          <CardHeader>
            <CardTitle>Pacientes por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {estadosData.length > 0 ? <BarChart data={estadosData} layout="vertical" margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis type="number" />
                  <YAxis dataKey="estado" type="category" width={50} tick={{
                fontSize: 12
              }} />
                  <Tooltip formatter={value => [`${value} pacientes`, 'Quantidade']} labelFormatter={label => `Estado: ${label}`} />
                  <Bar dataKey="pacientes" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart> : <div className="flex items-center justify-center h-full text-gray-500">
                  Nenhum dado disponível
                </div>}
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
    </div>;
};
export default Dashboard;