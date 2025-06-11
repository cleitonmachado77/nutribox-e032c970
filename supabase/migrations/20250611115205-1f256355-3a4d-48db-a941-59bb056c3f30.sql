
-- Criar tabela para fotos dos pacientes
CREATE TABLE public.patient_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL,
  user_id uuid NOT NULL,
  url text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('perfil', 'antes', 'depois', 'progresso')),
  descricao text,
  data timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.patient_photos ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas suas próprias fotos
CREATE POLICY "Users can view their own patient photos" 
  ON public.patient_photos 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários insiram suas próprias fotos
CREATE POLICY "Users can create their own patient photos" 
  ON public.patient_photos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem suas próprias fotos
CREATE POLICY "Users can update their own patient photos" 
  ON public.patient_photos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem suas próprias fotos
CREATE POLICY "Users can delete their own patient photos" 
  ON public.patient_photos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX idx_patient_photos_patient_id ON public.patient_photos(patient_id);
CREATE INDEX idx_patient_photos_user_id ON public.patient_photos(user_id);
CREATE INDEX idx_patient_photos_tipo ON public.patient_photos(tipo);
