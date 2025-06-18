
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = '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';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      action, 
      patientName, 
      patientPhone, 
      messageType, 
      patientData,
      conversationHistory 
    } = await req.json();

    console.log('NutriCoach AI Request:', { action, patientName, messageType });

    let systemPrompt = '';
    let userMessage = '';

    switch (action) {
      case 'generate_questionnaire':
        systemPrompt = `Você é o NutriCoach, um assistente virtual especializado em nutrição. 
        Sua função é enviar questionários comportamentais personalizados para pacientes.
        Seja empático, motivacional e use emojis apropriados.
        Mantenha um tom amigável mas profissional.`;
        
        userMessage = `Gere um questionário comportamental para ${patientName}. 
        Inclua perguntas sobre consistência no plano alimentar, frequência de refeições, 
        tempo de refeição, consumo de vegetais/frutas e ingestão de líquidos.
        Use escala de 1-3 ou sim/não para facilitar as respostas.`;
        break;

      case 'generate_motivational':
        systemPrompt = `Você é o NutriCoach, um assistente virtual especializado em nutrição.
        Sua função é enviar mensagens motivacionais personalizadas.
        Seja positivo, encorajador e use emojis apropriados.`;
        
        userMessage = `Gere uma mensagem motivacional para ${patientName}.
        A mensagem deve ser inspiradora e focada na jornada nutricional.
        Mantenha entre 2-3 linhas e inclua emojis relevantes.`;
        break;

      case 'generate_reminder':
        systemPrompt = `Você é o NutriCoach, um assistente virtual especializado em nutrição.
        Sua função é enviar lembretes úteis sobre hábitos alimentares.
        Seja útil, claro e use emojis apropriados.`;
        
        userMessage = `Gere um lembrete de ${messageType || 'hidratação'} para ${patientName}.
        O lembrete deve ser prático e motivador.
        Mantenha conciso e inclua emojis relevantes.`;
        break;

      case 'analyze_responses':
        systemPrompt = `Você é o NutriCoach, um assistente virtual especializado em nutrição.
        Analise as respostas do questionário e forneça feedback construtivo.
        Identifique pontos fortes e áreas de melhoria.`;
        
        userMessage = `Analise as respostas do questionário de ${patientName}: ${JSON.stringify(patientData)}.
        Forneça feedback personalizado destacando progressos e sugerindo melhorias.`;
        break;

      default:
        throw new Error('Ação não reconhecida');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedMessage = data.choices[0].message.content;

    // Salvar interação no banco de dados
    if (patientPhone) {
      await supabase
        .from('whatsapp_coach_interactions')
        .insert({
          patient_phone: patientPhone,
          patient_name: patientName,
          action_type: action,
          generated_message: generatedMessage,
          patient_data: patientData || null,
          created_at: new Date().toISOString()
        });
    }

    console.log('Generated message:', generatedMessage);

    return new Response(JSON.stringify({ 
      message: generatedMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in nutricoach-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
