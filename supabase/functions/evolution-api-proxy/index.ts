const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface EvolutionAPIRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  instanceName?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🚀 Edge Function started')
    console.log('📝 Request method:', req.method)
    console.log('📝 Request URL:', req.url)

    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    console.log('🔐 Auth header present:', !!authHeader)
    
    if (!authHeader) {
      console.error('❌ No authorization header')
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    console.log('🔐 Verifying user authentication...')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError) {
      console.error('❌ Authentication error:', authError)
      throw new Error('Authentication failed: ' + authError.message)
    }
    
    if (!user) {
      console.error('❌ No user found')
      throw new Error('Authentication failed: No user found')
    }

    console.log('✅ User authenticated:', user.id)

    // Get Evolution API credentials from environment variables
    const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL')
    const EVOLUTION_API_TOKEN = Deno.env.get('EVOLUTION_API_TOKEN')
    
    console.log('🌍 EVOLUTION_API_URL:', EVOLUTION_API_URL ? 'Set' : 'NOT SET')
    console.log('🔑 EVOLUTION_API_TOKEN:', EVOLUTION_API_TOKEN ? 'Set' : 'NOT SET')
    
    if (!EVOLUTION_API_URL) {
      console.error('❌ EVOLUTION_API_URL environment variable is not configured')
      throw new Error('EVOLUTION_API_URL environment variable is not configured. Please set it in your Supabase project settings.')
    }
    
    if (!EVOLUTION_API_TOKEN) {
      console.error('❌ EVOLUTION_API_TOKEN environment variable is not configured')
      throw new Error('EVOLUTION_API_TOKEN environment variable is not configured. Please set it in your Supabase project settings.')
    }

    // Parse request body
    console.log('📦 Parsing request body...')
    const requestData: EvolutionAPIRequest = await req.json()
    const { endpoint, method, body, instanceName } = requestData
    
    console.log('📝 Request data:', {
      endpoint,
      method,
      hasBody: !!body,
      instanceName
    })

    // Validate instanceName belongs to user (multi-tenant security)
    const expectedInstanceName = `nutribox-${user.id.slice(0, 8)}`
    console.log(`🔐 Validating instance name: ${instanceName} vs expected: ${expectedInstanceName}`)
    
    if (instanceName && instanceName !== expectedInstanceName) {
      console.error(`❌ Invalid instance name: ${instanceName} for user: ${user.id}`)
      throw new Error(`Invalid instance name for user. Expected: ${expectedInstanceName}, Got: ${instanceName}`)
    }

    // Build Evolution API URL
    const evolutionUrl = `${EVOLUTION_API_URL}${endpoint}`
    console.log(`🔄 Making request to Evolution API: ${method} ${evolutionUrl}`)
    
    // Prepare headers for Evolution API
    const evolutionHeaders = {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_TOKEN,
    }

    if (body) {
      console.log(`📦 Request body:`, JSON.stringify(body, null, 2))
    }

    // Make request to Evolution API with timeout and better error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      console.log('🌐 Making fetch request to Evolution API...')
      const evolutionResponse = await fetch(evolutionUrl, {
        method,
        headers: evolutionHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log(`📊 Evolution API response status: ${evolutionResponse.status}`)

      if (!evolutionResponse.ok) {
        const errorText = await evolutionResponse.text()
        console.error(`❌ Evolution API error: ${evolutionResponse.status} - ${errorText}`)
        
        // Provide more specific error messages based on status codes
        let errorMessage = `Evolution API error: ${evolutionResponse.status}`
        
        if (evolutionResponse.status === 404) {
          errorMessage = 'Endpoint not found. Please check the Evolution API version and endpoint path.'
        } else if (evolutionResponse.status === 401) {
          errorMessage = 'Authentication failed. Please check your Evolution API token.'
        } else if (evolutionResponse.status === 403) {
          errorMessage = 'Access denied. Please check your Evolution API permissions.'
        } else if (evolutionResponse.status === 500) {
          errorMessage = 'Internal server error. Please try again later.'
        } else {
          errorMessage = `Evolution API error: ${evolutionResponse.status} - ${errorText}`
        }
        
        throw new Error(errorMessage)
      }

      const data = await evolutionResponse.json()
      console.log(`✅ Evolution API response data:`, JSON.stringify(data, null, 2))

      // Log the API call for security audit
      try {
        await supabaseClient
          .from('api_audit_logs')
          .insert({
            user_id: user.id,
            endpoint,
            method,
            status: evolutionResponse.status,
            instance_name: instanceName,
            timestamp: new Date().toISOString()
          })
        console.log('📊 API audit log saved')
      } catch (auditError) {
        console.warn('⚠️ Failed to log API audit:', auditError)
      }

      console.log('✅ Returning successful response')
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        console.error('⏰ Request to Evolution API timed out after 30 seconds')
        throw new Error('Request to Evolution API timed out after 30 seconds')
      }
      
      console.error('❌ Network error calling Evolution API:', fetchError)
      
      // Provide more specific network error messages
      let errorMessage = 'Network error: Unable to connect to Evolution API.'
      
      if (fetchError.message.includes('fetch')) {
        errorMessage = 'Unable to reach Evolution API server. Please check if the API is running and accessible.'
      } else if (fetchError.message.includes('DNS')) {
        errorMessage = 'DNS resolution failed. Please check the Evolution API URL.'
      } else if (fetchError.message.includes('CORS')) {
        errorMessage = 'CORS error. Please check Evolution API CORS configuration.'
      }
      
      throw new Error(errorMessage)
    }

  } catch (error) {
    console.error('❌ Evolution API Proxy Error:', error)
    console.error('❌ Error stack:', error.stack)
    
    // Provide more specific error messages
    let errorMessage = error.message
    let statusCode = 400
    
    if (error.message.includes('Authentication failed')) {
      statusCode = 401
    } else if (error.message.includes('Invalid instance name')) {
      statusCode = 403
    } else if (error.message.includes('environment variable')) {
      statusCode = 500
      errorMessage = 'Server configuration error. Please contact support.'
    } else if (error.message.includes('timed out')) {
      statusCode = 408
    } else if (error.message.includes('Network error')) {
      statusCode = 503
    }
    
    console.log(`📤 Returning error response: ${statusCode} - ${errorMessage}`)
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Import createClient at the top level
import { createClient } from 'npm:@supabase/supabase-js@2'