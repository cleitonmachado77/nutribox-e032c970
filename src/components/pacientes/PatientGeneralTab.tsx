
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, Phone, Mail, MapPin, Calendar, Heart, CheckCircle, History, StickyNote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";

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
  return (
    <>
      {/* Header do Paciente */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
            <AvatarImage src={selectedPatient.lead.foto_perfil} />
            <AvatarFallback className="text-2xl bg-white text-indigo-600">
              {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{selectedPatient.lead.nome}</h2>
            <div className="flex items-center gap-4 mt-2 text-indigo-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {selectedPatient.lead.cidade}, {selectedPatient.lead.estado}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Convertido em {selectedPatient.lead.data_conversao}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{selectedPatient.lead.progresso}%</div>
            <div className="text-indigo-200 text-sm">Progresso</div>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="mt-4">
          <div className="bg-white/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getProgressColor(selectedPatient.lead.progresso)} transition-all duration-500`} 
              style={{ width: `${selectedPatient.lead.progresso}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Telefone:</span> {selectedPatient.lead.telefone}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Email:</span> {selectedPatient.lead.email}
            </div>
            <div>
              <span className="font-medium">Objetivo:</span>
              <Badge className={`ml-2 ${getObjetivoColor(selectedPatient.lead.objetivo)}`}>
                {selectedPatient.lead.objetivo}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge className={`ml-2 ${getStatusColor(selectedPatient.status_tratamento)}`}>
                {selectedPatient.status_tratamento === 'ativo' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dados Corporais */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Dados Corporais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><span className="font-medium">Peso:</span> {selectedPatient.lead.peso}</div>
            <div><span className="font-medium">Altura:</span> {selectedPatient.lead.altura}</div>
            <div><span className="font-medium">IMC:</span> {selectedPatient.lead.imc}</div>
            <div><span className="font-medium">Última Consulta:</span> {selectedPatient.lead.ultima_consulta}</div>
            <div><span className="font-medium">Próxima Consulta:</span> {selectedPatient.lead.proxima_consulta}</div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Consultas */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={onOpenConsultaDialog}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Registrar Consulta Realizada
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const tab = document.querySelector('[value="historico"]') as HTMLElement;
                tab?.click();
              }}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <History className="w-4 h-4 mr-2" />
              Ver Histórico
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Anotações */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Anotações do Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Adicione suas anotações sobre o paciente..." 
            value={selectedPatient.lead.anotacoes} 
            className="min-h-32 border-2 focus:border-indigo-500" 
          />
          <Button className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600">
            <StickyNote className="w-4 h-4 mr-2" />
            Salvar Anotações
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
