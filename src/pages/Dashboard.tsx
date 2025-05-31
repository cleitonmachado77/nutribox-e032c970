import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, UserPlus, Calendar, TrendingUp, MessageCircle, UserCheck, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";

const Dashboard = () => {
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
  
  // Updated states data based on actual patient distribution
  const estadosData = [{
    estado: 'SP',
    pacientes: 1
  }, {
    estado: 'RJ',
    pacientes: 1
  }, {
    estado: 'MG',
    pacientes: 1
  }, {
    estado: 'CE',
    pacientes: 1
  }, {
    estado: 'SC',
    pacientes: 1
  }, {
    estado: 'PR',
    pacientes: 1
  }, {
    estado: 'RS',
    pacientes: 1
  }, {
    estado: 'GO',
    pacientes: 1
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

        {/* Gráfico de Barras Horizontal - Estados Atualizado */}
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
