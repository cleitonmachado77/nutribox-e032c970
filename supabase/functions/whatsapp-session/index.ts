
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
    // Import WhatsApp Web.js dynamically
    const { Client, LocalAuth } = await import('https://esm.sh/whatsapp-web.js@1.23.0')
    
    console.log('Creating WhatsApp client for user:', userId)
    
    // Create a new WhatsApp client with persistent session
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: `user_${userId}`
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    })

    // Store client instance
    whatsappClients.set(userId, client)

    return new Promise((resolve, reject) => {
      let qrCodeGenerated = false

      // Listen for QR code generation
      client.on('qr', async (qr) => {
        console.log('QR Code generated for user:', userId)
        
        if (!qrCodeGenerated) {
          qrCodeGenerated = true
          
          // Save QR code to database
          await supabase
            .from('whatsapp_sessions')
            .upsert({
              user_id: userId,
              qr_code: qr,
              is_connected: false,
              updated_at: new Date().toISOString()
            })

          resolve(new Response(JSON.stringify({ qr_code: qr }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }))
        }
      })

      // Listen for successful authentication
      client.on('ready', async () => {
        console.log('WhatsApp client ready for user:', userId)
        
        // Get phone number
        const phoneNumber = client.info?.wid?.user || 'unknown'
        
        // Update database with connection status
        await supabase
          .from('whatsapp_sessions')
          .update({
            is_connected: true,
            phone_number: phoneNumber,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
      })

      // Listen for authentication failure
      client.on('auth_failure', async (message) => {
        console.error('Authentication failed for user:', userId, message)
        whatsappClients.delete(userId)
        
        await supabase
          .from('whatsapp_sessions')
          .update({
            is_connected: false,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
      })

      // Listen for disconnection
      client.on('disconnected', async (reason) => {
        console.log('WhatsApp client disconnected for user:', userId, reason)
        whatsappClients.delete(userId)
        
        await supabase
          .from('whatsapp_sessions')
          .update({
            is_connected: false,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
      })

      // Initialize the client
      client.initialize().catch((error) => {
        console.error('Failed to initialize WhatsApp client:', error)
        reject(new Response(JSON.stringify({ error: 'Failed to initialize WhatsApp client' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }))
      })

      // Timeout after 30 seconds if no QR code is generated
      setTimeout(() => {
        if (!qrCodeGenerated) {
          reject(new Response(JSON.stringify({ error: 'Timeout waiting for QR code' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }))
        }
      }, 30000)
    })

  } catch (error) {
    console.error('Error in generateQRCode:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function checkConnection(supabase: any, userId: string) {
  try {
    // Check if client exists and is connected
    const client = whatsappClients.get(userId)
    let isConnected = false
    let phoneNumber = null

    if (client) {
      // Check if client is ready
      isConnected = client.info !== null
      phoneNumber = client.info?.wid?.user || null
    }

    // Also check database for persistent state
    const { data: session } = await supabase
      .from('whatsapp_sessions')
      .select('is_connected, phone_number')
      .eq('user_id', userId)
      .single()

    // Use the most current state
    const connected = isConnected || (session?.is_connected || false)
    const phone = phoneNumber || session?.phone_number || null

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
      phone_number: null 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function disconnect(supabase: any, userId: string) {
  try {
    // Get client and destroy it
    const client = whatsappClients.get(userId)
    if (client) {
      await client.destroy()
      whatsappClients.delete(userId)
    }

    // Update database
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
  } catch (error) {
    console.error('Error disconnecting:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
