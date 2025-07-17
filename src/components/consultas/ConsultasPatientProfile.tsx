
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Phone, Mail, Target, Scale, Activity, Heart, Clock, Camera, User, MapPin, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { NewConsultationTab } from "@/components/pacientes/NewConsultationTab";
import { HistoricoConsultas } from "@/components/HistoricoConsultas";
import { usePatientPhotos } from "@/hooks/usePatientPhotos";
import { ImageUpload } from "@/components/ImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

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
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showConsultationHistory, setShowConsultationHistory] = useState(false);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [showNutritionalReport, setShowNutritionalReport] = useState(false);
  const [showAddPhotoDialog, setShowAddPhotoDialog] = useState(false);
  const [showEditPatientDialog, setShowEditPatientDialog] = useState(false);
  const [selectedPhotoType, setSelectedPhotoType] = useState<'perfil' | 'antes' | 'depois' | 'progresso'>('perfil');
  
  // Hook para gerenciar fotos do paciente
  const { photos, isLoading: photosLoading, addPhoto, deletePhoto } = usePatientPhotos(selectedPatient.id);
  
  // Hook para toast notifications
  const { toast } = useToast();
  
  // Estado para edição de dados
  const [editingData, setEditingData] = useState({
    nome: selectedPatient.lead.nome,
    telefone: selectedPatient.lead.telefone,
    email: selectedPatient.lead.email || '',
    peso: selectedPatient.lead.peso || '',
    altura: selectedPatient.lead.altura || '',
    objetivo: selectedPatient.lead.objetivo || '',
    cidade: selectedPatient.lead.cidade || '',
    estado: selectedPatient.lead.estado || '',
    data_nascimento: selectedPatient.lead.data_nascimento || '',
    sexo: selectedPatient.lead.sexo || '',
    anotacoes: selectedPatient.lead.anotacoes || '',
    foto_perfil: selectedPatient.lead.foto_perfil || ''
  });

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

  const handleConsultasClick = () => {
    // Navegar diretamente para o formulário de nova consulta
    setShowConsultationForm(true);
  };

  const handleBackToProfile = () => {
    setShowConsultationForm(false);
    setShowConsultationHistory(false);
    setShowPatientProfile(false);
    setShowNutritionalReport(false);
  };

  const handleNovaConsulta = () => {
    setShowConsultationForm(true);
    setShowConsultationHistory(false);
    setShowPatientProfile(false);
    setShowNutritionalReport(false);
  };

  const handlePatientProfile = () => {
    setShowPatientProfile(true);
    setShowConsultationForm(false);
    setShowConsultationHistory(false);
    setShowNutritionalReport(false);
  };

  const handleConsultationHistory = () => {
    setShowConsultationHistory(true);
    setShowConsultationForm(false);
    setShowPatientProfile(false);
    setShowNutritionalReport(false);
  };

  const handleNutritionalReport = () => {
    setShowNutritionalReport(true);
    setShowConsultationForm(false);
    setShowConsultationHistory(false);
    setShowPatientProfile(false);
  };

  const handleAddPhoto = (type: 'perfil' | 'antes' | 'depois' | 'progresso') => {
    setSelectedPhotoType(type);
    setShowAddPhotoDialog(true);
  };

  const handlePhotoUpload = async (url: string) => {
    await addPhoto(url, selectedPhotoType, `Foto ${selectedPhotoType} - ${format(new Date(), 'dd/MM/yyyy')}`);
    setShowAddPhotoDialog(false);
  };

  // Filtrar fotos por tipo
  const getPhotosByType = (type: 'perfil' | 'antes' | 'depois' | 'progresso') => {
    return photos.filter(photo => photo.tipo === type);
  };

  const handleEditPatient = () => {
    setShowEditPatientDialog(true);
  };

  const handleSavePatientData = async () => {
    try {
      // Dados originais
      const originalData = {
        nome: selectedPatient.lead.nome,
        telefone: selectedPatient.lead.telefone,
        email: selectedPatient.lead.email || '',
        peso: selectedPatient.lead.peso || '',
        altura: selectedPatient.lead.altura || '',
        objetivo: selectedPatient.lead.objetivo || '',
        cidade: selectedPatient.lead.cidade || '',
        estado: selectedPatient.lead.estado || '',
        data_nascimento: selectedPatient.lead.data_nascimento || '',
        sexo: selectedPatient.lead.sexo || '',
        anotacoes: selectedPatient.lead.anotacoes || '',
        foto_perfil: selectedPatient.lead.foto_perfil || ''
      };

      // Criar objeto apenas com campos que mudaram
      const changedFields: any = {};
      
      if (editingData.nome !== originalData.nome) {
        changedFields.nome = editingData.nome.trim();
      }
      if (editingData.telefone !== originalData.telefone) {
        changedFields.telefone = editingData.telefone.trim();
      }
      if (editingData.email !== originalData.email) {
        changedFields.email = editingData.email.trim() || null;
      }
      if (editingData.peso !== originalData.peso) {
        changedFields.peso = editingData.peso ? editingData.peso.toString() : null;
      }
      if (editingData.altura !== originalData.altura) {
        changedFields.altura = editingData.altura ? editingData.altura.toString() : null;
      }
      if (editingData.objetivo !== originalData.objetivo) {
        changedFields.objetivo = editingData.objetivo || null;
      }
      if (editingData.cidade !== originalData.cidade) {
        changedFields.cidade = editingData.cidade.trim() || null;
      }
      if (editingData.estado !== originalData.estado) {
        changedFields.estado = editingData.estado.trim() || null;
      }
      if (editingData.data_nascimento !== originalData.data_nascimento) {
        changedFields.data_nascimento = editingData.data_nascimento || null;
      }
      if (editingData.sexo !== originalData.sexo) {
        changedFields.sexo = editingData.sexo || null;
      }
      if (editingData.anotacoes !== originalData.anotacoes) {
        changedFields.anotacoes = editingData.anotacoes.trim() || null;
      }
      if (editingData.foto_perfil !== originalData.foto_perfil) {
        changedFields.foto_perfil = editingData.foto_perfil.trim() || null;
      }

      // Se nenhum campo mudou, não fazer nada
      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "Informação",
          description: "Nenhuma alteração foi detectada",
        });
        setShowEditPatientDialog(false);
        return;
      }

      // Adicionar updated_at apenas se há mudanças
      changedFields.updated_at = new Date().toISOString();

      console.log('Campos alterados:', changedFields);
      console.log('ID do lead:', selectedPatient.lead.id);

      // Tentar atualização simples primeiro
      const { data, error: leadError } = await supabase
        .from('leads')
        .update(changedFields)
        .eq('id', selectedPatient.lead.id);

      if (leadError) {
        console.error('Erro detalhado do Supabase:', {
          message: leadError.message,
          details: leadError.details,
          hint: leadError.hint,
          code: leadError.code
        });
        throw leadError;
      }

      console.log('Atualização bem-sucedida:', data);

      toast({
        title: "Sucesso!",
        description: `${Object.keys(changedFields).length - 1} campo(s) atualizado(s) com sucesso`,
      });

      setShowEditPatientDialog(false);
      
      // Recarregar a página
      window.location.reload();

    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: `Erro ao atualizar: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
    }
  };

  // If the consultation form is active, show only it
  if (showConsultationForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToProfile}
            className="bg-white hover:bg-gray-50 border-purple-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Perfil
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Nova Consulta</h1>
        </div>
        <NewConsultationTab selectedPatient={selectedPatient} />
      </div>
    );
  }

  // If the patient profile is active, show patient profile
  if (showPatientProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToProfile}
            className="bg-white hover:bg-gray-50 border-purple-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Perfil
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Perfil do Paciente</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Detalhadas</h2>
          <p className="text-gray-600">Aqui você verá o perfil completo do paciente {selectedPatient.lead.nome}.</p>
        </div>
      </div>
    );
  }

  // If the nutritional report is active, show nutritional report
  if (showNutritionalReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToProfile}
            className="bg-white hover:bg-gray-50 border-purple-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Perfil
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Relatório Nutricional</h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Relatório Nutricional de {selectedPatient.lead.nome}</h2>
          <p className="text-gray-600">Aqui você verá o relatório nutricional completo do paciente.</p>
        </div>
      </div>
    );
  }

  // If the consultation history is active, show the consultation history page
  if (showConsultationHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
        {/* Header similar to the image */}
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleBackToProfile}
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Consultas - {selectedPatient.lead.nome}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-white/20 px-2 py-1 rounded text-sm">
                    {selectedPatient.lead.consultas_realizadas || 0} consultas
                  </span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleNovaConsulta}
              className="bg-white/20 hover:bg-white/30 border border-white/30"
            >
              <span className="mr-2">+</span>
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Histórico de Consultas</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Consulta Ativa:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  #{selectedPatient.lead.consultas_realizadas || 0}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <HistoricoConsultas pacienteId={selectedPatient.id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-white hover:bg-gray-50 border-purple-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
      </div>

      {/* Container principal inspirado na imagem */}
      <div className="max-w-6xl mx-auto">
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
                  onClick={handleConsultasClick}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Consultas
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-200"
                  onClick={handlePatientProfile}
                >
                  Perfil do Paciente
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-200"
                  onClick={handleConsultationHistory}
                >
                  Histórico de Consultas
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-200"
                  onClick={handleNutritionalReport}
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
                      onClick={handleEditPatient}
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
                    Fotos ({photos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-3">Perfil</h4>
                      <div className="grid grid-cols-4 gap-3">
                        {getPhotosByType('perfil').slice(0, 3).map((photo) => (
                          <div key={photo.id} className="aspect-square bg-white/30 rounded-lg overflow-hidden relative group">
                            <img 
                              src={photo.url} 
                              alt="Foto de perfil"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deletePhoto(photo.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {getPhotosByType('perfil').length < 4 && (
                          <div 
                            className="aspect-square bg-white/30 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300 cursor-pointer hover:bg-white/40 transition-colors"
                            onClick={() => handleAddPhoto('perfil')}
                          >
                            <Camera className="h-8 w-8 text-purple-100" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-3">Antes e Depois</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-center mb-2">
                            <span className="text-xs text-purple-100">Antes ({getPhotosByType('antes').length})</span>
                          </div>
                          {getPhotosByType('antes').length > 0 ? (
                            <div className="aspect-square bg-white/30 rounded-lg overflow-hidden relative group">
                              <img 
                                src={getPhotosByType('antes')[0].url} 
                                alt="Foto antes"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deletePhoto(getPhotosByType('antes')[0].id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div 
                              className="aspect-square bg-white/30 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300 cursor-pointer hover:bg-white/40 transition-colors"
                              onClick={() => handleAddPhoto('antes')}
                            >
                              <div className="text-center">
                                <Camera className="h-6 w-6 text-purple-100 mx-auto mb-1" />
                                <span className="text-xs text-purple-100">Antes</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-center mb-2">
                            <span className="text-xs text-purple-100">Depois ({getPhotosByType('depois').length})</span>
                          </div>
                          {getPhotosByType('depois').length > 0 ? (
                            <div className="aspect-square bg-white/30 rounded-lg overflow-hidden relative group">
                              <img 
                                src={getPhotosByType('depois')[0].url} 
                                alt="Foto depois"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deletePhoto(getPhotosByType('depois')[0].id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div 
                              className="aspect-square bg-white/30 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300 cursor-pointer hover:bg-white/40 transition-colors"
                              onClick={() => handleAddPhoto('depois')}
                            >
                              <div className="text-center">
                                <Camera className="h-6 w-6 text-purple-100 mx-auto mb-1" />
                                <span className="text-xs text-purple-100">Depois</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-white/20 hover:bg-white/30 border-purple-300 text-white"
                        onClick={() => handleAddPhoto('progresso')}
                      >
                        Adicionar Foto
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-white/20 hover:bg-white/30 border-purple-300 text-white"
                          >
                            Ver Todas ({photos.length})
                          </Button>
                        </DialogTrigger>
                         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                           <DialogHeader>
                             <DialogTitle>Todas as Fotos - {selectedPatient.lead.nome}</DialogTitle>
                           </DialogHeader>
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                             {photos.map((photo) => (
                               <div key={photo.id} className="space-y-2">
                                 <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                                   <img 
                                     src={photo.url} 
                                     alt={photo.descricao}
                                     className="w-full h-full object-cover"
                                   />
                                   <Button
                                     size="sm"
                                     variant="destructive"
                                     className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                     onClick={() => deletePhoto(photo.id)}
                                   >
                                     <X className="h-4 w-4" />
                                   </Button>
                                 </div>
                                 <div className="text-sm">
                                   <Badge variant="secondary" className="text-xs">
                                     {photo.tipo}
                                   </Badge>
                                   <p className="text-gray-600 mt-1 text-xs">
                                     {format(new Date(photo.created_at), 'dd/MM/yyyy')}
                                   </p>
                                 </div>
                               </div>
                             ))}
                             {photos.length === 0 && (
                               <div className="col-span-full text-center py-8 text-gray-500">
                                 <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                 <p>Nenhuma foto adicionada ainda</p>
                               </div>
                             )}
                           </div>
                         </DialogContent>
                       </Dialog>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </div>
           </CardContent>
         </Card>
       </div>
      
      {/* Dialog para adicionar foto */}
      <Dialog open={showAddPhotoDialog} onOpenChange={setShowAddPhotoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Foto - {selectedPhotoType}</DialogTitle>
            <DialogDescription>
              Faça upload ou cole o URL de uma nova foto para o paciente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              value=""
              onChange={handlePhotoUpload}
              label={`Foto ${selectedPhotoType}`}
              placeholder="Cole o URL da imagem ou faça upload"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar dados do paciente */}
      <Dialog open={showEditPatientDialog} onOpenChange={setShowEditPatientDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Dados do Paciente</DialogTitle>
            <DialogDescription>
              Altere as informações do paciente conforme necessário
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Seção de Foto de Perfil */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-800 mb-4">Foto de Perfil</h3>
              <ImageUpload
                value={editingData.foto_perfil}
                onChange={(url) => setEditingData({...editingData, foto_perfil: url})}
                label="Foto de Perfil"
                placeholder="Cole o URL da imagem ou faça upload de uma nova foto"
              />
            </div>

            {/* Dados pessoais e outros campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dados pessoais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Dados Pessoais</h3>
              
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={editingData.nome}
                    onChange={(e) => setEditingData({...editingData, nome: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={editingData.telefone}
                    onChange={(e) => setEditingData({...editingData, telefone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingData.email}
                    onChange={(e) => setEditingData({...editingData, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={editingData.data_nascimento}
                    onChange={(e) => setEditingData({...editingData, data_nascimento: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select value={editingData.sexo} onValueChange={(value) => setEditingData({...editingData, sexo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dados físicos e localização */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Dados Físicos e Localização</h3>
                
                <div>
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    value={editingData.peso}
                    onChange={(e) => setEditingData({...editingData, peso: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    value={editingData.altura}
                    onChange={(e) => setEditingData({...editingData, altura: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="objetivo">Objetivo</Label>
                  <Select value={editingData.objetivo} onValueChange={(value) => setEditingData({...editingData, objetivo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Perda de Peso">Perda de Peso</SelectItem>
                      <SelectItem value="Ganho de Massa">Ganho de Massa</SelectItem>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                      <SelectItem value="Definição">Definição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={editingData.cidade}
                    onChange={(e) => setEditingData({...editingData, cidade: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={editingData.estado}
                    onChange={(e) => setEditingData({...editingData, estado: e.target.value})}
                  />
                </div>
              </div>

              {/* Anotações - span full width */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="anotacoes">Anotações</Label>
                  <Textarea
                    id="anotacoes"
                    value={editingData.anotacoes}
                    onChange={(e) => setEditingData({...editingData, anotacoes: e.target.value})}
                    placeholder="Observações sobre o paciente..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSavePatientData} className="flex-1 bg-purple-600 hover:bg-purple-700">
              Salvar Alterações
            </Button>
            <Button onClick={() => setShowEditPatientDialog(false)} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
