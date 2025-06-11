import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, Phone, Mail, MapPin, Calendar, Heart, CheckCircle, History, 
  StickyNote, Camera, FileText, ShoppingCart, Stethoscope, Target,
  TrendingUp, Clock, User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { useToast } from "@/hooks/use-toast";
import { usePatientPhotos } from "@/hooks/usePatientPhotos";

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
  const [anotacoes, setAnotacoes] = useState(selectedPatient.lead.anotacoes || "");
  const { photos } = usePatientPhotos(selectedPatient.id);
  const [clinicalHistory, setClinicalHistory] = useState<any>({});
  const [consultasRealizadas, setConsultasRealizadas] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedClinicalHistory = localStorage.getItem(`patient_clinical_${selectedPatient.id}`);
    if (savedClinicalHistory) {
      setClinicalHistory(JSON.parse(savedClinicalHistory));
    }

    const savedConsultas = localStorage.getItem(`patient_consultas_${selectedPatient.id}`);
    if (savedConsultas) {
      setConsultasRealizadas(JSON.parse(savedConsultas));
    }
  }, [selectedPatient.id]);

  const handleSaveAnotacoes = () => {
    // Simular salvamento das anotações
    localStorage.setItem(`patient_anotacoes_${selectedPatient.id}`, anotacoes);
    toast({
      title: "Sucesso!",
      description: "Anotações salvas com sucesso"
    });
  };

  const getLastConsulta = () => {
    if (consultasRealizadas.length === 0) return null;
    return consultasRealizadas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
  };

  const hasPlanoAlimentar = () => {
    const savedPlan = localStorage.getItem(`patient_plan_${selectedPatient.id}`);
    return savedPlan && savedPlan.trim().length > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header do Paciente - Redesenhado */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 rounded-2xl text-white shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-white/30 shadow-2xl">
              <AvatarImage src={selectedPatient.lead.foto_perfil} className="object-cover" />
              <AvatarFallback className="text-3xl bg-white/20 text-white backdrop-blur-sm">
                {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{selectedPatient.lead.nome}</h1>
            <div className="flex flex-wrap items-center gap-4 text-purple-100">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {selectedPatient.lead.cidade}, {selectedPatient.lead.estado}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Paciente desde {new Date(selectedPatient.lead.data_conversao || '').toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {consultasRealizadas.length} consultas realizadas
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <Badge className={`${getObjetivoColor(selectedPatient.lead.objetivo)} text-sm px-3 py-1`}>
                <Target className="w-4 h-4 mr-1" />
                {selectedPatient.lead.objetivo}
              </Badge>
              <Badge className={`${getStatusColor(selectedPatient.status_tratamento)} text-sm px-3 py-1`}>
                {selectedPatient.status_tratamento === 'ativo' ? 'Em Tratamento' : 'Inativo'}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-1">{selectedPatient.lead.progresso}%</div>
              <div className="text-purple-200 text-sm">Progresso Geral</div>
              <div className="mt-3 bg-white/20 rounded-full h-2 w-24">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500" 
                  style={{ width: `${selectedPatient.lead.progresso}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Rápido - Cards de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{photos.length}</div>
            <div className="text-sm text-purple-600">Fotos do Progresso</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
          <CardContent className="p-4 text-center">
            <Stethoscope className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{consultasRealizadas.length}</div>
            <div className="text-sm text-purple-600">Consultas Realizadas</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{hasPlanoAlimentar() ? '1' : '0'}</div>
            <div className="text-sm text-purple-600">Plano Alimentar</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">
              {selectedPatient.lead.imc || 'N/A'}
            </div>
            <div className="text-sm text-purple-600">IMC Atual</div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados Básicos */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Telefone:</span> 
              <span className="text-purple-800">{selectedPatient.lead.telefone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Email:</span> 
              <span className="text-purple-800">{selectedPatient.lead.email || 'Não informado'}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Localização:</span> 
              <span className="text-purple-800">{selectedPatient.lead.cidade}, {selectedPatient.lead.estado}</span>
            </div>
          </CardContent>
        </Card>

        {/* Dados Corporais */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Dados Corporais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div><span className="font-medium">Peso:</span> <span className="text-purple-800">{selectedPatient.lead.peso || 'Não informado'}</span></div>
            <div><span className="font-medium">Altura:</span> <span className="text-purple-800">{selectedPatient.lead.altura || 'Não informado'}</span></div>
            <div><span className="font-medium">IMC:</span> <span className="text-purple-800">{selectedPatient.lead.imc || 'Não calculado'}</span></div>
            <div><span className="font-medium">Progresso:</span> 
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(selectedPatient.lead.progresso)} transition-all duration-500`}
                    style={{ width: `${selectedPatient.lead.progresso}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-purple-800">{selectedPatient.lead.progresso}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo das Seções */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico Clínico Resumo */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Resumo Clínico
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {Object.keys(clinicalHistory).length > 0 ? (
              <div className="space-y-3">
                {clinicalHistory.alergias && (
                  <div>
                    <span className="font-medium text-purple-800">Alergias:</span>
                    <p className="text-sm text-gray-600 mt-1">{clinicalHistory.alergias}</p>
                  </div>
                )}
                {clinicalHistory.medicamentos && (
                  <div>
                    <span className="font-medium text-purple-800">Medicamentos:</span>
                    <p className="text-sm text-gray-600 mt-1">{clinicalHistory.medicamentos}</p>
                  </div>
                )}
                {clinicalHistory.restricoes && (
                  <div>
                    <span className="font-medium text-purple-800">Restrições:</span>
                    <p className="text-sm text-gray-600 mt-1">{clinicalHistory.restricoes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum histórico clínico registrado</p>
            )}
          </CardContent>
        </Card>

        {/* Últimas Fotos */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Galeria de Fotos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {photos.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(0, 6).map((photo) => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border-2 border-purple-200">
                      <img src={photo.url} alt={photo.descricao} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-sm text-purple-600">
                    {photos.length > 6 ? `+${photos.length - 6} fotos` : `${photos.length} fotos`}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma foto adicionada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Última Consulta */}
      {getLastConsulta() && (
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Última Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-purple-800">Data:</span>
                <p className="text-gray-600">{new Date(getLastConsulta().data).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <span className="font-medium text-purple-800">Peso:</span>
                <p className="text-gray-600">{getLastConsulta().peso || 'Não informado'}</p>
              </div>
              <div>
                <span className="font-medium text-purple-800">IMC:</span>
                <p className="text-gray-600">{getLastConsulta().imc || 'Não calculado'}</p>
              </div>
            </div>
            {getLastConsulta().observacoes && (
              <div className="mt-4">
                <span className="font-medium text-purple-800">Observações:</span>
                <p className="text-gray-600 mt-1">{getLastConsulta().observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={onOpenConsultaDialog}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Registrar Consulta
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const tab = document.querySelector('[value="fotos"]') as HTMLElement;
                tab?.click();
              }}
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Adicionar Fotos
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const tab = document.querySelector('[value="plano"]') as HTMLElement;
                tab?.click();
              }}
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Editar Plano
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const tab = document.querySelector('[value="historico"]') as HTMLElement;
                tab?.click();
              }}
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              <History className="w-4 h-4 mr-2" />
              Ver Histórico
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Anotações do Profissional */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Anotações do Profissional
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea 
            placeholder="Adicione suas anotações sobre o paciente..." 
            value={anotacoes} 
            onChange={(e) => setAnotacoes(e.target.value)}
            className="min-h-32 border-2 border-purple-200 focus:border-purple-500 focus-visible:ring-purple-500" 
          />
          <Button 
            onClick={handleSaveAnotacoes}
            className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <StickyNote className="w-4 h-4 mr-2" />
            Salvar Anotações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
