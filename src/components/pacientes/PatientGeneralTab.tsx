
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  Activity,
  MapPin,
  Cake,
  Scale,
  Ruler,
  Clock,
  CheckCircle,
  Edit
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientGeneralTabProps {
  selectedPatient: Paciente;
  onOpenConsultaDialog: () => void;
  getObjetivoColor: (objetivo: string) => string;
  getStatusColor: (status: string) => string;
  getProgressColor: (progress: number) => string;
}

export const PatientGeneralTab = ({ 
  selectedPatient, 
  onOpenConsultaDialog,
  getObjetivoColor,
  getStatusColor,
  getProgressColor
}: PatientGeneralTabProps) => {
  const handleConsultasClick = () => {
    // Alternar para a aba de consultas
    const consultasTab = document.querySelector('[value="consultas"]') as HTMLElement;
    if (consultasTab) {
      consultasTab.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card de Informações Pessoais */}
      <Card className="shadow-lg border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={selectedPatient.lead.foto_perfil} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
                {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{selectedPatient.lead.nome}</h3>
              <p className="text-gray-600">
                {selectedPatient.lead.idade ? `${selectedPatient.lead.idade} anos` : 'Idade não informada'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{selectedPatient.lead.email || 'Email não informado'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{selectedPatient.lead.telefone}</span>
            </div>

            {selectedPatient.lead.data_nascimento && (
              <div className="flex items-center gap-2 text-gray-700">
                <Cake className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {format(new Date(selectedPatient.lead.data_nascimento), 'dd/MM/yyyy')}
                </span>
              </div>
            )}

            {selectedPatient.lead.endereco && (
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{selectedPatient.lead.endereco}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleConsultasClick}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Consultas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card de Status e Objetivos */}
      <Card className="shadow-lg border-purple-200">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Status e Objetivos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Objetivo Principal:</label>
              <Badge className={`ml-2 ${getObjetivoColor(selectedPatient.lead.objetivo || 'Não definido')}`}>
                {selectedPatient.lead.objetivo || 'Não definido'}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status:</label>
              <Badge className={`ml-2 ${getStatusColor(selectedPatient.lead.status || 'Indefinido')}`}>
                {selectedPatient.lead.status || 'Indefinido'}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Progresso:</label>
              <div className="flex items-center gap-2">
                <Progress 
                  value={selectedPatient.lead.progresso || 0} 
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-700">
                  {selectedPatient.lead.progresso || 0}%
                </span>
              </div>
              <div className={`mt-1 h-1 rounded-full ${getProgressColor(selectedPatient.lead.progresso || 0)}`}></div>
            </div>

            {selectedPatient.lead.peso_inicial && (
              <div className="flex items-center gap-2 text-gray-700">
                <Scale className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Peso inicial: {selectedPatient.lead.peso_inicial} kg</span>
              </div>
            )}

            {selectedPatient.lead.altura && (
              <div className="flex items-center gap-2 text-gray-700">
                <Ruler className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Altura: {selectedPatient.lead.altura} cm</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
              <Edit className="w-4 h-4 mr-2" />
              Editar Informações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card de Atividade Recente */}
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
    </div>
  );
};
