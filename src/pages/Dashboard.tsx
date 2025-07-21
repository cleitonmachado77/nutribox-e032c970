
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#2a174d] via-[#3a206b] to-[#1a102b]">
      <Header title="Dashboard" description="Visão geral do seu negócio" />
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-200">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-violet-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <p className="text-xs text-violet-300">
              {totalLeads === 0 ? "Nenhum lead cadastrado" : "Leads cadastrados"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-200">Pacientes</CardTitle>
            <Stethoscope className="h-4 w-4 text-violet-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPacientes}</div>
            <p className="text-xs text-violet-300">
              {totalPacientes === 0 
                ? "Nenhum paciente cadastrado" 
                : `${pacientesAtivos} ativos, ${pacientesInativos} inativos`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-200">Consultas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-violet-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{consultasAgendadas}</div>
            <p className="text-xs text-violet-300">
              {consultasAgendadas === 0 ? "Nenhuma consulta agendada" : "Próximas consultas"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-200">Consultas Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-violet-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{consultasRealizadas}</div>
            <p className="text-xs text-violet-300">
              {consultasRealizadas === 0 ? "Nenhuma consulta realizada" : "Consultas concluídas"}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Taxas de Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card className="bg-gradient-to-br from-violet-700 to-fuchsia-700 border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-fuchsia-100">Leads → Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaConversaoLeadPaciente}%</div>
            <p className="text-sm text-fuchsia-200">Taxa de conversão</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-700 to-fuchsia-700 border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-fuchsia-100">Pacientes → Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaAgendamento}%</div>
            <p className="text-sm text-fuchsia-200">Taxa de agendamento</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-700 to-fuchsia-700 border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-fuchsia-100">Agendados → Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaRealizacao}%</div>
            <p className="text-sm text-fuchsia-200">Taxa de realização</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-700 to-fuchsia-700 border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-fuchsia-100">Conversão Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{taxaConversaoTotal}%</div>
            <p className="text-sm text-fuchsia-200">Leads → Consultas realizadas</p>
          </CardContent>
        </Card>
      </div>
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Gráfico de Barras - Evolução Mensal */}
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-200">Evolução Mensal (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {monthlyData.length > 0 ? <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6D28D9" />
                  <XAxis dataKey="month" stroke="#A78BFA" />
                  <YAxis domain={[0, 'auto']} stroke="#A78BFA" />
                  <Tooltip contentStyle={{ background: '#2a174d', color: '#fff', border: 'none' }} />
                  <Bar dataKey="leads" fill="#A78BFA" name="Leads" />
                  <Bar dataKey="consultas" fill="#F472B6" name="Consultas" />
                </BarChart> : <div className="flex items-center justify-center h-full text-violet-300">
                  Nenhum dado disponível
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Gráfico de Pizza - Objetivos dos Pacientes */}
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-200">Objetivos dos Pacientes</CardTitle>
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
                  <Tooltip contentStyle={{ background: '#2a174d', color: '#fff', border: 'none' }} />
                </PieChart> : <div className="flex items-center justify-center h-full text-violet-300">
                  {totalPacientes === 0 
                    ? "Cadastre pacientes para visualizar seus objetivos" 
                    : "Nenhum objetivo informado pelos pacientes"
                  }
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Gráfico de Barras - Pacientes por Estado */}
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-200">Pacientes por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {estadosData.length > 0 ? <BarChart data={estadosData} layout="vertical" margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6D28D9" />
                  <XAxis type="number" domain={[0, 'auto']} stroke="#A78BFA" />
                  <YAxis dataKey="estado" type="category" width={50} tick={{ fontSize: 12, fill: '#A78BFA' }} />
                  <Tooltip formatter={value => [`${value} pacientes`, 'Quantidade']} labelFormatter={label => `Estado: ${label}`} contentStyle={{ background: '#2a174d', color: '#fff', border: 'none' }} />
                  <Bar dataKey="pacientes" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart> : <div className="flex items-center justify-center h-full text-violet-300">
                  Nenhum dado disponível
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Gráfico de Pizza - Distribuição de Status dos Pacientes */}
        <Card className="bg-white/10 backdrop-blur border-none text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-200">Status dos Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {totalPacientes > 0 ? <PieChart>
                  <Pie 
                    data={[
                      { name: 'Ativos', value: pacientesAtivos, color: '#A78BFA' },
                      { name: 'Inativos', value: pacientesInativos, color: '#F472B6' }
                    ]} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    dataKey="value" 
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#A78BFA" />
                    <Cell fill="#F472B6" />
                  </Pie>
                  <Tooltip contentStyle={{ background: '#2a174d', color: '#fff', border: 'none' }} />
                </PieChart> : <div className="flex items-center justify-center h-full text-violet-300">
                  Cadastre pacientes para visualizar o status
                </div>}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
