
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

  // Função para validar UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const handleAtivarEnvio = async () => {
    // Validação: paciente deve estar selecionado
    if (!selectedPatientId) {
      toast({
        title: "Erro",
        description: "Selecione um paciente antes de ativar o envio.",
        variant: "destructive"
      });
      return;
    }

    // Validação: paciente_id deve ser um UUID válido
    if (!isValidUUID(selectedPatientId)) {
      toast({
        title: "Erro",
        description: "ID do paciente inválido. Selecione um paciente válido.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Verificar se já existe um registro para este paciente
      const { data: existingRecord, error: selectError } = await supabase
        .from('envios_programados')
        .select('id')
        .eq('paciente_id', selectedPatientId)
        .maybeSingle()
        .setHeader('Accept', 'application/json');

      if (selectError) {
        console.error('Erro ao verificar registro existente:', selectError);
        throw selectError;
      }

      if (existingRecord) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('envios_programados')
          .update({
            envio_diario: true,
            envio_semanal: false,
            ativo: true
          })
          .eq('paciente_id', selectedPatientId)
          .setHeader('Accept', 'application/json')
          .setHeader('Content-Type', 'application/json');

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Envio diário atualizado com sucesso"
        });
      } else {
        // Criar novo registro com validação obrigatória
        const insertData = {
          paciente_id: selectedPatientId,
          envio_diario: true,
          envio_semanal: false,
          ativo: true
        };

        console.log('Enviando dados para inserção:', insertData);

        const { error } = await supabase
          .from('envios_programados')
          .insert(insertData)
          .setHeader('Accept', 'application/json')
          .setHeader('Content-Type', 'application/json');

        if (error) {
          console.error('Erro ao inserir registro:', error);
          throw error;
        }

        toast({
          title: "Sucesso",
          description: "Envio diário ativado com sucesso"
        });
      }

      setSelectedPatientId('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Erro detalhado ao ativar envio:', error);
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
          <label className="text-sm font-medium">
            Paciente {patients.length > 0 ? `(${patients.length} disponíveis)` : '(nenhum paciente encontrado)'}
          </label>
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
          disabled={loading || !selectedPatientId || patients.length === 0}
          className="w-full"
        >
          {loading ? "Ativando..." : "Ativar Envio"}
        </Button>
      </CardContent>
    </Card>
  );
};
