import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAYTAPI_CONFIG = {
  productId: 'ce996558-18a6-4efe-9957-828abbacc6d4',
  phoneId: '98308',
  baseUrl: 'https://api.maytapi.com/api/ce996558-18a6-4efe-9957-828abbacc6d4'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const maytapiToken = Deno.env.get('MAYTAPI_TOKEN')
    
    if (!supabaseUrl || !supabaseKey || !maytapiToken) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { to, message, conversation_id } = await req.json()

    if (!to || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verificar se o usuário tem uma sessão ativa
    const { data: session } = await supabase
      .from('whatsapp_sessions')
      .select('is_connected, phone_number')
      .eq('user_id', user.id)
      .eq('is_connected', true)
      .single()

    if (!session) {
      return new Response(JSON.stringify({ error: 'WhatsApp not connected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Sending message via Maytapi:', { to, message })

    // Enviar mensagem via Maytapi
    const response = await fetch(`${MAYTAPI_CONFIG.baseUrl}/${MAYTAPI_CONFIG.phoneId}/sendMessage`, {
      method: 'POST',
      headers: {
        'x-maytapi-key': maytapiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_number: to,
        message: message,
        type: 'text'
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Maytapi send error:', errorData)
      throw new Error(`Maytapi API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('Maytapi send result:', result)

    if (!result.success) {
      throw new Error(result.message || 'Failed to send message')
    }

    const messageId = result.data?.message_id || `maytapi_${Date.now()}`
    
    // Salvar mensagem no banco
    await supabase
      .from('whatsapp_messages')
      .insert({
        conversation_id: conversation_id,
        message_id: messageId,
        sender_type: 'user',
        content: message,
        message_type: 'text',
        timestamp: new Date().toISOString(),
        is_read: true
      })

    // Atualizar conversa
    await supabase
      .from('whatsapp_conversations')
      .update({
        last_message: message,
        last_message_time: new Date().toISOString()
      })
      .eq('id', conversation_id)

    return new Response(JSON.stringify({ 
      success: true, 
      message_id: messageId,
      maytapi_response: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Send message error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to send message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})