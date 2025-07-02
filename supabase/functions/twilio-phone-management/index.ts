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

    const { action, consultorio_nome, cidade } = await req.json()

    console.log('Processing phone management action:', action, 'for user:', user.id)

    switch (action) {
      case 'provision_number':
        return await provisionNumber(supabase, user.id, consultorio_nome, cidade, twilioAccountSid, twilioAuthToken)
      case 'get_user_number':
        return await getUserNumber(supabase, user.id)
      case 'release_number':
        return await releaseNumber(supabase, user.id, twilioAccountSid, twilioAuthToken)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Phone management error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function provisionNumber(supabase: any, userId: string, consultorioNome: string, cidade: string, accountSid: string, authToken: string) {
  try {
    // Check if user already has a number
    const { data: existingNumber } = await supabase
      .from('user_twilio_numbers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (existingNumber) {
      return new Response(JSON.stringify({ 
        success: true,
        phone_number: existingNumber.twilio_phone_number,
        message: 'Number already provisioned'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Purchasing new Twilio number for user:', userId)

    // Search for available numbers in Brazil
    const searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/BR/Local.json?SmsEnabled=true&Limit=1`
    
    const credentials = btoa(`${accountSid}:${authToken}`)
    
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!searchResponse.ok) {
      throw new Error(`Failed to search numbers: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()
    console.log('Available numbers:', searchData)

    if (!searchData.available_phone_numbers || searchData.available_phone_numbers.length === 0) {
      throw new Error('No available numbers found')
    }

    const selectedNumber = searchData.available_phone_numbers[0]
    console.log('Selected number:', selectedNumber.phone_number)

    // Purchase the number
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-webhook`
    const purchaseUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`
    
    const purchaseBody = new URLSearchParams({
      PhoneNumber: selectedNumber.phone_number,
      SmsUrl: webhookUrl,
      SmsMethod: 'POST',
      StatusCallback: webhookUrl,
      StatusCallbackMethod: 'POST'
    })

    const purchaseResponse = await fetch(purchaseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: purchaseBody.toString()
    })

    if (!purchaseResponse.ok) {
      const errorData = await purchaseResponse.text()
      console.error('Purchase error:', errorData)
      throw new Error(`Failed to purchase number: ${purchaseResponse.status}`)
    }

    const purchaseData = await purchaseResponse.json()
    console.log('Number purchased:', purchaseData)

    // Save to database
    const { error: insertError } = await supabase
      .from('user_twilio_numbers')
      .insert({
        user_id: userId,
        twilio_phone_number: purchaseData.phone_number,
        twilio_phone_sid: purchaseData.sid,
        consultorio_nome: consultorioNome,
        cidade: cidade || null,
        is_active: true
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error('Failed to save number to database')
    }

    return new Response(JSON.stringify({ 
      success: true,
      phone_number: purchaseData.phone_number,
      message: 'Number provisioned successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Provision number error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to provision number',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getUserNumber(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_twilio_numbers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ 
          has_number: false
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ 
      has_number: true,
      number_data: data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Get user number error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to get user number',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function releaseNumber(supabase: any, userId: string, accountSid: string, authToken: string) {
  try {
    // Get user's number
    const { data: userNumber, error: fetchError } = await supabase
      .from('user_twilio_numbers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (fetchError || !userNumber) {
      return new Response(JSON.stringify({ error: 'No active number found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Release from Twilio
    const credentials = btoa(`${accountSid}:${authToken}`)
    const releaseUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers/${userNumber.twilio_phone_sid}.json`
    
    const releaseResponse = await fetch(releaseUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    })

    // Update database (mark as inactive)
    const { error: updateError } = await supabase
      .from('user_twilio_numbers')
      .update({ is_active: false })
      .eq('id', userNumber.id)

    if (updateError) {
      console.error('Database update error:', updateError)
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Number released successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Release number error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to release number',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}