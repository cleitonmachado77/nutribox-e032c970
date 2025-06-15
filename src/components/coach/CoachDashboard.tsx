
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";

export const CoachDashboard = () => {
  // Mock data - em produção virá do banco de dados
  const stats = {
    pacientesAtivos: 15,
    interacoesDiarias: 42,
    metasAlcancadas: 8,
    progressoMedio: 73
  };

  const recentActivity = [
    { paciente: "Maria Silva", acao: "Completou questionário comportamental", tempo: "2 min atrás", status: "success" },
    { paciente: "João Santos", acao: "Meta de hidratação não alcançada", tempo: "15 min atrás", status: "warning" },
    { paciente: "Ana Costa", acao: "Plano alimentar seguido com sucesso", tempo: "1h atrás", status: "success" },
    { paciente: "Carlos Lima", acao: "Faltou responder questionário diário", tempo: "2h atrás", status: "error" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pacientesAtivos}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interações Hoje</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interacoesDiarias}</div>
            <p className="text-xs text-muted-foreground">
              +15% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Alcançadas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.metasAlcancadas}</div>
            <p className="text-xs text-muted-foreground">
              de 15 pacientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.progressoMedio}%</div>
            <Progress value={stats.progressoMedio} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <p className="font-medium text-gray-900">{activity.paciente}</p>
                    <p className="text-sm text-gray-600">{activity.acao}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.tempo}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Metas Comportamentais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Consistência do Plano</span>
              <Badge className="bg-green-100 text-green-800">75% alcançaram</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Frequência de Refeições</span>
              <Badge className="bg-yellow-100 text-yellow-800">60% alcançaram</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Ingestão de Líquidos</span>
              <Badge className="bg-red-100 text-red-800">40% alcançaram</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metas de Bem-Estar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Qualidade do Sono</span>
              <Badge className="bg-green-100 text-green-800">80% alcançaram</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Atividade Física</span>
              <Badge className="bg-yellow-100 text-yellow-800">65% alcançaram</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Satisfação Corporal</span>
              <Badge className="bg-green-100 text-green-800">70% melhoraram</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
