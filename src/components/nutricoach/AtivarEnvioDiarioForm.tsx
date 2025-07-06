
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  name: string;
}

interface AtivarEnvioDiarioFormProps {
  patients: Patient[];
  onSuccess?: () => void;
}

export const AtivarEnvioDiarioForm = ({ patients, onSuccess }: AtivarEnvioDiarioFormProps) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAtivarEnvio = async () => {
    if (!selectedPatientId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um paciente",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Verificar se já existe um registro para este paciente
      const { data: existingRecord } = await supabase
        .from('envios_programados')
        .select('id')
        .eq('paciente_id', selectedPatientId)
        .single();

      if (existingRecord) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('envios_programados')
          .update({
            envio_diario: true,
            envio_semanal: false,
            ativo: true
          })
          .eq('paciente_id', selectedPatientId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Envio diário atualizado com sucesso"
        });
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('envios_programados')
          .insert({
            paciente_id: selectedPatientId,
            envio_diario: true,
            envio_semanal: false,
            ativo: true
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Envio diário ativado com sucesso"
        });
      }

      setSelectedPatientId('');
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao ativar envio diário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ativar Envio Diário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Paciente</label>
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um paciente" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleAtivarEnvio}
          disabled={loading || !selectedPatientId}
          className="w-full"
        >
          {loading ? "Ativando..." : "Ativar Envio"}
        </Button>
      </CardContent>
    </Card>
  );
};
