import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Lancamento = Tables<'lancamentos'>;
type LancamentoInsert = TablesInsert<'lancamentos'>;
type LancamentoUpdate = TablesUpdate<'lancamentos'>;
type Conta = Tables<'contas'>;
type CategoriaFinanceira = Tables<'categorias_financeiras'>;

export function useLancamentos(filters?: { tipo?: string; status?: string; mes?: number; ano?: number }) {
  return useQuery({
    queryKey: ['lancamentos', filters],
    queryFn: async () => {
      let query = supabase
        .from('lancamentos')
        .select(`
          *,
          conta:contas(id, nome, tipo),
          categoria:categorias_financeiras(id, nome, cor)
        `)
        .order('data_lancamento', { ascending: false });
      
      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.mes && filters?.ano) {
        const startDate = new Date(filters.ano, filters.mes - 1, 1);
        const endDate = new Date(filters.ano, filters.mes, 0);
        query = query
          .gte('data_lancamento', startDate.toISOString().split('T')[0])
          .lte('data_lancamento', endDate.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateLancamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lancamento: Omit<LancamentoInsert, 'organization_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();
      
      if (!profile?.organization_id) throw new Error('Organization not found');
      
      const { data, error } = await supabase
        .from('lancamentos')
        .insert({ ...lancamento, organization_id: profile.organization_id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      toast.success('Lançamento criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar lançamento: ' + error.message);
    },
  });
}

export function useUpdateLancamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: LancamentoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('lancamentos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      toast.success('Lançamento atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar lançamento: ' + error.message);
    },
  });
}

export function useContas() {
  return useQuery({
    queryKey: ['contas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contas')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });
      
      if (error) throw error;
      return data as Conta[];
    },
  });
}

export function useCategorias(tipo?: string) {
  return useQuery({
    queryKey: ['categorias_financeiras', tipo],
    queryFn: async () => {
      let query = supabase
        .from('categorias_financeiras')
        .select('*')
        .order('nome', { ascending: true });
      
      if (tipo) {
        query = query.eq('tipo', tipo);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as CategoriaFinanceira[];
    },
  });
}

export function useResumoFinanceiro(mes: number, ano: number) {
  return useQuery({
    queryKey: ['resumo_financeiro', mes, ano],
    queryFn: async () => {
      const startDate = new Date(ano, mes - 1, 1);
      const endDate = new Date(ano, mes, 0);
      
      const { data, error } = await supabase
        .from('lancamentos')
        .select('tipo, valor, status')
        .gte('data_lancamento', startDate.toISOString().split('T')[0])
        .lte('data_lancamento', endDate.toISOString().split('T')[0]);
      
      if (error) throw error;
      
      const receitas = data
        .filter(l => l.tipo === 'receita')
        .reduce((acc, l) => acc + Number(l.valor), 0);
      
      const despesas = data
        .filter(l => l.tipo === 'despesa')
        .reduce((acc, l) => acc + Number(l.valor), 0);
      
      const receitasPagas = data
        .filter(l => l.tipo === 'receita' && l.status === 'pago')
        .reduce((acc, l) => acc + Number(l.valor), 0);
      
      const despesasPagas = data
        .filter(l => l.tipo === 'despesa' && l.status === 'pago')
        .reduce((acc, l) => acc + Number(l.valor), 0);
      
      return {
        receitas,
        despesas,
        saldo: receitas - despesas,
        receitasPagas,
        despesasPagas,
        saldoRealizado: receitasPagas - despesasPagas,
      };
    },
  });
}
