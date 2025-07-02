import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get and validate auth token
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
      console.error('Auth error:', authError)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse request body
    const body = await req.json()
    const { action } = body

    console.log('Processing action:', action, 'for user:', user.id)

    switch (action) {
      case 'generate_qr':
        return await generateQRCode(supabase, user.id)
      case 'check_connection':
        return await checkConnection(supabase, user.id)
      case 'disconnect':
        return await disconnect(supabase, user.id)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateQRCode(supabase: any, userId: string) {
  try {
    console.log('Generating QR code for user:', userId)
    
    // Generate a WhatsApp-like QR code data
    const timestamp = Date.now()
    const sessionId = `session_${userId}_${timestamp}`
    
    // Simulate WhatsApp Web QR code format
    // Real WhatsApp QR codes contain encrypted session data
    const qrCodeData = `1@${Math.random().toString(36).substring(2, 15)},${Math.random().toString(36).substring(2, 15)},${sessionId},${timestamp}`
    
    console.log('Generated WhatsApp-like QR data')

    // Save to database
    const { error: upsertError } = await supabase
      .from('whatsapp_sessions')
      .upsert({
        user_id: userId,
        qr_code: qrCodeData,
        is_connected: false,
        session_data: { 
          sessionId, 
          generated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      console.error('Database error:', upsertError)
      throw new Error('Failed to save QR code')
    }

    console.log('QR code saved successfully')

    // Simulate connection after 10 seconds
    setTimeout(async () => {
      try {
        await supabase
          .from('whatsapp_sessions')
          .update({
            is_connected: true,
            phone_number: '+55 11 99999-9999',
            session_data: {
              sessionId,
              connected_at: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        
        console.log('Simulated connection for user:', userId)
      } catch (err) {
        console.error('Error in simulation:', err)
      }
    }, 10000)

    return new Response(JSON.stringify({ 
      success: true,
      qr_code: qrCodeData,
      session_id: sessionId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Generate QR error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to generate QR code',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function checkConnection(supabase: any, userId: string) {
  try {
    console.log('Checking connection for user:', userId)
    
    const { data: session, error } = await supabase
      .from('whatsapp_sessions')
      .select('is_connected, phone_number, session_data')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ 
        connected: false,
        error: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const connected = session?.is_connected || false
    const phone = session?.phone_number || null

    console.log('Connection status:', { connected, phone })

    return new Response(JSON.stringify({ 
      connected,
      phone_number: phone,
      session_data: session?.session_data
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

async function disconnect(supabase: any, userId: string) {
  try {
    console.log('Disconnecting user:', userId)
    
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

    console.log('User disconnected successfully:', userId)

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