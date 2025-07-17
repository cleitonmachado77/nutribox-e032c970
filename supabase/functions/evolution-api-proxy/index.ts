import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Get Evolution API credentials from Supabase secrets
    const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL') || 'http://134.199.202.47:8080'
    const EVOLUTION_API_TOKEN = Deno.env.get('EVOLUTION_API_TOKEN')
    
    if (!EVOLUTION_API_TOKEN) {
      throw new Error('Evolution API token not configured')
    }

    // Parse request body
    const requestData: EvolutionAPIRequest = await req.json()
    const { endpoint, method, body, instanceName } = requestData

    // Validate instanceName belongs to user (multi-tenant security)
    const expectedInstanceName = `nutribox-${user.id.slice(0, 8)}`
    if (instanceName && instanceName !== expectedInstanceName) {
      throw new Error('Invalid instance name for user')
    }

    // Build Evolution API URL
    const evolutionUrl = `${EVOLUTION_API_URL}${endpoint}`
    
    // Prepare headers for Evolution API
    const evolutionHeaders = {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_TOKEN,
    }

    // Make request to Evolution API
    const evolutionResponse = await fetch(evolutionUrl, {
      method,
      headers: evolutionHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!evolutionResponse.ok) {
      const errorText = await evolutionResponse.text()
      throw new Error(`Evolution API error: ${evolutionResponse.status} - ${errorText}`)
    }

    // Check if response is JSON before parsing
    const contentType = evolutionResponse.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await evolutionResponse.text()
      throw new Error(`Evolution API returned non-JSON response (${contentType}): ${responseText.substring(0, 200)}...`)
    }

    const data = await evolutionResponse.json()

    // Log the API call for security audit
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
      .catch(() => {}) // Don't fail if audit log fails

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Evolution API Proxy Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})