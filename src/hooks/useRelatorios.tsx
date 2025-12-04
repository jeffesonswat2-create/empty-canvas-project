import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SalesSummary {
  summary: {
    total_vendas: number;
    quantidade_vendas: number;
    ticket_medio: number;
  };
  chart_data: Array<{
    data: string;
    total: number;
    quantidade: number;
  }>;
  period: {
    start: string;
    end: string;
  };
}

export function useSalesSummary(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['sales-summary', startDate, endDate],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke<SalesSummary>('sales-summary', {
        body: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      // Get current month sales
      const { data: vendasMes } = await supabase
        .from('vendas')
        .select('total')
        .eq('status', 'finalizada')
        .gte('data_venda', startOfMonth)
        .lte('data_venda', endOfMonth);

      // Get last month sales
      const { data: vendasMesPassado } = await supabase
        .from('vendas')
        .select('total')
        .eq('status', 'finalizada')
        .gte('data_venda', startOfLastMonth)
        .lte('data_venda', endOfLastMonth);

      // Get clients count
      const { count: totalClientes } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });

      // Get products count
      const { count: totalProdutos } = await supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      // Get open opportunities
      const { count: oportunidadesAbertas } = await supabase
        .from('oportunidades')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'andamento');

      const totalMes = vendasMes?.reduce((acc, v) => acc + Number(v.total), 0) || 0;
      const totalMesPassado = vendasMesPassado?.reduce((acc, v) => acc + Number(v.total), 0) || 0;
      const variacaoVendas = totalMesPassado > 0 
        ? ((totalMes - totalMesPassado) / totalMesPassado) * 100 
        : 0;

      return {
        vendasMes: totalMes,
        vendasMesPassado: totalMesPassado,
        variacaoVendas,
        quantidadeVendasMes: vendasMes?.length || 0,
        totalClientes: totalClientes || 0,
        totalProdutos: totalProdutos || 0,
        oportunidadesAbertas: oportunidadesAbertas || 0,
      };
    },
  });
}
