
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, UserCheck, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

interface MonitoredPatient {
  id: string;
  patient_id: string;
  patient_name: string;
  envio_diario: boolean;
  envio_semanal: boolean;
  ativo: boolean;
}

interface PatientSelectionCardProps {
  patients: Patient[];
  onSuccess?: () => void;
}

export const PatientSelectionCard = ({ patients, onSuccess }: PatientSelectionCardProps) => {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [monitoredPatients, setMonitoredPatients] = useState<MonitoredPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMonitored, setLoadingMonitored] = useState(false);
  const { toast } = useToast();

  const loadMonitoredPatients = async () => {
    try {
      setLoadingMonitored(true);
      const { data, error } = await supabase
        .from('envios_programados')
        .select(`
          *,
          pacientes!inner(
            id,
            leads!inner(nome)
          )
        `)
        .eq('ativo', true);

      if (error) throw error;

      const formatted: MonitoredPatient[] = (data || []).map(item => ({
        id: item.id,
        patient_id: item.paciente_id,
        patient_name: (item as any).pacientes?.leads?.nome || 'Nome não encontrado',
        envio_diario: item.envio_diario || false,
        envio_semanal: item.envio_semanal || false,
        ativo: item.ativo || false
      }));

      setMonitoredPatients(formatted);
    } catch (error: any) {
      console.error('Erro ao carregar pacientes monitorados:', error);
    } finally {
      setLoadingMonitored(false);
    }
  };

  useEffect(() => {
    loadMonitoredPatients();
  }, []);

  const handlePatientToggle = (patientId: string) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleActivateCoaching = async () => {
    if (selectedPatients.length === 0) {
      toast({
        title: "Nenhum paciente selecionado",
        description: "Selecione pelo menos um paciente para ativar o acompanhamento.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const insertPromises = selectedPatients.map(async (patientId) => {
        const { data: existing } = await supabase
          .from('envios_programados')
          .select('id')
          .eq('paciente_id', patientId)
          .single();

        if (existing) {
          return supabase
            .from('envios_programados')
            .update({
              envio_diario: true,
              envio_semanal: false,
              ativo: true
            })
            .eq('paciente_id', patientId);
        } else {
          return supabase
            .from('envios_programados')
            .insert({
              paciente_id: patientId,
              envio_diario: true,
              envio_semanal: false,
              ativo: true
            });
        }
      });

      await Promise.all(insertPromises);

      toast({
        title: "Acompanhamento ativado",
        description: `Envio diário ativado para ${selectedPatients.length} paciente(s)`
      });

      setSelectedPatients([]);
      loadMonitoredPatients();
      onSuccess?.();
    } catch (error: any) {
      console.error('Erro ao ativar acompanhamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao ativar acompanhamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivatePatient = async (monitoredPatientId: string) => {
    try {
      const { error } = await supabase
        .from('envios_programados')
        .update({ ativo: false })
        .eq('id', monitoredPatientId);

      if (error) throw error;

      toast({
        title: "Acompanhamento desativado",
        description: "Paciente removido do acompanhamento diário"
      });

      loadMonitoredPatients();
    } catch (error: any) {
      console.error('Erro ao desativar acompanhamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao desativar acompanhamento",
        variant: "destructive"
      });
    }
  };

  // Filter out patients that are already being monitored
  const availablePatients = patients.filter(
    patient => !monitoredPatients.some(mp => mp.patient_id === patient.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Seção de Seleção de Pacientes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Ativar Acompanhamento
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecione os pacientes para ativar o envio diário de questionários
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {availablePatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {patients.length === 0 
                  ? "Nenhum paciente cadastrado" 
                  : "Todos os pacientes já estão em acompanhamento"
                }
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {availablePatients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedPatients.includes(patient.id)}
                      onCheckedChange={() => handlePatientToggle(patient.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{patient.name}</p>
                    </div>
                    <Badge variant={patient.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedPatients.length} de {availablePatients.length} selecionados
                </p>
                <Button 
                  onClick={handleActivateCoaching}
                  disabled={loading || selectedPatients.length === 0}
                  size="sm"
                  className="min-w-32"
                >
                  {loading ? "Ativando..." : "Ativar"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Seção de Pacientes em Acompanhamento */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="w-5 h-5 text-green-600" />
            Em Acompanhamento
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pacientes com envio diário ativo ({monitoredPatients.length})
          </p>
        </CardHeader>
        <CardContent>
          {loadingMonitored ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Carregando...</p>
            </div>
          ) : monitoredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhum paciente em acompanhamento</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {monitoredPatients.map((patient) => (
                <div 
                  key={patient.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{patient.patient_name}</p>
                    <div className="flex gap-2 mt-1">
                      {patient.envio_diario && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          Diário
                        </Badge>
                      )}
                      {patient.envio_semanal && (
                        <Badge variant="secondary" className="text-xs">
                          Semanal
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeactivatePatient(patient.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Desativar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
