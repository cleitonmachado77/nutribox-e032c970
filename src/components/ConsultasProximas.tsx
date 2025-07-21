
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { format, isToday, isTomorrow, isThisWeek, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ConsultasProximas = () => {
  const { data: leads = [] } = useLeads();

  // Filtrar leads com consultas agendadas futuras
  const proximasConsultas = leads
    .filter(lead => {
      if (!lead.proxima_consulta || lead.status !== 'consulta_agendada') {
        return false;
      }
      
      const dataConsulta = new Date(lead.proxima_consulta);
      const agora = new Date();
      
      // Só mostrar consultas que são futuras
      return isAfter(dataConsulta, agora);
    })
    .map(lead => ({
      ...lead,
      dataConsulta: new Date(lead.proxima_consulta!)
    }))
    .sort((a, b) => a.dataConsulta.getTime() - b.dataConsulta.getTime())
    .slice(0, 5); // Mostrar apenas as próximas 5

  if (proximasConsultas.length === 0) {
    return null;
  }

  const getPrioridade = (data: Date) => {
    if (isToday(data)) return { cor: 'bg-red-500', texto: 'Hoje' };
    if (isTomorrow(data)) return { cor: 'bg-orange-500', texto: 'Amanhã' };
    if (isThisWeek(data)) return { cor: 'bg-yellow-500', texto: 'Esta semana' };
    return { cor: 'bg-blue-500', texto: 'Próxima' };
  };

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5" />
          Próximas Consultas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {proximasConsultas.map((lead) => {
            const prioridade = getPrioridade(lead.dataConsulta);
            
            return (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${prioridade.cor}`}></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{lead.nome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {format(lead.dataConsulta, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>
                <Badge className={`${prioridade.cor} text-white`}>
                  {prioridade.texto}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
