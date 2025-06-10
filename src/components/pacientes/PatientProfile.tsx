
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Clock, Users as UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { PatientTabs } from "./PatientTabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientProfileProps {
  selectedPatient: Paciente | null;
  onOpenConsultaDialog: () => void;
}

export const PatientProfile = ({ selectedPatient, onOpenConsultaDialog }: PatientProfileProps) => {
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
      case "Em acompanhamento":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
      case "Consulta agendada":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "Sem interação":
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

  if (!selectedPatient) {
    return (
      <Card className="lg:col-span-2 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-t-lg">
          <CardTitle className="text-white">Selecione um paciente</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <UsersIcon className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecione um paciente</h3>
            <p className="text-gray-500">Escolha um paciente da lista para ver seus detalhes e acompanhar seu progresso</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-t-lg">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedPatient.lead.foto_perfil} />
              <AvatarFallback>{selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            Perfil de {selectedPatient.lead.nome}
          </div>
          
          {/* Mostrar próxima consulta se houver */}
          {selectedPatient.lead.proxima_consulta && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Próxima: {format(new Date(selectedPatient.lead.proxima_consulta), 'dd/MM/yyyy HH:mm')}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Alerta de consulta próxima */}
        {selectedPatient.lead.proxima_consulta && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Consulta Agendada</span>
            </div>
            <p className="text-amber-700 mt-1">
              {format(new Date(selectedPatient.lead.proxima_consulta), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        )}

        <PatientTabs 
          selectedPatient={selectedPatient}
          onOpenConsultaDialog={onOpenConsultaDialog}
          getObjetivoColor={getObjetivoColor}
          getStatusColor={getStatusColor}
          getProgressColor={getProgressColor}
        />
      </CardContent>
    </Card>
  );
};
