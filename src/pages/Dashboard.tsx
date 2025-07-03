
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, UserPlus, Calendar, TrendingUp, Stethoscope, Activity } from "lucide-react";
import { Header } from "@/components/Header";
import { useLeadsStats } from "@/hooks/useLeadsStats";
import { usePacientes } from "@/hooks/usePacientes";

const Dashboard = () => {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useLeadsStats();

  const {
    data: pacientes = [],
    isLoading: pacientesLoading,
    error: pacientesError
  } = usePacientes();

  const isLoading = statsLoading || pacientesLoading;
  const error = statsError || pacientesError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header title="Dashboard" description="Visão geral do seu negócio" />
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
              <p className="text-gray-500 text-sm">Carregando dados...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header title="Dashboard" description="Visão geral do seu negócio" />
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Erro ao carregar dados: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalLeads = 0,
    consultasAgendadas = 0,
    consultasRealizadas = 0,
    estadosData = [],
    objetivosData = [],
    monthlyData = []
  } = stats || {};

  // Calcular estatísticas dos pacientes com dados reais
  const totalPacientes = pacientes.length;
  const pacientesAtivos = pacientes.filter(p => p.status_tratamento === "ativo").length;
  const pacientesInativos = pacientes.filter(p => p.status_tratamento === "inativo").length;

  // Calcular taxas de conversão com dados reais
  const taxaConversaoLeadPaciente = totalLeads > 0 ? ((totalPacientes / totalLeads) * 100).toFixed(1) : '0.0';
  const taxaAgendamento = totalPacientes > 0 ? ((consultasAgendadas / totalPacientes) * 100).toFixed(1) : '0.0';
  const taxaRealizacao = consultasAgendadas > 0 ? ((consultasRealizadas / consultasAgendadas) * 100).toFixed(1) : '0.0';
  const taxaConversaoTotal = totalLeads > 0 ? ((consultasRealizadas / totalLeads) * 100).toFixed(1) : '0.0';

  // Gerar dados dos objetivos dos pacientes baseado nos dados reais
  const objetivosPacientesData = (() => {
    if (!pacientes || pacientes.length === 0) {
      return [];
    }
    
    const objetivosCount: { [key: string]: number } = {};
    
    pacientes.forEach(paciente => {
      const objetivo = paciente.lead?.objetivo || 'Não informado';
      objetivosCount[objetivo] = (objetivosCount[objetivo] || 0) + 1;
    });

    // Usar apenas tons de roxo/cinza para o gráfico
    const cores = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#64748B', '#94A3B8'];
    
    return Object.entries(objetivosCount).map(([objetivo, count], index) => ({
      name: objetivo,
      value: count,
      color: cores[index % cores.length]
    }));
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Header title="Dashboard" description="Visão geral do seu negócio" />
        
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Leads</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalLeads}</div>
              <p className="text-xs text-gray-500 mt-1">
                {totalLeads === 0 ? "Nenhum lead cadastrado" : "Leads cadastrados"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pacientes</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Stethoscope className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalPacientes}</div>
              <p className="text-xs text-gray-500 mt-1">
                {totalPacientes === 0 
                  ? "Nenhum paciente cadastrado" 
                  : `${pacientesAtivos} ativos, ${pacientesInativos} inativos`
                }
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Consultas Agendadas</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{consultasAgendadas}</div>
              <p className="text-xs text-gray-500 mt-1">
                {consultasAgendadas === 0 ? "Nenhuma consulta agendada" : "Próximas consultas"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Consultas Realizadas</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{consultasRealizadas}</div>
              <p className="text-xs text-gray-500 mt-1">
                {consultasRealizadas === 0 ? "Nenhuma consulta realizada" : "Consultas concluídas"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Taxas de Conversão */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Leads → Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{taxaConversaoLeadPaciente}%</div>
              <p className="text-sm text-gray-500">Taxa de conversão</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Pacientes → Agendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{taxaAgendamento}%</div>
              <p className="text-sm text-gray-500">Taxa de agendamento</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Agendados → Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{taxaRealizacao}%</div>
              <p className="text-sm text-gray-500">Taxa de realização</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-soft hover:shadow-medium transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Conversão Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{taxaConversaoTotal}%</div>
              <p className="text-sm text-gray-500">Leads → Consultas realizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Evolução Mensal */}
          <Card className="bg-white border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Evolução Mensal</CardTitle>
              <p className="text-sm text-gray-500">Últimos 6 meses</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {monthlyData.length > 0 ? (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Bar dataKey="leads" fill="#8B5CF6" name="Leads" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="consultas" fill="#A78BFA" name="Consultas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Nenhum dado disponível
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Objetivos dos Pacientes */}
          <Card className="bg-white border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Objetivos dos Pacientes</CardTitle>
              <p className="text-sm text-gray-500">Distribuição por objetivo</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {objetivosPacientesData.length > 0 ? (
                  <PieChart>
                    <Pie 
                      data={objetivosPacientesData} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      dataKey="value" 
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {objetivosPacientesData.map((entry, index) => 
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      )}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    {totalPacientes === 0 
                      ? "Cadastre pacientes para visualizar seus objetivos" 
                      : "Nenhum objetivo informado pelos pacientes"
                    }
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Pacientes por Estado */}
          <Card className="bg-white border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Pacientes por Estado</CardTitle>
              <p className="text-sm text-gray-500">Distribuição geográfica</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {estadosData.length > 0 ? (
                  <BarChart data={estadosData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis dataKey="estado" type="category" width={50} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip 
                      formatter={value => [`${value} pacientes`, 'Quantidade']} 
                      labelFormatter={label => `Estado: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Bar dataKey="pacientes" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Nenhum dado disponível
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Status dos Pacientes */}
          <Card className="bg-white border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Status dos Pacientes</CardTitle>
              <p className="text-sm text-gray-500">Ativos vs Inativos</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {totalPacientes > 0 ? (
                  <PieChart>
                    <Pie 
                      data={[
                        { name: 'Ativos', value: pacientesAtivos, color: '#8B5CF6' },
                        { name: 'Inativos', value: pacientesInativos, color: '#94A3B8' }
                      ]} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      dataKey="value" 
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#8B5CF6" />
                      <Cell fill="#94A3B8" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Cadastre pacientes para visualizar o status
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
