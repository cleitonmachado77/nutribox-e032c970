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

    console.log('Processing subaccount management action:', action, 'for user:', user.id)

    switch (action) {
      case 'create_subaccount':
        return await createSubaccount(supabase, user.id, consultorio_nome, cidade, twilioAccountSid, twilioAuthToken)
      case 'get_user_subaccount':
        return await getUserSubaccount(supabase, user.id)
      case 'provision_whatsapp_number':
        return await provisionWhatsAppNumber(supabase, user.id, twilioAccountSid, twilioAuthToken)
      case 'release_subaccount':
        return await releaseSubaccount(supabase, user.id, twilioAccountSid, twilioAuthToken)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Subaccount management error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function createSubaccount(supabase: any, userId: string, consultorioNome: string, cidade: string, parentAccountSid: string, parentAuthToken: string) {
  try {
    // Check if user already has a subaccount
    const { data: existingSubaccount } = await supabase
      .from('user_twilio_subaccounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (existingSubaccount) {
      return new Response(JSON.stringify({ 
        success: true,
        subaccount: existingSubaccount,
        message: 'Subaccount already exists'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Creating new Twilio subaccount for user:', userId)

    // Create subaccount via Twilio API
    const credentials = btoa(`${parentAccountSid}:${parentAuthToken}`)
    const createUrl = `https://api.twilio.com/2010-04-01/Accounts.json`
    
    const createBody = new URLSearchParams({
      FriendlyName: `${consultorioNome} - NutriCoach ${userId.substring(0, 8)}`,
    })

    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: createBody.toString()
    })

    if (!createResponse.ok) {
      const errorData = await createResponse.text()
      console.error('Subaccount creation error:', errorData)
      throw new Error(`Failed to create subaccount: ${createResponse.status}`)
    }

    const subaccountData = await createResponse.json()
    console.log('Subaccount created:', subaccountData)

    // Save to database
    const { data: insertedData, error: insertError } = await supabase
      .from('user_twilio_subaccounts')
      .insert({
        user_id: userId,
        subaccount_sid: subaccountData.sid,
        subaccount_token: subaccountData.auth_token,
        consultorio_nome: consultorioNome,
        cidade: cidade || null,
        is_active: true,
        friendly_name: subaccountData.friendly_name
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error('Failed to save subaccount to database')
    }

    return new Response(JSON.stringify({ 
      success: true,
      subaccount: insertedData,
      message: 'Subaccount created successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Create subaccount error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to create subaccount',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function provisionWhatsAppNumber(supabase: any, userId: string, parentAccountSid: string, parentAuthToken: string) {
  try {
    // Get user's subaccount
    const { data: subaccount, error: subaccountError } = await supabase
      .from('user_twilio_subaccounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (subaccountError || !subaccount) {
      throw new Error('No active subaccount found. Create a subaccount first.')
    }

    // Check if already has a WhatsApp number
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
        message: 'WhatsApp number already provisioned'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Purchasing WhatsApp number for subaccount:', subaccount.subaccount_sid)

    // Search for available numbers using parent account credentials
    const searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${subaccount.subaccount_sid}/AvailablePhoneNumbers/BR/Local.json?SmsEnabled=true&Limit=1`
    
    const credentials = btoa(`${parentAccountSid}:${parentAuthToken}`)
    
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

    // Purchase the number for the subaccount
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-webhook`
    const purchaseUrl = `https://api.twilio.com/2010-04-01/Accounts/${subaccount.subaccount_sid}/IncomingPhoneNumbers.json`
    
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
        subaccount_sid: subaccount.subaccount_sid,
        twilio_phone_number: purchaseData.phone_number,
        twilio_phone_sid: purchaseData.sid,
        consultorio_nome: subaccount.consultorio_nome,
        cidade: subaccount.cidade,
        is_active: true
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error('Failed to save number to database')
    }

    return new Response(JSON.stringify({ 
      success: true,
      phone_number: purchaseData.phone_number,
      subaccount_sid: subaccount.subaccount_sid,
      message: 'WhatsApp number provisioned successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Provision WhatsApp number error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to provision WhatsApp number',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function getUserSubaccount(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_twilio_subaccounts')
      .select(`
        *,
        user_twilio_numbers!inner(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ 
          has_subaccount: false
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw error
    }

    return new Response(JSON.stringify({ 
      has_subaccount: true,
      subaccount_data: data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Get user subaccount error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to get user subaccount',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function releaseSubaccount(supabase: any, userId: string, parentAccountSid: string, parentAuthToken: string) {
  try {
    // Get user's subaccount
    const { data: subaccount, error: fetchError } = await supabase
      .from('user_twilio_subaccounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (fetchError || !subaccount) {
      return new Response(JSON.stringify({ error: 'No active subaccount found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Close subaccount in Twilio (marks it as closed)
    const credentials = btoa(`${parentAccountSid}:${parentAuthToken}`)
    const closeUrl = `https://api.twilio.com/2010-04-01/Accounts/${subaccount.subaccount_sid}.json`
    
    const closeBody = new URLSearchParams({
      Status: 'closed'
    })

    const closeResponse = await fetch(closeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: closeBody.toString()
    })

    // Update database (mark as inactive)
    const { error: updateError } = await supabase
      .from('user_twilio_subaccounts')
      .update({ is_active: false })
      .eq('id', subaccount.id)

    if (updateError) {
      console.error('Database update error:', updateError)
    }

    // Also mark numbers as inactive
    await supabase
      .from('user_twilio_numbers')
      .update({ is_active: false })
      .eq('user_id', userId)

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Subaccount released successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Release subaccount error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to release subaccount',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}