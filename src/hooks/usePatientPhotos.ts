
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PatientPhoto {
  id: string;
  patient_id: string;
  user_id: string;
  url: string;
  tipo: 'perfil' | 'antes' | 'depois' | 'progresso';
  data: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export const usePatientPhotos = (patientId: string) => {
  const [photos, setPhotos] = useState<PatientPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patient_photos')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar fotos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar fotos do paciente",
          variant: "destructive"
        });
        return;
      }

      // Type assertion para garantir que os tipos estão corretos
      setPhotos((data || []) as PatientPhoto[]);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar fotos do paciente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPhoto = async (url: string, tipo: 'perfil' | 'antes' | 'depois' | 'progresso', descricao?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      // Se for foto de perfil, remover a foto de perfil anterior
      if (tipo === 'perfil') {
        await supabase
          .from('patient_photos')
          .delete()
          .eq('patient_id', patientId)
          .eq('tipo', 'perfil');
      }

      const { data, error } = await supabase
        .from('patient_photos')
        .insert([{
          patient_id: patientId,
          user_id: user.id,
          url,
          tipo,
          descricao: descricao || `Foto ${tipo} - ${new Date().toLocaleDateString('pt-BR')}`,
          data: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar foto:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar foto",
          variant: "destructive"
        });
        return;
      }

      // Type assertion para o novo item
      setPhotos(prev => [data as PatientPhoto, ...prev]);
      toast({
        title: "Sucesso!",
        description: "Foto adicionada com sucesso"
      });

    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar foto",
        variant: "destructive"
      });
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('patient_photos')
        .delete()
        .eq('id', photoId);

      if (error) {
        console.error('Erro ao deletar foto:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover foto",
          variant: "destructive"
        });
        return;
      }

      setPhotos(prev => prev.filter(p => p.id !== photoId));
      toast({
        title: "Foto removida",
        description: "A foto foi removida da galeria"
      });

    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover foto",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (patientId) {
      loadPhotos();
    }
  }, [patientId]);

  return {
    photos,
    isLoading,
    addPhoto,
    deletePhoto,
    refreshPhotos: loadPhotos
  };
};
