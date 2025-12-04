import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get auth header for user context
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (!profile?.organization_id) {
      return new Response(
        JSON.stringify({ error: 'Organization not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body for date filters
    const body = await req.json().catch(() => ({}))
    const { start_date, end_date } = body

    // Build query
    let query = supabase
      .from('vendas')
      .select('id, total, data_venda, status')
      .eq('organization_id', profile.organization_id)
      .eq('status', 'finalizada')

    // Apply date filters if provided
    if (start_date) {
      query = query.gte('data_venda', start_date)
    }
    if (end_date) {
      query = query.lte('data_venda', end_date)
    }

    const { data: vendas, error: vendasError } = await query

    if (vendasError) {
      console.error('Error fetching vendas:', vendasError)
      return new Response(
        JSON.stringify({ error: 'Error fetching sales data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate summary
    const totalVendas = vendas?.reduce((acc, v) => acc + Number(v.total || 0), 0) || 0
    const quantidadeVendas = vendas?.length || 0
    const ticketMedio = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0

    // Group by day for chart data
    const vendasPorDia: Record<string, { total: number; quantidade: number }> = {}
    vendas?.forEach(v => {
      const dia = v.data_venda.split('T')[0]
      if (!vendasPorDia[dia]) {
        vendasPorDia[dia] = { total: 0, quantidade: 0 }
      }
      vendasPorDia[dia].total += Number(v.total || 0)
      vendasPorDia[dia].quantidade += 1
    })

    const chartData = Object.entries(vendasPorDia)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, valores]) => ({
        data,
        total: valores.total,
        quantidade: valores.quantidade,
      }))

    const response = {
      summary: {
        total_vendas: totalVendas,
        quantidade_vendas: quantidadeVendas,
        ticket_medio: ticketMedio,
      },
      chart_data: chartData,
      period: {
        start: start_date || 'all',
        end: end_date || 'all',
      },
    }

    console.log('Sales summary generated:', { 
      organization_id: profile.organization_id, 
      total: totalVendas, 
      count: quantidadeVendas 
    })

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in sales-summary function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
