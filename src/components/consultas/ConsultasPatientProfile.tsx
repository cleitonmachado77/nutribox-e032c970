import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Phone, Mail, Target, Scale, Activity, Heart, Clock, Camera, User, MapPin, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { NewConsultationTab } from "@/components/pacientes/NewConsultationTab";
import { PatientHistoryTab } from "@/components/pacientes/PatientHistoryTab";
import { PatientGeneralTab } from "@/components/pacientes/PatientGeneralTab";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { usePatientPhotos } from "@/hooks/usePatientPhotos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";

interface ConsultasPatientProfileProps {
  selectedPatient: Paciente;
  onBack: () => void;
  onOpenConsultaDialog: () => void;
}

type ViewMode = 'consultation' | 'profile' | 'history' | 'report';

export const ConsultasPatientProfile = ({ 
  selectedPatient, 
  onBack, 
  onOpenConsultaDialog 
}: ConsultasPatientProfileProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('consultation');
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhotoType, setSelectedPhotoType] = useState<'perfil' | 'antes' | 'depois' | 'progresso'>('perfil');
  
  const { photos, addPhoto, deletePhoto, isLoading: photosLoading } = usePatientPhotos(selectedPatient.id);

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

  const handleNovaConsulta = () => {
    setViewMode('consultation');
  };

  const handlePerfilPaciente = () => {
    setViewMode('profile');
  };

  const handleHistoricoConsultas = () => {
    setViewMode('history');
  };

  const handleRelatorioNutricional = () => {
    setViewMode('report');
  };

  const handleBackToProfile = () => {
    setViewMode('consultation');
  };

  const handleAddPhoto = async (url: string) => {
    await addPhoto(url, selectedPhotoType);
    setPhotoDialogOpen(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    await deletePhoto(photoId);
  };

  const getPhotosByType = (tipo: string) => {
    return photos.filter(photo => photo.tipo === tipo);
  };

  const renderPhotoGrid = (tipo: 'perfil' | 'antes' | 'depois' | 'progresso', title: string, cols: number = 4) => {
    const typePhotos = getPhotosByType(tipo);
    const emptySlots = Array(cols - typePhotos.length).fill(null);

    return (
      <div>
        <h4 className="font-medium text-white mb-3">{title}</h4>
        <div className={`grid grid-cols-${cols} gap-3`}>
          {typePhotos.map((photo) => (
            <div key={photo.id} className="relative aspect-square bg-white/30 rounded-lg overflow-hidden group">
              <img 
                src={photo.url} 
                alt={photo.descricao || title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {emptySlots.map((_, index) => (
            <div 
              key={index}
              className="aspect-square bg-white/30 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300 cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => {
                setSelectedPhotoType(tipo);
                setPhotoDialogOpen(true);
              }}
            >
              <Camera className="h-8 w-8 text-purple-100" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNutritionalReport = () => {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Relatório Nutricional - {selectedPatient.lead.nome}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dados Antropométricos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Dados Antropométricos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Peso Atual:</span>
                    <span>{selectedPatient.lead.peso || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Altura:</span>
                    <span>{selectedPatient.lead.altura || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">IMC:</span>
                    <span>{selectedPatient.lead.imc || 'Não calculado'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Status do Tratamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status do Tratamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status:</span>
                    <Badge className={getStatusColor(selectedPatient.status_tratamento)}>
                      {selectedPatient.status_tratamento}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Objetivo:</span>
                    <Badge className={getObjetivoColor(selectedPatient.lead.objetivo || '')}>
                      {selectedPatient.lead.objetivo || 'Não definido'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Progresso:</span>
                    <span className="font-semibold">{selectedPatient.lead.progresso || 0}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Consultas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Histórico de Consultas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Primeira Consulta:</span>
                    <span>
                      {selectedPatient.data_primeira_consulta ? 
                        format(new Date(selectedPatient.data_primeira_consulta), 'dd/MM/yyyy') : 
                        'Não realizada'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Última Consulta:</span>
                    <span>
                      {selectedPatient.lead.ultima_consulta ? 
                        format(new Date(selectedPatient.lead.ultima_consulta), 'dd/MM/yyyy') : 
                        'Nenhuma'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total de Consultas:</span>
                    <span>{selectedPatient.lead.consultas_realizadas || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Plano Alimentar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Plano Alimentar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPatient.lead.plano_alimentar ? (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">{selectedPatient.lead.plano_alimentar}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Nenhum plano alimentar definido ainda.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Observações */}
            {selectedPatient.lead.anotacoes && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Observações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm whitespace-pre-wrap">{selectedPatient.lead.anotacoes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="flex-1"
              >
                Imprimir Relatório
              </Button>
              <Button 
                onClick={handleBackToProfile}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={viewMode === 'consultation' ? onBack : handleBackToProfile}
          className="bg-white hover:bg-gray-50 border-purple-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {viewMode === 'consultation' && 'Nova Consulta'}
          {viewMode === 'profile' && 'Perfil do Paciente'}
          {viewMode === 'history' && 'Histórico de Consultas'}
          {viewMode === 'report' && 'Relatório Nutricional'}
        </h1>
      </div>

      {/* Container principal */}
      <div className="max-w-6xl mx-auto">
        {/* Renderizar conteúdo baseado no modo de visualização */}
        {viewMode === 'consultation' && (
          <>
            {/* Header com avatar e informações básicas */}
            <Card className="mb-6 border-2 border-purple-200 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-purple-200">
                      <AvatarImage src={selectedPatient.lead.foto_perfil} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-violet-500 text-white text-2xl">
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
                      onClick={handleNovaConsulta}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                      variant={viewMode === 'consultation' ? 'default' : 'outline'}
                    >
                      Nova Consulta
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-purple-200"
                      onClick={handlePerfilPaciente}
                    >
                      Perfil do Paciente
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-purple-200"
                      onClick={handleHistoricoConsultas}
                    >
                      Histórico de Consultas
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-purple-200"
                      onClick={handleRelatorioNutricional}
                    >
                      Relatório Nutricional
                    </Button>
                  </div>
                </div>

                {/* Cards de informações */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card de Informações Básicas */}
                  <Card className="bg-gradient-to-br from-purple-400 to-violet-500 border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informações Básicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-purple-100">Nome Completo:</span>
                          <span className="text-sm text-white">{selectedPatient.lead.nome}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-purple-100">Data de Nascimento:</span>
                          <span className="text-sm text-white">
                            {selectedPatient.lead.data_nascimento ? 
                              format(new Date(selectedPatient.lead.data_nascimento), 'dd/MM/yyyy') : 
                              'Não informado'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-purple-100">Sexo:</span>
                          <span className="text-sm text-white">{selectedPatient.lead.sexo || 'Não informado'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-purple-100">WhatsApp:</span>
                          <span className="text-sm text-white">{selectedPatient.lead.telefone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-purple-100">E-mail:</span>
                          <span className="text-sm text-white">{selectedPatient.lead.email || 'Não informado'}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-purple-300/30">
                        <h4 className="font-bold text-white mb-2">Histórico</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-purple-100">Nº de Consultas:</span>
                            <span className="text-sm text-white">{selectedPatient.lead.consultas_realizadas || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-purple-100">Primeira Consulta:</span>
                            <span className="text-sm text-white">
                              {selectedPatient.data_primeira_consulta ? 
                                format(new Date(selectedPatient.data_primeira_consulta), 'dd/MM/yyyy') : 
                                'Não realizada'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-purple-100">Última Consulta:</span>
                            <span className="text-sm text-white">
                              {selectedPatient.lead.ultima_consulta ? 
                                format(new Date(selectedPatient.lead.ultima_consulta), 'dd/MM/yyyy') : 
                                'Nenhuma'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-purple-100">Objetivo:</span>
                            <span className="text-sm text-white">{selectedPatient.lead.objetivo || 'Não definido'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-white/20 hover:bg-white/30 border-purple-300 text-white"
                        >
                          Alterar Dados
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card de Fotos */}
                  <Card className="bg-gradient-to-br from-purple-400 to-violet-500 border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Fotos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {renderPhotoGrid('perfil', 'Perfil', 4)}
                        {renderPhotoGrid('antes', 'Antes', 2)}
                        {renderPhotoGrid('depois', 'Depois', 2)}

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-white/20 hover:bg-white/30 border-purple-300 text-white"
                            onClick={() => {
                              setSelectedPhotoType('perfil');
                              setPhotoDialogOpen(true);
                            }}
                          >
                            Alterar Foto
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-white/20 hover:bg-white/30 border-purple-300 text-white"
                            onClick={() => {
                              setSelectedPhotoType('progresso');
                              setPhotoDialogOpen(true);
                            }}
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

            <NewConsultationTab selectedPatient={selectedPatient} />
          </>
        )}

        {viewMode === 'profile' && (
          <PatientGeneralTab 
            selectedPatient={selectedPatient}
            onOpenConsultaDialog={onOpenConsultaDialog}
            getObjetivoColor={getObjetivoColor}
            getStatusColor={getStatusColor}
            getProgressColor={getProgressColor}
          />
        )}

        {viewMode === 'history' && (
          <PatientHistoryTab 
            selectedPatient={selectedPatient}
            onOpenConsultaDialog={onOpenConsultaDialog}
          />
        )}

        {viewMode === 'report' && renderNutritionalReport()}
      </div>

      {/* Dialog para adicionar fotos */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Adicionar Foto - {selectedPhotoType === 'perfil' ? 'Perfil' : 
                              selectedPhotoType === 'antes' ? 'Antes' :
                              selectedPhotoType === 'depois' ? 'Depois' : 'Progresso'}
            </DialogTitle>
          </DialogHeader>
          <ImageUpload
            value=""
            onChange={handleAddPhoto}
            label={`Foto de ${selectedPhotoType}`}
            placeholder="Cole o URL da imagem ou faça upload"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
