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
    const { action, patientName, patientPhone, userId, questionnaires, responses } = await req.json()

    console.log('NutriCoach Questionnaire request:', { action, patientName, patientPhone, userId })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'send_daily_questionnaire':
        return await sendDailyQuestionnaire(supabase, patientName, patientPhone, userId)
      
      case 'process_responses':
        return await processResponses(supabase, patientName, patientPhone, userId, responses)
      
      case 'create_custom_questionnaire':
        return await createCustomQuestionnaire(supabase, userId, questionnaires)
      
      case 'get_patient_insights':
        return await getPatientInsights(supabase, patientPhone, userId)
      
      default:
        throw new Error('Ação não reconhecida')
    }
  } catch (error) {
    console.error('NutriCoach Questionnaire error:', error)
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

async function sendDailyQuestionnaire(supabase: any, patientName: string, patientPhone: string, userId: string) {
  // Determinar tipo de questionário baseado no dia (alternado)
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const isComportamental = dayOfYear % 2 === 0

  let questionCategory = isComportamental ? 'comportamental' : 'bem_estar'
  
  // Para questionários de bem-estar, verificar se é semanal
  if (!isComportamental) {
    const dayOfWeek = today.getDay()
    // Confiança na Jornada e Satisfação com o Corpo apenas nas segundas (1)
    if (dayOfWeek === 1) {
      questionCategory = 'bem_estar'
    } else {
      // Outros dias apenas perguntas diárias de bem-estar
      questionCategory = 'bem_estar'
    }
  }

  // Buscar questionários do tipo apropriado
  const frequency = questionCategory === 'bem_estar' && today.getDay() === 1 ? 'semanal' : 'diario'
  
  const { data: questionnaires, error } = await supabase
    .from('coach_questionnaires')
    .select('*')
    .eq('category', questionCategory)
    .eq('frequency', frequency)
    .eq('is_active', true)
    .limit(5)

  if (error) {
    throw new Error('Erro ao buscar questionários: ' + error.message)
  }

  if (!questionnaires || questionnaires.length === 0) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Nenhum questionário encontrado para hoje'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      },
    )
  }

  // Gerar mensagem com questionário
  const questions = questionnaires.map((q: any, index: number) => {
    const options = Array.isArray(q.options) ? q.options : []
    return `${index + 1}. ${q.question_text}\n${options.join('\n')}`
  }).join('\n\n')

  const typeLabel = questionCategory === 'comportamental' ? 'Comportamental' : 'Bem-estar'
  const message = `🌟 Olá ${patientName}!\n\nHora do seu questionário ${typeLabel} de hoje:\n\n${questions}\n\nResponda com o número da pergunta e sua escolha. Ex: "1 - ✅ Segui completamente"`

  // Enviar via WhatsApp usando o sistema Twilio
  try {
    const { error: whatsappError } = await supabase.functions.invoke('twilio-whatsapp-send', {
      body: {
        to: patientPhone,
        message: message,
        conversation_id: `coach_${patientPhone}_${userId}`
      }
    })

    if (whatsappError) {
      console.error('WhatsApp send error:', whatsappError)
    }
  } catch (whatsappError) {
    console.error('WhatsApp integration error:', whatsappError)
  }

  // Salvar na tabela de interações
  await supabase
    .from('whatsapp_coach_interactions')
    .insert({
      patient_phone: patientPhone,
      patient_name: patientName,
      action_type: 'send_questionnaire',
      generated_message: message,
      patient_data: {
        questionnaire_type: questionCategory,
        frequency: frequency,
        questions_sent: questionnaires.length
      }
    })

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Questionário enviado com sucesso',
      questionnaire_type: questionCategory,
      questions_count: questionnaires.length
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

async function processResponses(supabase: any, patientName: string, patientPhone: string, userId: string, responses: any[]) {
  // Salvar respostas no banco
  const responsePromises = responses.map((response: any) => {
    return supabase
      .from('coach_responses')
      .insert({
        patient_phone: patientPhone,
        patient_name: patientName,
        questionnaire_id: response.questionnaire_id,
        question_type: response.question_type || 'default',
        question_category: response.question_category,
        question_text: response.question_text,
        response_text: response.response_text,
        response_score: response.response_score,
        user_id: userId
      })
  })

  await Promise.all(responsePromises)

  // Analisar respostas com GPT-4o
  const analysisPrompt = `Analise as seguintes respostas do paciente ${patientName}:

${responses.map(r => `${r.question_text}: ${r.response_text} (Score: ${r.response_score})`).join('\n')}

Forneça:
1. Análise dos padrões comportamentais
2. Pontos de atenção
3. Recomendações específicas
4. Palavras de incentivo personalizadas

Mantenha o tom profissional, empático e motivacional.`

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
          content: 'Você é um NutriCoach especialista em análise de comportamento nutricional. Analise respostas de questionários e forneça insights personalizados e motivacionais.'
        },
        {
          role: 'user',
          content: analysisPrompt
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
  const analysis = openaiData.choices[0].message.content

  // Enviar análise via WhatsApp
  const analysisMessage = `📊 Análise das suas respostas, ${patientName}:\n\n${analysis}`
  
  try {
    await supabase.functions.invoke('twilio-whatsapp-send', {
      body: {
        to: patientPhone,
        message: analysisMessage,
        conversation_id: `coach_${patientPhone}_${userId}`
      }
    })
  } catch (error) {
    console.error('Error sending analysis:', error)
  }

  // Salvar análise
  await supabase
    .from('whatsapp_coach_interactions')
    .insert({
      patient_phone: patientPhone,
      patient_name: patientName,
      action_type: 'analyze_responses',
      generated_message: analysis,
      patient_data: {
        responses_analyzed: responses.length,
        avg_score: responses.reduce((sum: number, r: any) => sum + r.response_score, 0) / responses.length
      }
    })

  return new Response(
    JSON.stringify({
      success: true,
      analysis: analysis,
      responses_processed: responses.length
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

async function createCustomQuestionnaire(supabase: any, userId: string, questionnaires: any[]) {
  const insertPromises = questionnaires.map((q: any) => {
    return supabase
      .from('coach_questionnaires')
      .insert({
        user_id: userId,
        title: q.title,
        category: 'personalizada',
        question_text: q.question_text,
        options: q.options,
        frequency: q.frequency || 'diario',
        is_active: true
      })
  })

  const results = await Promise.all(insertPromises)
  
  return new Response(
    JSON.stringify({
      success: true,
      questionnaires_created: results.length
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

async function getPatientInsights(supabase: any, patientPhone: string, userId: string) {
  // Buscar últimas 30 respostas
  const { data: responses, error } = await supabase
    .from('coach_responses')
    .select('*')
    .eq('patient_phone', patientPhone)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) {
    throw new Error('Erro ao buscar respostas: ' + error.message)
  }

  // Calcular métricas
  const insights = {
    total_responses: responses.length,
    avg_score: responses.length > 0 ? responses.reduce((sum: number, r: any) => sum + r.response_score, 0) / responses.length : 0,
    categories: {} as any,
    trends: {} as any
  }

  // Agrupar por categoria
  responses.forEach((r: any) => {
    if (!insights.categories[r.question_category]) {
      insights.categories[r.question_category] = {
        count: 0,
        avg_score: 0,
        scores: []
      }
    }
    insights.categories[r.question_category].count++
    insights.categories[r.question_category].scores.push(r.response_score)
  })

  // Calcular médias por categoria
  Object.keys(insights.categories).forEach(category => {
    const scores = insights.categories[category].scores
    insights.categories[category].avg_score = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
  })

  return new Response(
    JSON.stringify({
      success: true,
      insights: insights
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}