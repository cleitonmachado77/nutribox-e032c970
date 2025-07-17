
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('WhatsApp webhook received:', body)

    // Processar mensagens recebidas
    if (body.entry && body.entry[0].changes) {
      for (const change of body.entry[0].changes) {
        if (change.value.messages) {
          for (const message of change.value.messages) {
            await processIncomingMessage(supabase, message, change.value.metadata.phone_number_id)
          }
        }

        if (change.value.statuses) {
          for (const status of change.value.statuses) {
            await updateMessageStatus(supabase, status)
          }
        }
      }
    }

    return new Response('OK', { 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processIncomingMessage(supabase: any, message: any, phoneNumberId: string) {
  const fromPhone = message.from
  const messageText = message.text?.body || ''
  const messageType = message.type || 'text'
  const timestamp = new Date(parseInt(message.timestamp) * 1000)

  // Encontrar o usuário pela sessão do WhatsApp
  const { data: session } = await supabase
    .from('whatsapp_sessions')
    .select('user_id')
    .eq('phone_number', phoneNumberId)
    .eq('is_connected', true)
    .single()

  if (!session) {
    console.log('No active session found for phone number:', phoneNumberId)
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
        contact_name: message.profile?.name || fromPhone,
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
        unread_count: supabase.rpc('increment', { 
          table_name: 'whatsapp_conversations',
          row_id: conversation.id,
          column_name: 'unread_count'
        })
      })
      .eq('id', conversation.id)
  }

  // Inserir mensagem
  await supabase
    .from('whatsapp_messages')
    .insert({
      conversation_id: conversation.id,
      message_id: message.id,
      sender_type: 'contact',
      content: messageText,
      message_type: messageType,
      timestamp: timestamp,
      is_read: false
    })
}

async function updateMessageStatus(supabase: any, status: any) {
  await supabase
    .from('whatsapp_messages')
    .update({ is_read: status.status === 'read' })
    .eq('message_id', status.id)
}
