import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { to, message, conversation_id } = await req.json()

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

    // Simular envio da mensagem (na implementação real, você usaria a API oficial do WhatsApp)
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
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

    console.log(`Sending WhatsApp message to ${to}: ${message}`)

    return new Response(JSON.stringify({ 
      success: true, 
      message_id: messageId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Send message error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})