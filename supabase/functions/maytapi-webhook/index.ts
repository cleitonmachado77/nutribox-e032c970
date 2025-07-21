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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json()
    console.log('Maytapi webhook received:', JSON.stringify(body, null, 2))

    // Processar mensagem recebida via Maytapi
    if (body.type === 'message' && body.message) {
      await processIncomingMessage(supabase, body)
    }

    return new Response('OK', { 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('Maytapi webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processIncomingMessage(supabase: any, webhookData: any) {
  try {
    const message = webhookData.message
    const fromPhone = message.from_number
    const messageText = message.text || ''
    const messageType = message.type || 'text'
    const timestamp = new Date(message.timestamp * 1000)
    const messageId = message.message_id

    console.log('Processing incoming message:', {
      from: fromPhone,
      text: messageText,
      type: messageType,
      id: messageId
    })

    // Encontrar usuário pela sessão ativa do WhatsApp (assumindo que há apenas uma sessão ativa)
    const { data: session } = await supabase
      .from('whatsapp_sessions')
      .select('user_id')
      .eq('is_connected', true)
      .single()

    if (!session) {
      console.log('No active session found')
      return
    }

    // Encontrar ou criar conversa
    let { data: conversation } = await supabase
      .from('whatsapp_conversations')
      .select('id')
      .eq('user_id', session.user_id)
      .eq('contact_phone', fromPhone)
      .single()

    if (!conversation) {
      const { data: newConversation, error } = await supabase
        .from('whatsapp_conversations')
        .insert({
          user_id: session.user_id,
          contact_phone: fromPhone,
          contact_name: message.from_name || fromPhone,
          last_message: messageText,
          last_message_time: timestamp,
          unread_count: 1
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error creating conversation:', error)
        return
      }
      conversation = newConversation
    } else {
      // Atualizar conversa existente
      await supabase
        .from('whatsapp_conversations')
        .update({
          last_message: messageText,
          last_message_time: timestamp,
          unread_count: supabase.sql`unread_count + 1`
        })
        .eq('id', conversation.id)
    }

    // Inserir mensagem
    await supabase
      .from('whatsapp_messages')
      .insert({
        conversation_id: conversation.id,
        message_id: messageId,
        sender_type: 'contact',
        content: messageText,
        message_type: messageType,
        timestamp: timestamp,
        is_read: false
      })

    console.log('Message processed successfully')
  } catch (error) {
    console.error('Error processing incoming message:', error)
  }
}