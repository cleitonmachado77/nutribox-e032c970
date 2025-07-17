
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, UserPlus, Calendar, TrendingUp, MessageCircle, UserCheck, CheckCircle, Stethoscope } from "lucide-react";
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

  // Gerar dados dos objetivos dos pacientes baseado nos dados reais (sem useMemo)
  const objetivosPacientesData = (() => {
    if (!pacientes || pacientes.length === 0) {
      return [];
    }
    
    const objetivosCount: { [key: string]: number } = {};
    
    pacientes.forEach(paciente => {
      const objetivo = paciente.lead?.objetivo || 'Não informado';
      objetivosCount[objetivo] = (objetivosCount[objetivo] || 0) + 1;
    });

    const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    return Object.entries(objetivosCount).map(([objetivo, count], index) => ({
      name: objetivo,
      value: count,
      color: cores[index % cores.length]
    }));
  })();

  return <div className="p-6 space-y-6 min-h-screen">
      <Header title="Dashboard" description="Visão geral do seu negócio" />
      
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-100">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-cyan-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <p className="text-xs text-cyan-200">
              {totalLeads === 0 ? "Nenhum lead cadastrado" : "Leads cadastrados"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-100">Pacientes</CardTitle>
            <Stethoscope className="h-4 w-4 text-teal-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPacientes}</div>
            <p className="text-xs text-teal-200">
              {totalPacientes === 0 
                ? "Nenhum paciente cadastrado" 
                : `${pacientesAtivos} ativos, ${pacientesInativos} inativos`
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Consultas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-amber-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{consultasAgendadas}</div>
            <p className="text-xs text-amber-200">
              {consultasAgendadas === 0 ? "Nenhuma consulta agendada" : "Próximas consultas"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-none text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">Consultas Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-rose-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{consultasRealizadas}</div>
            <p className="text-xs text-rose-200">
              {consultasRealizadas === 0 ? "Nenhuma consulta realizada" : "Consultas concluídas"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Taxas de Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-lime-500 to-lime-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-lime-100">Leads → Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaConversaoLeadPaciente}%</div>
            <p className="text-sm text-lime-200">Taxa de conversão</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-lg text-pink-100">Pacientes → Agendados</CardTitle>
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
            <CardTitle className="text-lg text-violet-100">Conversão Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaConversaoTotal}%</div>
            <p className="text-sm text-violet-200">Leads → Consultas realizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {monthlyData.length > 0 ? <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 'auto']} />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#3B82F6" name="Leads" />
                  <Bar dataKey="consultas" fill="#10B981" name="Consultas" />
                </BarChart> : <div className="flex items-center justify-center h-full text-gray-500">
                  Nenhum dado disponível
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Objetivos dos Pacientes baseado em dados reais */}
        <Card>
          <CardHeader>
            <CardTitle>Objetivos dos Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {objetivosPacientesData.length > 0 ? <PieChart>
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
                  <Tooltip />
                </PieChart> : <div className="flex items-center justify-center h-full text-gray-500">
                  {totalPacientes === 0 
                    ? "Cadastre pacientes para visualizar seus objetivos" 
                    : "Nenhum objetivo informado pelos pacientes"
                  }
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Pacientes por Estado */}
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
                  <XAxis type="number" domain={[0, 'auto']} />
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

        {/* Gráfico de Pizza - Distribuição de Status dos Pacientes */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {totalPacientes > 0 ? <PieChart>
                  <Pie 
                    data={[
                      { name: 'Ativos', value: pacientesAtivos, color: '#10B981' },
                      { name: 'Inativos', value: pacientesInativos, color: '#EF4444' }
                    ]} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    dataKey="value" 
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip />
                </PieChart> : <div className="flex items-center justify-center h-full text-gray-500">
                  Cadastre pacientes para visualizar o status
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>;
};

export default Dashboard;
