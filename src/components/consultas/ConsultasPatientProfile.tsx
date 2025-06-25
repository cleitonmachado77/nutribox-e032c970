
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Phone, Mail, Target, Scale, Activity, Heart, Clock, Camera, User, MapPin } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-white hover:bg-gray-50 border-amber-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
      </div>

      {/* Container principal inspirado na imagem */}
      <div className="max-w-6xl mx-auto">
        {/* Header com avatar e informações básicas */}
        <Card className="mb-6 border-2 border-amber-200 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-amber-200">
                  <AvatarImage src={selectedPatient.lead.foto_perfil} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-400 to-yellow-500 text-white text-2xl">
                    {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {selectedPatient.lead.nome}
                </h2>
                <p className="text-gray-600 mb-2">
                  {selectedPatient.lead.idade ? `${selectedPatient.lead.idade} anos` : 'Idade não informada'}
                </p>
                <p className="text-sm text-gray-500">
                  Emagrecimento, {selectedPatient.lead.consultas_realizadas || 0} consultas
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={onOpenConsultaDialog}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Nova Consulta
                </Button>
                <Button variant="outline" className="border-amber-200">
                  Perfil do Paciente
                </Button>
                <Button variant="outline" className="border-amber-200">
                  Histórico de Consultas
                </Button>
                <Button variant="outline" className="border-amber-200">
                  Relatório Nutricional
                </Button>
              </div>
            </div>

            {/* Cards de informações */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card de Informações Básicas */}
              <Card className="bg-gradient-to-br from-yellow-300 to-amber-400 border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Nome Completo:</span>
                      <span className="text-sm text-gray-800">{selectedPatient.lead.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Data de Nascimento:</span>
                      <span className="text-sm text-gray-800">
                        {selectedPatient.lead.data_nascimento ? 
                          format(new Date(selectedPatient.lead.data_nascimento), 'dd/MM/yyyy') : 
                          'Não informado'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Sexo:</span>
                      <span className="text-sm text-gray-800">{selectedPatient.lead.sexo || 'Não informado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">WhatsApp:</span>
                      <span className="text-sm text-gray-800">{selectedPatient.lead.telefone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">E-mail:</span>
                      <span className="text-sm text-gray-800">{selectedPatient.lead.email || 'Não informado'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-500/30">
                    <h4 className="font-bold text-gray-800 mb-2">Histórico</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Nº de Consultas:</span>
                        <span className="text-sm text-gray-800">{selectedPatient.lead.consultas_realizadas || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Primeira Consulta:</span>
                        <span className="text-sm text-gray-800">
                          {selectedPatient.data_primeira_consulta ? 
                            format(new Date(selectedPatient.data_primeira_consulta), 'dd/MM/yyyy') : 
                            'Não realizada'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Última Consulta:</span>
                        <span className="text-sm text-gray-800">
                          {selectedPatient.lead.ultima_consulta ? 
                            format(new Date(selectedPatient.lead.ultima_consulta), 'dd/MM/yyyy') : 
                            'Nenhuma'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Objetivo:</span>
                        <span className="text-sm text-gray-800">{selectedPatient.lead.objetivo || 'Não definido'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-white/20 hover:bg-white/30 border-amber-600 text-amber-800"
                    >
                      Alterar Dados
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Fotos */}
              <Card className="bg-gradient-to-br from-yellow-300 to-amber-400 border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Fotos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Perfil</h4>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="aspect-square bg-white/30 rounded-lg flex items-center justify-center border-2 border-dashed border-amber-600">
                          <Camera className="h-8 w-8 text-amber-700" />
                        </div>
                        <div className="aspect-square bg-white/30 rounded-lg"></div>
                        <div className="aspect-square bg-white/30 rounded-lg"></div>
                        <div className="aspect-square bg-white/30 rounded-lg"></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Antes e Depois</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="aspect-square bg-white/30 rounded-lg flex items-center justify-center border-2 border-dashed border-amber-600">
                          <div className="text-center">
                            <Camera className="h-6 w-6 text-amber-700 mx-auto mb-1" />
                            <span className="text-xs text-amber-800">Antes</span>
                          </div>
                        </div>
                        <div className="aspect-square bg-white/30 rounded-lg flex items-center justify-center border-2 border-dashed border-amber-600">
                          <div className="text-center">
                            <Camera className="h-6 w-6 text-amber-700 mx-auto mb-1" />
                            <span className="text-xs text-amber-800">Depois</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-white/20 hover:bg-white/30 border-amber-600 text-amber-800"
                      >
                        Alterar Foto
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-white/20 hover:bg-white/30 border-amber-600 text-amber-800"
                      >
                        Adicionar Foto
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Tabs do paciente */}
        <Card className="border-2 border-amber-200 shadow-lg bg-white">
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
    </div>
  );
};
