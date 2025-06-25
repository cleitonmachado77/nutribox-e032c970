
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Phone, Mail, Target, Scale, Activity, Heart, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { PatientTabs } from "@/components/pacientes/PatientTabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConsultasPatientProfileProps {
  selectedPatient: Paciente;
  onBack: () => void;
  onOpenConsultaDialog: () => void;
}

export const ConsultasPatientProfile = ({ 
  selectedPatient, 
  onBack, 
  onOpenConsultaDialog 
}: ConsultasPatientProfileProps) => {
  const getObjetivoColor = (objetivo: string) => {
    switch (objetivo) {
      case "Perda de Peso":
        return "bg-gradient-to-r from-pink-500 to-rose-500 text-white";
      case "Ganho de Massa":
        return "bg-gradient-to-r from-indigo-500 to-purple-500 text-white";
      case "Manutenção":
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
      case "pausado":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "inativo":
        return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-gradient-to-r from-emerald-400 to-green-500";
    if (progress >= 60) return "bg-gradient-to-r from-amber-400 to-yellow-500";
    return "bg-gradient-to-r from-rose-400 to-red-500";
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-white">Perfil do Paciente</h1>
      </div>

      {/* Card principal do perfil */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        {/* Header do perfil */}
        <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-t-lg">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
              <AvatarImage src={selectedPatient.lead.foto_perfil} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-2xl">
                {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {selectedPatient.lead.nome}
              </CardTitle>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={`${getStatusColor(selectedPatient.status_tratamento)} text-sm px-3 py-1`}>
                  {selectedPatient.status_tratamento}
                </Badge>
                {selectedPatient.lead.objetivo_tag && (
                  <Badge 
                    className="text-sm px-3 py-1 text-white"
                    style={{ backgroundColor: selectedPatient.lead.objetivo_tag.cor }}
                  >
                    {selectedPatient.lead.objetivo_tag.nome}
                  </Badge>
                )}
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                  <span className="text-sm">Progresso: {selectedPatient.lead.progresso || 0}%</span>
                </div>
              </div>
            </div>

            {/* Próxima consulta */}
            {selectedPatient.lead.proxima_consulta && (
              <div className="text-right">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Próxima Consulta</span>
                </div>
                <div className="text-sm">
                  {format(new Date(selectedPatient.lead.proxima_consulta), 'dd/MM/yyyy HH:mm')}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Informações rápidas */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{selectedPatient.lead.telefone}</p>
              </div>
            </div>
            
            {selectedPatient.lead.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedPatient.lead.email}</p>
                </div>
              </div>
            )}

            {selectedPatient.lead.peso && (
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Peso</p>
                  <p className="font-medium">{selectedPatient.lead.peso}</p>
                </div>
              </div>
            )}

            {selectedPatient.lead.altura && (
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Altura</p>
                  <p className="font-medium">{selectedPatient.lead.altura}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo principal com abas */}
        <CardContent className="p-6">
          <PatientTabs 
            selectedPatient={selectedPatient}
            onOpenConsultaDialog={onOpenConsultaDialog}
            getObjetivoColor={getObjetivoColor}
            getStatusColor={getStatusColor}
            getProgressColor={getProgressColor}
          />
        </CardContent>
      </Card>
    </div>
  );
};
