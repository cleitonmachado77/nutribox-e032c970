
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
    const { action, patientName, patientPhone, messageType, patientData, conversationHistory } = await req.json()

    console.log('NutriCoach AI request:', { action, patientName, patientPhone, messageType })

    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Buscar histórico de interações do paciente para personalização
    let patientHistory = [];
    if (patientPhone) {
      const { data: historyData } = await supabase
        .from('whatsapp_coach_interactions')
        .select('*')
        .eq('patient_phone', patientPhone)
        .order('created_at', { ascending: false })
        .limit(10);
      
      patientHistory = historyData || [];
    }

    // Buscar dados do lead/paciente para mais contexto
    let patientProfile = null;
    if (patientPhone) {
      const { data: leadData } = await supabase
        .from('leads')
        .select('*')
        .eq('telefone', patientPhone)
        .single();
      
      patientProfile = leadData;
    }

    let prompt = '';
    let generatedMessage = '';

    // Criar contexto personalizado baseado no histórico e perfil
    const personalContext = createPersonalizedContext(patientProfile, patientHistory, patientData);

    switch (action) {
      case 'generate_questionnaire':
        prompt = `Você é um NutriCoach especialista em nutrição. Crie um questionário personalizado para o paciente ${patientName} focado em hábitos alimentares, objetivos nutricionais e estilo de vida.

        Contexto do paciente: ${personalContext}
        
        O questionário deve:
        - Ter 5-7 perguntas objetivas
        - Ser adaptado ao perfil e histórico do paciente
        - Incluir perguntas sobre progresso se houver histórico
        - Ser enviado via WhatsApp
        - Ser direto e profissional
        
        Use emojis apropriados e mantenha tom motivacional.`;
        break;
      
      case 'generate_motivational':
        prompt = `Você é um NutriCoach motivacional. Crie uma mensagem motivacional personalizada para ${patientName} sobre nutrição e bem-estar.

        Contexto do paciente: ${personalContext}
        
        A mensagem deve:
        - Ser personalizada baseada no histórico e perfil
        - Ser positiva e encorajadora
        - Incluir uma dica prática de nutrição relevante
        - Reconhecer progresso se houver
        - Máximo 150 palavras
        - Usar emojis apropriados`;
        break;
      
      case 'generate_reminder':
        prompt = `Você é um NutriCoach assistente. Crie um lembrete amigável para ${patientName} sobre ${messageType || 'cuidados nutricionais'}.

        Contexto do paciente: ${personalContext}
        
        O lembrete deve:
        - Ser personalizado baseado no perfil
        - Ser útil e motivador
        - Incluir dicas específicas se relevante
        - Máximo 100 palavras
        - Usar tom amigável com emojis`;
        break;
      
      case 'analyze_responses':
        prompt = `Você é um NutriCoach analista. Analise as respostas do paciente ${patientName} e forneça insights personalizados.

        Respostas atuais: ${JSON.stringify(patientData)}
        Contexto do paciente: ${personalContext}
        
        Sua análise deve:
        - Comparar com respostas anteriores se houver
        - Identificar padrões e tendências
        - Fornecer insights sobre hábitos alimentares
        - Dar recomendações personalizadas específicas
        - Celebrar progressos e abordar desafios
        - Ser específico e prático
        - Usar tom profissional mas empático`;
        break;
      
      default:
        throw new Error('Ação não reconhecida');
    }

    // Chamar OpenAI com contexto personalizado
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um NutriCoach especialista em nutrição com IA avançada. Processe questionários comportamentais e de bem-estar, analise padrões e forneça insights personalizados. Use emojis e mantenha tom profissional e empático. Responda sempre em português brasileiro.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    generatedMessage = openaiData.choices[0].message.content

    console.log('Generated message:', generatedMessage)

    // Salvar interação no banco com contexto adicional
    const { error: insertError } = await supabase
      .from('whatsapp_coach_interactions')
      .insert({
        patient_phone: patientPhone || 'N/A',
        patient_name: patientName,
        action_type: action,
        generated_message: generatedMessage,
        patient_data: {
          ...patientData,
          patient_profile: patientProfile,
          interaction_count: patientHistory.length + 1,
          personalization_context: personalContext
        }
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
        patient: patientName,
        personalization_applied: true
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

// Função para criar contexto personalizado
function createPersonalizedContext(patientProfile: any, patientHistory: any[], currentData: any) {
  let context = '';

  if (patientProfile) {
    context += `Perfil: ${patientProfile.nome}, objetivo: ${patientProfile.objetivo || 'não definido'}`;
    if (patientProfile.peso) context += `, peso: ${patientProfile.peso}kg`;
    if (patientProfile.altura) context += `, altura: ${patientProfile.altura}cm`;
    if (patientProfile.imc) context += `, IMC: ${patientProfile.imc}`;
  }

  if (patientHistory.length > 0) {
    context += `. Histórico: ${patientHistory.length} interações anteriores`;
    
    const recentInteractions = patientHistory.slice(0, 3);
    const behaviorPatterns = analyzeBehaviorPatterns(recentInteractions);
    
    if (behaviorPatterns.length > 0) {
      context += `. Padrões comportamentais: ${behaviorPatterns.join(', ')}`;
    }
  }

  if (currentData) {
    context += `. Dados atuais: ${JSON.stringify(currentData)}`;
  }

  return context || 'Novo paciente sem histórico disponível';
}

// Função para analisar padrões comportamentais
function analyzeBehaviorPatterns(interactions: any[]) {
  const patterns = [];

  const responsiveInteractions = interactions.filter(i => i.action_type === 'analyze_responses');
  if (responsiveInteractions.length >= 2) {
    patterns.push('paciente engajado com questionários');
  }

  const motivationalCount = interactions.filter(i => i.action_type === 'generate_motivational').length;
  if (motivationalCount > 3) {
    patterns.push('recebe mensagens motivacionais frequentemente');
  }

  // Analisar consistência temporal
  const recentDays = interactions.filter(i => {
    const daysDiff = (Date.now() - new Date(i.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });

  if (recentDays.length >= 3) {
    patterns.push('ativo na última semana');
  } else if (recentDays.length === 0) {
    patterns.push('inativo recentemente');
  }

  return patterns;
}
