import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ReportsChartsProps {
  selectedPeriod: string;
}

export const ReportsCharts = ({ selectedPeriod }: ReportsChartsProps) => {
  const engagementData = [
    { month: 'Jan', engagement: 65, messages: 120, responses: 78 },
    { month: 'Fev', engagement: 72, messages: 135, responses: 97 },
    { month: 'Mar', engagement: 68, messages: 128, responses: 87 },
    { month: 'Abr', engagement: 78, messages: 150, responses: 117 },
    { month: 'Mai', engagement: 82, messages: 162, responses: 133 },
    { month: 'Jun', engagement: 75, messages: 145, responses: 109 }
  ];

  const goalTypesData = [
    { name: 'Peso', value: 35, color: '#8884d8' },
    { name: 'Hidratação', value: 25, color: '#82ca9d' },
    { name: 'Exercício', value: 20, color: '#ffc658' },
    { name: 'Dieta', value: 15, color: '#ff7c7c' },
    { name: 'Personalizado', value: 5, color: '#8dd1e1' }
  ];

  const patientProgressData = [
    { week: 'Sem 1', completed: 12, total: 20, rate: 60 },
    { week: 'Sem 2', completed: 15, total: 22, rate: 68 },
    { week: 'Sem 3', completed: 18, total: 25, rate: 72 },
    { week: 'Sem 4', completed: 22, total: 28, rate: 79 }
  ];

  const chartConfig = {
    engagement: {
      label: "Engajamento (%)",
      color: "#2563eb",
    },
    messages: {
      label: "Mensagens",
      color: "#dc2626",
    },
    responses: {
      label: "Respostas",
      color: "#16a34a",
    },
    completed: {
      label: "Completadas",
      color: "#059669",
    },
    total: {
      label: "Total",
      color: "#64748b",
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Engajamento ao Longo do Tempo */}
      <Card>
        <CardHeader>
          <CardTitle>Engajamento ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 'auto']} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="var(--color-engagement)" 
                strokeWidth={2}
                name="Engajamento (%)"
              />
              <Line 
                type="monotone" 
                dataKey="responses" 
                stroke="var(--color-responses)" 
                strokeWidth={2}
                name="Respostas"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Distribuição de Tipos de Meta */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Tipos de Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <PieChart>
              <Pie
                data={goalTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {goalTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Mensagens vs Respostas */}
      <Card>
        <CardHeader>
          <CardTitle>Mensagens vs Respostas</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 'auto']} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="messages" fill="var(--color-messages)" name="Mensagens" />
              <Bar dataKey="responses" fill="var(--color-responses)" name="Respostas" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Progresso de Metas por Semana */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso de Metas por Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={patientProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 'auto']} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="completed" fill="var(--color-completed)" name="Metas Completadas" />
              <Bar dataKey="total" fill="var(--color-total)" name="Total de Metas" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};