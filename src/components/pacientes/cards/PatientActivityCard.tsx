
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paciente } from "@/hooks/usePacientes";
import { 
  Activity,
  Calendar,
  Clock,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientActivityCardProps {
  selectedPatient: Paciente;
}

export const PatientActivityCard = ({ selectedPatient }: PatientActivityCardProps) => {
  return (
    <Card className="shadow-lg border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Cadastrado em:</span>
            <span className="text-sm font-medium">
              {format(new Date(selectedPatient.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>

          {selectedPatient.lead.ultima_consulta && (
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Última consulta:</span>
              <span className="text-sm font-medium">
                {format(new Date(selectedPatient.lead.ultima_consulta), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          )}

          {selectedPatient.lead.proxima_consulta && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Próxima consulta:</span>
              <span className="text-sm font-medium">
                {format(new Date(selectedPatient.lead.proxima_consulta), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span className="text-sm">Consultas realizadas:</span>
            <span className="text-sm font-medium">
              {selectedPatient.lead.consultas_realizadas || 0}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <strong>Tempo de acompanhamento:</strong>
              <br />
              {Math.ceil((new Date().getTime() - new Date(selectedPatient.created_at).getTime()) / (1000 * 60 * 60 * 24))} dias
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
