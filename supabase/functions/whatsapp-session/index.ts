
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
  // Simular geração de QR code (na implementação real, você usaria a API oficial do WhatsApp)
  const qrCode = `whatsapp-qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Salvar ou atualizar sessão
  const { data: existingSession } = await supabase
    .from('whatsapp_sessions')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existingSession) {
    await supabase
      .from('whatsapp_sessions')
      .update({
        qr_code: qrCode,
        is_connected: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  } else {
    await supabase
      .from('whatsapp_sessions')
      .insert({
        user_id: userId,
        qr_code: qrCode,
        is_connected: false
      })
  }

  // Simular escaneamento após 10 segundos
  setTimeout(async () => {
    await supabase
      .from('whatsapp_sessions')
      .update({
        is_connected: true,
        phone_number: '+55119999999999',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  }, 10000)

  return new Response(JSON.stringify({ qr_code: qrCode }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function checkConnection(supabase: any, userId: string) {
  const { data: session } = await supabase
    .from('whatsapp_sessions')
    .select('is_connected, phone_number')
    .eq('user_id', userId)
    .single()

  return new Response(JSON.stringify({ 
    connected: session?.is_connected || false,
    phone_number: session?.phone_number || null
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function disconnect(supabase: any, userId: string) {
  await supabase
    .from('whatsapp_sessions')
    .update({
      is_connected: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
