
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ObjetivoTag {
  id: string;
  nome: string;
  cor: string;
  user_id: string;
  created_at: string;
}

export const useObjetivoTags = () => {
  return useQuery({
    queryKey: ['objetivo-tags'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('objetivo_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });

      if (error) {
        console.error('Error fetching objetivo tags:', error);
        throw error;
      }

      return data as ObjetivoTag[];
    },
  });
};

export const useCreateObjetivoTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tagData: { nome: string; cor: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('objetivo_tags')
        .insert([
          {
            ...tagData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating objetivo tag:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objetivo-tags'] });
    },
  });
};
