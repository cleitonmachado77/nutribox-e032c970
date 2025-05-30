import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, UserCheck, Calendar, CheckCircle, TrendingUp } from "lucide-react";
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
    color: '#00594F'
  }, {
    name: 'Ganho de Massa',
    value: 30,
    color: '#00352F'
  }, {
    name: 'Manutenção',
    value: 15,
    color: '#CEDC00'
  }, {
    name: 'Outros',
    value: 10,
    color: '#8FB6B0'
  }];
  const estadosData = [{
    estado: 'SP',
    pacientes: 120
  }, {
    estado: 'RJ',
    pacientes: 85
  }, {
    estado: 'MG',
    pacientes: 65
  }, {
    estado: 'PR',
    pacientes: 45
  }, {
    estado: 'SC',
    pacientes: 38
  }];
  const motivosAbandonoData = [{
    name: 'Preço',
    value: 35,
    color: '#00352F'
  }, {
    name: 'Falta de Tempo',
    value: 25,
    color: '#00594F'
  }, {
    name: 'Sem Interesse',
    value: 20,
    color: '#CEDC00'
  }, {
    name: 'Problemas Pessoais',
    value: 20,
    color: '#8FB6B0'
  }];
  return <div className="p-6 space-y-6 bg-[sidebar-primary-foreground] bg-teal-950">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
      </div>

      {/* Métricas de Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00594F]">248</div>
            <p className="text-xs text-emerald-950">+12% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Qualificados</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00594F]">104</div>
            <p className="text-xs text-green-950">+8% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00594F]">78</div>
            <p className="text-xs text-emerald-950">+5% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00594F]">68</div>
            <p className="text-xs text-emerald-950">+10% vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads → Qualificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00594F]">41.9%</div>
            <p className="text-sm text-emerald-950">+3.2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Qualificados → Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00594F]">75.0%</div>
            <p className="text-sm text-[#00352F]">-1.2% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agendados → Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00594F]">87.2%</div>
            <p className="text-sm text-emerald-950">+2.4% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads → Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00594F]">27.4%</div>
            <p className="text-sm text-emerald-950">+1.8% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Leads vs Consultas */}
        <Card>
          <CardHeader>
            <CardTitle>Leads vs Consultas (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#00594F" name="Leads" />
                <Bar dataKey="consultas" fill="#CEDC00" name="Consultas" />
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

        {/* Gráfico de Barras Horizontal - Estados */}
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
                <Bar dataKey="pacientes" fill="#00594F" />
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
    </div>;
};
export default Dashboard;