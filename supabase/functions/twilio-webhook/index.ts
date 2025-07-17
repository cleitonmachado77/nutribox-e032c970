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

    // Parse form data from Twilio webhook
    const formData = await req.formData()
    const webhookData = Object.fromEntries(formData.entries())
    
    console.log('Twilio webhook received:', webhookData)

    // Process incoming WhatsApp message
    if (webhookData.MessageSid && webhookData.Body) {
      await processIncomingMessage(supabase, webhookData)
    }

    return new Response('OK', { 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('Twilio webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processIncomingMessage(supabase: any, webhookData: any) {
  try {
    const messageId = webhookData.MessageSid
    const fromNumber = webhookData.From?.replace('whatsapp:', '') || ''
    const toNumber = webhookData.To?.replace('whatsapp:', '') || ''
    const messageBody = webhookData.Body || ''
    const timestamp = new Date()

    console.log('Processing incoming message:', {
      from: fromNumber,
      to: toNumber,
      body: messageBody,
      messageId: messageId
    })

    // Find the user who owns this Twilio number
    const { data: userNumber, error: numberError } = await supabase
      .from('user_twilio_numbers')
      .select('user_id, consultorio_nome')
      .eq('twilio_phone_number', toNumber)
      .eq('is_active', true)
      .single()

    if (numberError || !userNumber) {
      console.log('No user found for number:', toNumber)
      return
    }

    console.log('Found user for number:', userNumber.user_id)

    // Find or create conversation
    let { data: conversation } = await supabase
      .from('whatsapp_conversations')
      .select('id')
      .eq('user_id', userNumber.user_id)
      .eq('contact_phone', fromNumber)
      .single()

    if (!conversation) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from('whatsapp_conversations')
        .insert({
          user_id: userNumber.user_id,
          contact_phone: fromNumber,
          contact_name: fromNumber.replace(/\D/g, '').slice(-8), // Use last 8 digits as name initially
          last_message: messageBody,
          last_message_time: timestamp,
          unread_count: 1
        })
        .select('id')
        .single()

      if (convError) {
        console.error('Error creating conversation:', convError)
        return
      }
      conversation = newConversation
    } else {
      // Update existing conversation
      await supabase
        .from('whatsapp_conversations')
        .update({
          last_message: messageBody,
          last_message_time: timestamp,
          unread_count: supabase.sql`unread_count + 1`
        })
        .eq('id', conversation.id)
    }

    // Insert message
    await supabase
      .from('whatsapp_messages')
      .insert({
        conversation_id: conversation.id,
        message_id: messageId,
        sender_type: 'contact',
        content: messageBody,
        message_type: 'text',
        timestamp: timestamp,
        is_read: false
      })

    console.log('Message processed successfully for user:', userNumber.user_id)
  } catch (error) {
    console.error('Error processing incoming message:', error)
  }
}