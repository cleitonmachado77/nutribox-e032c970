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
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!maytapiToken) {
      return new Response(JSON.stringify({ error: 'Maytapi token not configured' }), {
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

    const body = await req.json()
    const { action } = body

    console.log('Processing Maytapi action:', action, 'for user:', user.id)

    switch (action) {
      case 'get_qr':
        return await getQRCode(supabase, user.id, maytapiToken)
      case 'check_connection':
        return await checkConnection(supabase, user.id, maytapiToken)
      case 'disconnect':
        return await disconnect(supabase, user.id, maytapiToken)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Maytapi function error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function getQRCode(supabase: any, userId: string, token: string) {
  try {
    console.log('Getting QR code from Maytapi for user:', userId)
    
    const response = await fetch(`${MAYTAPI_CONFIG.baseUrl}/${MAYTAPI_CONFIG.phoneId}/getScreen`, {
      method: 'GET',
      headers: {
        'x-maytapi-key': token,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Maytapi API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Maytapi response:', data)

    let qrCode = null
    let isConnected = false

    if (data.success && data.data) {
      if (data.data.screen === 'qr' && data.data.qrCode) {
        qrCode = data.data.qrCode
      } else if (data.data.screen === 'main') {
        isConnected = true
      }
    }

    // Salvar no banco
    const { error: upsertError } = await supabase
      .from('whatsapp_sessions')
      .upsert({
        user_id: userId,
        qr_code: qrCode,
        is_connected: isConnected,
        phone_number: isConnected ? MAYTAPI_CONFIG.phoneId : null,
        session_data: { 
          screen: data.data?.screen,
          maytapi_phone_id: MAYTAPI_CONFIG.phoneId,
          updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      console.error('Database error:', upsertError)
      throw new Error('Failed to save session data')
    }

    return new Response(JSON.stringify({ 
      success: true,
      qr_code: qrCode,
      is_connected: isConnected,
      screen: data.data?.screen || 'unknown'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Get QR error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to get QR code',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function checkConnection(supabase: any, userId: string, token: string) {
  try {
    console.log('Checking Maytapi connection for user:', userId)
    
    const response = await fetch(`${MAYTAPI_CONFIG.baseUrl}/${MAYTAPI_CONFIG.phoneId}/getScreen`, {
      method: 'GET',
      headers: {
        'x-maytapi-key': token,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Maytapi API error: ${response.status}`)
    }

    const data = await response.json()
    const isConnected = data.success && data.data?.screen === 'main'

    // Atualizar no banco
    if (isConnected) {
      await supabase
        .from('whatsapp_sessions')
        .update({
          is_connected: true,
          phone_number: MAYTAPI_CONFIG.phoneId,
          qr_code: null,
          session_data: {
            screen: data.data?.screen,
            maytapi_phone_id: MAYTAPI_CONFIG.phoneId,
            connected_at: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
    }

    return new Response(JSON.stringify({ 
      connected: isConnected,
      screen: data.data?.screen || 'unknown',
      phone_id: MAYTAPI_CONFIG.phoneId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Check connection error:', error)
    return new Response(JSON.stringify({ 
      connected: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function disconnect(supabase: any, userId: string, token: string) {
  try {
    console.log('Disconnecting Maytapi user:', userId)
    
    const response = await fetch(`${MAYTAPI_CONFIG.baseUrl}/${MAYTAPI_CONFIG.phoneId}/logout`, {
      method: 'POST',
      headers: {
        'x-maytapi-key': token,
        'Content-Type': 'application/json'
      }
    })

    // Atualizar no banco independente da resposta da API
    const { error } = await supabase
      .from('whatsapp_sessions')
      .update({
        is_connected: false,
        qr_code: null,
        phone_number: null,
        session_data: { disconnected_at: new Date().toISOString() },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Disconnect error:', error)
      throw error
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Disconnect error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}