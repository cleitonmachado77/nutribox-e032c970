
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { enviosProgramadosRest } from '@/lib/supabase-rest';

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

  // Método usando Supabase JavaScript Client (recomendado)
  // O cliente já configura automaticamente os headers corretos:
  // - apikey: chave anon
  // - Authorization: Bearer chave anon
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

      // PASSO 1: Sempre tentar PATCH primeiro
      console.log('1. Tentando PATCH para paciente:', selectedPatientId);
      
      const updateData = {
        envio_diario: true,
        envio_semanal: false,
        ativo: true
      };

      const { data: patchResult, error: patchError, count } = await supabase
        .from('envios_programados')
        .update(updateData)
        .eq('paciente_id', selectedPatientId)
        .select();

      if (patchError) {
        console.error('Erro no PATCH:', patchError);
        throw patchError;
      }

      console.log('Resultado do PATCH:', { patchResult, count });

      // PASSO 2: Se PATCH afetou registros, sucesso
      if (patchResult && patchResult.length > 0) {
        console.log('✅ PATCH bem-sucedido - registro atualizado');
        toast({
          title: "Sucesso",
          description: "Envio diário atualizado com sucesso"
        });
      } else {
        // PASSO 3: Se PATCH não afetou nenhuma linha, fazer POST
        console.log('2. PATCH não afetou registros, fazendo POST para inserir');
        
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

        console.log('✅ POST bem-sucedido - registro inserido');
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

  // Método alternativo usando REST API direta (caso necessário)
  // Headers configurados corretamente com chave anon para role 'anon'
  const handleAtivarEnvioRest = async () => {
    if (!selectedPatientId || !isValidUUID(selectedPatientId)) return;

    try {
      setLoading(true);
      
      const updateData = {
        envio_diario: true,
        envio_semanal: false,
        ativo: true
      };

      // Tentar PATCH primeiro
      try {
        const patchResult = await enviosProgramadosRest.patch(
          { paciente_id: selectedPatientId },
          updateData
        );
        
        if (patchResult.length > 0) {
          console.log('✅ PATCH REST bem-sucedido');
          toast({
            title: "Sucesso",
            description: "Envio diário atualizado com sucesso (REST)"
          });
          setSelectedPatientId('');
          onSuccess?.();
          return;
        }
      } catch (patchError) {
        console.log('PATCH REST falhou, tentando POST:', patchError);
      }

      // Se PATCH não funcionou, fazer POST
      const insertData = {
        paciente_id: selectedPatientId,
        envio_diario: true,
        envio_semanal: false,
        ativo: true
      };

      await enviosProgramadosRest.post(insertData);
      
      console.log('✅ POST REST bem-sucedido');
      toast({
        title: "Sucesso",
        description: "Envio diário ativado com sucesso (REST)"
      });

      setSelectedPatientId('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Erro REST detalhado:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao ativar envio diário (REST)",
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
