
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, patientName, patientPhone, messageType, patientData } = await req.json()

    console.log('NutriCoach AI request:', { action, patientName, patientPhone, messageType })

    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    let prompt = '';
    let generatedMessage = '';

    switch (action) {
      case 'generate_questionnaire':
        prompt = `Você é um NutriCoach especialista em nutrição. Crie um questionário personalizado para o paciente ${patientName} focado em hábitos alimentares, objetivos nutricionais e estilo de vida. O questionário deve ter 5-7 perguntas objetivas e ser enviado via WhatsApp. Seja direto e profissional.`;
        break;
      
      case 'generate_motivational':
        prompt = `Você é um NutriCoach motivacional. Crie uma mensagem motivacional personalizada para ${patientName} sobre nutrição e bem-estar. A mensagem deve ser positiva, encorajadora e incluir uma dica prática de nutrição. Máximo 150 palavras.`;
        break;
      
      case 'generate_reminder':
        prompt = `Você é um NutriCoach assistente. Crie um lembrete amigável para ${patientName} sobre ${messageType || 'cuidados nutricionais'}. O lembrete deve ser útil e motivador. Máximo 100 palavras.`;
        break;
      
      case 'analyze_responses':
        prompt = `Você é um NutriCoach analista. Analise as respostas do paciente ${patientName}: ${JSON.stringify(patientData)}. Forneça insights sobre hábitos alimentares e recomendações personalizadas. Seja específico e prático.`;
        break;
      
      default:
        throw new Error('Ação não reconhecida');
    }

    // Chamar OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um NutriCoach especialista em nutrição, sempre responda em português brasileiro de forma profissional e empática.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    generatedMessage = openaiData.choices[0].message.content

    console.log('Generated message:', generatedMessage)

    // Salvar interação no banco
    const { error: insertError } = await supabase
      .from('whatsapp_coach_interactions')
      .insert({
        patient_phone: patientPhone || 'N/A',
        patient_name: patientName,
        action_type: action,
        generated_message: generatedMessage,
        patient_data: patientData || null
      })

    if (insertError) {
      console.error('Error saving interaction:', insertError)
      // Não falhar a requisição por causa do erro de salvamento
    }

    // Enviar mensagem via WhatsApp (se patientPhone fornecido)
    if (patientPhone) {
      try {
        const { error: whatsappError } = await supabase.functions.invoke('whatsapp-send', {
          body: {
            to: patientPhone,
            message: generatedMessage
          }
        })

        if (whatsappError) {
          console.error('WhatsApp send error:', whatsappError)
        }
      } catch (whatsappError) {
        console.error('WhatsApp integration error:', whatsappError)
        // Não falhar por erro do WhatsApp
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: generatedMessage,
        action: action,
        patient: patientName
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('NutriCoach AI error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro interno do servidor'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
