
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Store for WhatsApp client instances per user
const whatsappClients = new Map()

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { action } = await req.json()

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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateQRCode(supabase: any, userId: string) {
  try {
    console.log('Generating QR code for user:', userId)
    
    // Generate a unique session ID for this user
    const sessionId = `whatsapp_${userId}_${Date.now()}`
    
    // Generate a mock QR code string that follows WhatsApp's format
    // In a real implementation, this would come from WhatsApp Web JS
    const qrCodeData = `2@${generateRandomString(160)},${generateRandomString(32)},${generateRandomString(16)}`
    
    console.log('QR Code generated:', qrCodeData.substring(0, 50) + '...')
    
    // Save QR code to database
    const { error: upsertError } = await supabase
      .from('whatsapp_sessions')
      .upsert({
        user_id: userId,
        qr_code: qrCodeData,
        is_connected: false,
        session_data: { sessionId, generated_at: new Date().toISOString() },
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Error saving QR code:', upsertError)
      throw upsertError
    }

    // Simulate connection after 10 seconds for demo purposes
    setTimeout(async () => {
      try {
        const { error: updateError } = await supabase
          .from('whatsapp_sessions')
          .update({
            is_connected: true,
            phone_number: '+55 11 99999-9999',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating connection status:', updateError)
        } else {
          console.log('Connection simulated for user:', userId)
        }
      } catch (err) {
        console.error('Error in simulation timeout:', err)
      }
    }, 10000)

    return new Response(JSON.stringify({ qr_code: qrCodeData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generateQRCode:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate QR code: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function checkConnection(supabase: any, userId: string) {
  try {
    console.log('Checking connection for user:', userId)
    
    // Check database for persistent state
    const { data: session, error } = await supabase
      .from('whatsapp_sessions')
      .select('is_connected, phone_number')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking connection:', error)
      throw error
    }

    const connected = session?.is_connected || false
    const phone = session?.phone_number || null

    console.log('Connection status:', { connected, phone })

    return new Response(JSON.stringify({ 
      connected,
      phone_number: phone
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
    
    // Update database
    const { error } = await supabase
      .from('whatsapp_sessions')
      .update({
        is_connected: false,
        qr_code: null,
        phone_number: null,
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
