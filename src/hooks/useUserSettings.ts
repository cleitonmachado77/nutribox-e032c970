
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserSettings {
  id: string;
  user_id: string;
  google_calendar_link?: string;
  whatsapp_business_number?: string;
  created_at: string;
  updated_at: string;
}

export const useUserSettings = () => {
  return useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user settings:', error);
        throw error;
      }

      return data as UserSettings | null;
    },
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Primeiro, verificar se já existe uma configuração para o usuário
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;

      if (existingSettings) {
        // Atualizar configuração existente
        const { data, error } = await supabase
          .from('user_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating user settings:', error);
          throw error;
        }
        result = data;
      } else {
        // Criar nova configuração
        const { data, error } = await supabase
          .from('user_settings')
          .insert([
            {
              user_id: user.id,
              ...settings,
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Error creating user settings:', error);
          throw error;
        }
        result = data;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
  });
};
