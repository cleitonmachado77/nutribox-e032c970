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
    if (!authHeader) {
      return new Response('Missing Authorization header', { status: 401, headers: corsHeaders })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { action } = await req.json()
    console.log('Action received:', action, 'for user:', user.id)

    switch (action) {
      case 'generate_qr':
        return await generateQRCode(supabase, user.id)
      case 'check_connection':
        return await checkConnection(supabase, user.id)
      case 'disconnect':
        return await disconnect(supabase, user.id)
      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error('Session error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateQRCode(supabase: any, userId: string) {
  try {
    console.log('Generating QR code for user:', userId)
    
    // Gerar um QR code no formato correto do WhatsApp Web
    const timestamp = Date.now()
    const sessionId = `${userId}_${timestamp}`
    
    // Formato real do QR code do WhatsApp Web (estrutura simplificada)
    const serverToken = generateRandomString(32)
    const clientToken = generateRandomString(43)
    const publicKey = generateRandomString(32)
    
    const qrCodeData = `1@${serverToken},${clientToken},${publicKey}`
    
    console.log('QR Code generated successfully')
    
    // Salvar na base de dados
    const { error: upsertError } = await supabase
      .from('whatsapp_sessions')
      .upsert({
        user_id: userId,
        qr_code: qrCodeData,
        is_connected: false,
        session_data: { 
          sessionId, 
          generated_at: new Date().toISOString(),
          serverToken,
          clientToken
        },
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Error saving QR code:', upsertError)
      throw new Error('Failed to save QR code to database')
    }

    // Simular processo de conexão após 15 segundos para demonstração
    setTimeout(async () => {
      try {
        console.log('Simulating WhatsApp connection...')
        const { error: updateError } = await supabase
          .from('whatsapp_sessions')
          .update({
            is_connected: true,
            phone_number: '+55 11 99999-9999',
            session_data: {
              sessionId,
              connected_at: new Date().toISOString(),
              status: 'connected'
            },
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating connection status:', updateError)
        } else {
          console.log('WhatsApp connection simulated successfully for user:', userId)
        }
      } catch (err) {
        console.error('Error in connection simulation:', err)
      }
    }, 15000)

    return new Response(JSON.stringify({ 
      success: true,
      qr_code: qrCodeData,
      session_id: sessionId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generateQRCode:', error)
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
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking connection:', error)
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
    console.error('Error checking connection:', error)
    return new Response(JSON.stringify({ 
      connected: false,
      phone_number: null,
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
      console.error('Error disconnecting:', error)
      throw error
    }

    console.log('User disconnected successfully:', userId)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error disconnecting:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}