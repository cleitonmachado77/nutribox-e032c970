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
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    
    if (!supabaseUrl || !supabaseKey || !twilioAccountSid || !twilioAuthToken) {
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

    console.log('Sending WhatsApp message via Twilio:', { to, message, user_id: user.id })

    // Get user's Twilio number
    const { data: userNumber, error: numberError } = await supabase
      .from('user_twilio_numbers')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (numberError || !userNumber) {
      return new Response(JSON.stringify({ error: 'No active WhatsApp number found for user' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Format phone numbers for WhatsApp
    const fromWhatsApp = `whatsapp:${userNumber.twilio_phone_number}`
    const toWhatsApp = `whatsapp:${to.startsWith('+') ? to : '+' + to.replace(/\D/g, '')}`

    console.log('Sending from:', fromWhatsApp, 'to:', toWhatsApp)

    // Send message via Twilio WhatsApp API
    const credentials = btoa(`${twilioAccountSid}:${twilioAuthToken}`)
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
    
    const messageBody = new URLSearchParams({
      From: fromWhatsApp,
      To: toWhatsApp,
      Body: message
    })

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: messageBody.toString()
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Twilio send error:', errorData)
      throw new Error(`Twilio API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('Twilio send result:', result)

    const messageId = result.sid || `twilio_${Date.now()}`
    
    // Save message to database
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

    // Update conversation
    await supabase
      .from('whatsapp_conversations')
      .update({
        last_message: message,
        last_message_time: new Date().toISOString(),
        user_id: user.id
      })
      .eq('id', conversation_id)

    return new Response(JSON.stringify({ 
      success: true, 
      message_id: messageId,
      twilio_response: result
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