
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

      // PASSO 1: Verificar se já existe um registro para este paciente
      console.log('1. Verificando registro existente para paciente:', selectedPatientId);
      
      const { data: existingRecords, error: selectError } = await supabase
        .from('envios_programados')
        .select('*')
        .eq('paciente_id', selectedPatientId);

      if (selectError) {
        console.error('Erro ao verificar registro existente:', selectError);
        throw selectError;
      }

      console.log('Registros encontrados:', existingRecords);

      // PASSO 2: Se existe registro (array com ao menos 1 item), fazer PATCH
      if (existingRecords && existingRecords.length > 0) {
        console.log('2. Registro encontrado, fazendo PATCH para atualizar');
        
        const updateData = {
          envio_diario: true,
          envio_semanal: false,
          ativo: true
        };

        const { error: updateError } = await supabase
          .from('envios_programados')
          .update(updateData)
          .eq('paciente_id', selectedPatientId);

        if (updateError) {
          console.error('Erro ao atualizar registro:', updateError);
          throw updateError;
        }

        console.log('✅ Registro atualizado com sucesso');
        toast({
          title: "Sucesso",
          description: "Envio diário atualizado com sucesso"
        });

      } else {
        // PASSO 3: Se array vazio, fazer POST (inserção normal)
        console.log('3. Nenhum registro encontrado, fazendo POST para inserir');
        
        const insertData = {
          paciente_id: selectedPatientId,
          envio_diario: true,
          envio_semanal: false,
          ativo: true
        };

        console.log('Dados para inserção:', insertData);

        const { error: insertError } = await supabase
          .from('envios_programados')
          .insert(insertData);

        if (insertError) {
          console.error('Erro ao inserir registro:', insertError);
          throw insertError;
        }

        console.log('✅ Registro inserido com sucesso');
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
