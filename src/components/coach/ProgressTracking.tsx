
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Calendar,
  BarChart3,
  Users
} from "lucide-react";

export const ProgressTracking = () => {
  const pacientes = [
    {
      id: "1",
      nome: "Maria Silva",
      foto: null,
      objetivo: "Perda de Peso",
      progresso: {
        comportamental: 75,
        bemEstar: 68,
        geral: 72
      },
      metas: {
        consistenciaPlano: { atual: 85, meta: 90, status: "up" },
        hidratacao: { atual: 60, meta: 80, status: "down" },
        sono: { atual: 70, meta: 85, status: "up" },
        exercicio: { atual: 45, meta: 60, status: "same" }
      },
      ultimaInteracao: "2h atrás"
    },
    {
      id: "2",
      nome: "João Santos",
      foto: null,
      objetivo: "Ganho de Massa",
      progresso: {
        comportamental: 82,
        bemEstar: 75,
        geral: 79
      },
      metas: {
        consistenciaPlano: { atual: 95, meta: 90, status: "up" },
        hidratacao: { atual: 85, meta: 80, status: "up" },
        sono: { atual: 65, meta: 85, status: "down" },
        exercicio: { atual: 80, meta: 70, status: "up" }
      },
      ultimaInteracao: "30 min atrás"
    },
    {
      id: "3",
      nome: "Ana Costa",
      foto: null,
      objetivo: "Manutenção",
      progresso: {
        comportamental: 65,
        bemEstar: 58,
        geral: 62
      },
      metas: {
        consistenciaPlano: { atual: 70, meta: 80, status: "up" },
        hidratacao: { atual: 55, meta: 75, status: "same" },
        sono: { atual: 50, meta: 75, status: "down" },
        exercicio: { atual: 40, meta: 60, status: "down" }
      },
      ultimaInteracao: "1 dia atrás"
    }
  ];

  const getTrendIcon = (status: string) => {
    switch (status) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "same": return <Minus className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getObjetivoColor = (objetivo: string) => {
    switch (objetivo) {
      case "Perda de Peso": return "bg-pink-100 text-pink-800";
      case "Ganho de Massa": return "bg-purple-100 text-purple-800";
      case "Manutenção": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Acompanhamento de Pacientes</h2>
          <p className="text-gray-600">Monitore o progresso e metas dos seus pacientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Definir Metas
          </Button>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pacientes.length}</div>
            <div className="flex items-center gap-1 mt-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Ativos</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(pacientes.reduce((acc, p) => acc + p.progresso.geral, 0) / pacientes.length)}%
            </div>
            <Progress 
              value={pacientes.reduce((acc, p) => acc + p.progresso.geral, 0) / pacientes.length} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Metas Alcançadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+3 esta semana</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Questionários respondidos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pacientes */}
      <div className="space-y-4">
        {pacientes.map((paciente) => (
          <Card key={paciente.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={paciente.foto} />
                    <AvatarFallback>
                      {paciente.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{paciente.nome}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getObjetivoColor(paciente.objetivo)}>
                        {paciente.objetivo}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Última interação: {paciente.ultimaInteracao}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progresso Geral */}
                <div className="space-y-3">
                  <h4 className="font-medium">Progresso Geral</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Comportamental</span>
                      <span className={`text-sm font-medium ${getProgressColor(paciente.progresso.comportamental)}`}>
                        {paciente.progresso.comportamental}%
                      </span>
                    </div>
                    <Progress value={paciente.progresso.comportamental} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bem-estar</span>
                      <span className={`text-sm font-medium ${getProgressColor(paciente.progresso.bemEstar)}`}>
                        {paciente.progresso.bemEstar}%
                      </span>
                    </div>
                    <Progress value={paciente.progresso.bemEstar} className="h-2" />
                  </div>
                </div>

                {/* Metas Principais */}
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-3">Metas Principais</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(paciente.metas).map(([chave, meta]) => (
                      <div key={chave} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize">
                            {chave.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          {getTrendIcon(meta.status)}
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{meta.atual}%</span>
                          <span>Meta: {meta.meta}%</span>
                        </div>
                        <Progress value={meta.atual} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
