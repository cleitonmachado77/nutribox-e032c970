-- Create table for Twilio subaccounts
CREATE TABLE public.user_twilio_subaccounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subaccount_sid TEXT NOT NULL UNIQUE,
  subaccount_token TEXT NOT NULL,
  friendly_name TEXT NOT NULL,
  consultorio_nome TEXT NOT NULL,
  cidade TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_twilio_subaccounts ENABLE ROW LEVEL SECURITY;

-- Create policies for subaccounts
CREATE POLICY "Users can create their own subaccounts" 
ON public.user_twilio_subaccounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own subaccounts" 
ON public.user_twilio_subaccounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subaccounts" 
ON public.user_twilio_subaccounts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add subaccount_sid column to user_twilio_numbers table
ALTER TABLE public.user_twilio_numbers 
ADD COLUMN subaccount_sid TEXT;

-- Create index for better performance
CREATE INDEX idx_user_twilio_subaccounts_user_id ON public.user_twilio_subaccounts(user_id);
CREATE INDEX idx_user_twilio_subaccounts_subaccount_sid ON public.user_twilio_subaccounts(subaccount_sid);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_user_twilio_subaccounts_updated_at
BEFORE UPDATE ON public.user_twilio_subaccounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();