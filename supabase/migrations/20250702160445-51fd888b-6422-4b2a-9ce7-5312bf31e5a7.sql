-- Create user Twilio numbers management table
CREATE TABLE public.user_twilio_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  twilio_phone_number TEXT NOT NULL UNIQUE,
  twilio_phone_sid TEXT NOT NULL,
  consultorio_nome TEXT NOT NULL,
  cidade TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_twilio_numbers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own numbers" 
ON public.user_twilio_numbers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own numbers" 
ON public.user_twilio_numbers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own numbers" 
ON public.user_twilio_numbers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add user_id to whatsapp_conversations if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whatsapp_conversations' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.whatsapp_conversations 
        ADD COLUMN user_id UUID;
    END IF;
END $$;

-- Update whatsapp_conversations RLS to use user_id properly
DROP POLICY IF EXISTS "Users can manage their own conversations" ON public.whatsapp_conversations;
CREATE POLICY "Users can manage their own conversations" 
ON public.whatsapp_conversations 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamps
CREATE TRIGGER update_user_twilio_numbers_updated_at
BEFORE UPDATE ON public.user_twilio_numbers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();