import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { Search, Phone, Calendar, TrendingUp, MessageCircle, Star, Award, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PatientData {
  id: string;
  nome: string;
  telefone: string;
  objetivo: string;
  peso: string;
  altura: string;
  imc: string;
  status: string;
  progresso: number;
  ultima_consulta: string;
  proxima_consulta: string;
}

interface PatientResponse {
  id: string;
  patient_name: string;
  patient_phone: string;
  question_category: string;
  response_score: number;
  response_date: string;
}

export default function PainelPaciente() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [responses, setResponses] = useState<PatientResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPatients();
      loadResponses();
    }
  }, [user]);

  const loadPatients = async () => {
    // Buscar pacientes com seus dados dos leads
    const { data } = await supabase
      .from('pacientes')
      .select(`
        id,
        data_primeira_consulta,
        status_tratamento,
        lead:leads!inner(
          id,
          nome,
          telefone,
          objetivo,
          peso,
          altura,
          imc,
          status,
          foto_perfil
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      const formattedPatients = data.map((p: any) => ({
        id: p.id,
        nome: p.lead.nome,
        telefone: p.lead.telefone,
        objetivo: p.lead.objetivo,
        peso: p.lead.peso,
        altura: p.lead.altura,
        imc: p.lead.imc,
        status: p.status_tratamento || p.lead.status,
        foto_perfil: p.lead.foto_perfil,
        data_primeira_consulta: p.data_primeira_consulta,
        progresso: 0,
        ultima_consulta: '',
        proxima_consulta: ''
      }));
      setPatients(formattedPatients);
    }
    setLoading(false);
  };

  const loadResponses = async () => {
    const { data } = await supabase
      .from('coach_responses')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (data) setResponses(data);
  };

  const filteredPatients = patients.filter(patient =>
    patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telefone?.includes(searchTerm)
  );

  const getPatientResponses = (patientPhone: string) => {
    return responses.filter(r => r.patient_phone === patientPhone);
  };

  const getPatientAvgScore = (patientPhone: string) => {
    const patientResponses = getPatientResponses(patientPhone);
    if (patientResponses.length === 0) return 0;
    
    const sum = patientResponses.reduce((acc, r) => acc + (r.response_score || 0), 0);
    return Math.round((sum / patientResponses.length) * 50); // Convert to percentage
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <Header title="Painel do Paciente" description="Acompanhe o progresso dos seus pacientes" />
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header 
        title="Painel do Paciente" 
        description="Acompanhe o progresso e engajamento dos seus pacientes"
      />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const avgScore = getPatientAvgScore(patient.telefone);
          const patientResponses = getPatientResponses(patient.telefone);
          
          return (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{patient.nome}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {patient.telefone}
                    </div>
                  </div>
                  <Badge className={getStatusColor(patient.status || 'novo')}>
                    {patient.status || 'novo'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Objective */}
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{patient.objetivo || 'Não definido'}</span>
                </div>

                {/* Physical Data */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{patient.peso || '-'}</div>
                    <div className="text-muted-foreground">Peso</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{patient.altura || '-'}</div>
                    <div className="text-muted-foreground">Altura</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{patient.imc || '-'}</div>
                    <div className="text-muted-foreground">IMC</div>
                  </div>
                </div>

                {/* Engagement Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Engajamento
                    </span>
                    <span className="font-medium">{avgScore}%</span>
                  </div>
                  <Progress 
                    value={avgScore} 
                    className="h-2"
                  />
                </div>

                {/* Response Count */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    Respostas
                  </span>
                  <span className="font-medium">{patientResponses.length}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum paciente encontrado</p>
          </CardContent>
        </Card>
      )}

      {/* Patient Detail Modal/Sidebar could be added here */}
      {selectedPatient && (
        <Card className="fixed inset-4 z-50 overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalhes - {selectedPatient.nome}</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedPatient(null)}
              >
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Patient responses history */}
              <div>
                <h4 className="font-medium mb-3">Histórico de Respostas</h4>
                <div className="space-y-2">
                  {getPatientResponses(selectedPatient.telefone).map((response, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <div className="font-medium text-sm">{response.question_category}</div>
                        <div className="text-xs text-muted-foreground">{response.response_date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Pontuação:</span>
                        <Badge variant={response.response_score >= 2 ? 'default' : 'destructive'}>
                          {response.response_score}/2
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}