import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Consignacao = Tables<'consignacoes'>;
type ConsignacaoInsert = TablesInsert<'consignacoes'>;
type ConsignacaoUpdate = TablesUpdate<'consignacoes'>;
type ItemConsignacaoInsert = TablesInsert<'itens_consignacao'>;

interface ItemConsignacao {
  produto_id: string;
  quantidade_enviada: number;
  preco_unitario: number;
}

interface NovaConsignacao {
  cliente_id: string;
  vendedor_id?: string;
  data_retorno_previsto?: string;
  observacoes?: string;
  itens: ItemConsignacao[];
}

export function useConsignacoes() {
  return useQuery({
    queryKey: ['consignacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consignacoes')
        .select(`
          *,
          cliente:clientes(id, nome, telefone),
          vendedor:profiles(id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useConsignacao(id: string) {
  return useQuery({
    queryKey: ['consignacoes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consignacoes')
        .select(`
          *,
          cliente:clientes(id, nome, telefone, email),
          vendedor:profiles(id, name),
          itens:itens_consignacao(
            id,
            quantidade_enviada,
            quantidade_devolvida,
            quantidade_vendida,
            preco_unitario,
            produto:produtos(id, nome, sku)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateConsignacao() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (consignacao: NovaConsignacao) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();
      
      if (!profile?.organization_id) throw new Error('Organization not found');
      
      // Calculate total
      const valorTotal = consignacao.itens.reduce(
        (acc, item) => acc + item.quantidade_enviada * item.preco_unitario,
        0
      );
      
      // Create consignacao
      const { data: novaConsignacao, error: consignacaoError } = await supabase
        .from('consignacoes')
        .insert({
          organization_id: profile.organization_id,
          cliente_id: consignacao.cliente_id,
          vendedor_id: consignacao.vendedor_id,
          data_retorno_previsto: consignacao.data_retorno_previsto,
          observacoes: consignacao.observacoes,
          valor_total: valorTotal,
          status: 'enviada',
        })
        .select()
        .single();
      
      if (consignacaoError) throw consignacaoError;
      
      // Create itens
      const itens: ItemConsignacaoInsert[] = consignacao.itens.map(item => ({
        consignacao_id: novaConsignacao.id,
        produto_id: item.produto_id,
        quantidade_enviada: item.quantidade_enviada,
        preco_unitario: item.preco_unitario,
        quantidade_devolvida: 0,
        quantidade_vendida: 0,
      }));
      
      const { error: itensError } = await supabase
        .from('itens_consignacao')
        .insert(itens);
      
      if (itensError) throw itensError;
      
      return novaConsignacao;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignacoes'] });
      toast.success('Consignação criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar consignação: ' + error.message);
    },
  });
}

export function useUpdateConsignacao() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: ConsignacaoUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('consignacoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignacoes'] });
      toast.success('Consignação atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar consignação: ' + error.message);
    },
  });
}

export function useRegistrarDevolucao() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      consignacao_id, 
      itens,
      observacoes 
    }: { 
      consignacao_id: string; 
      itens: { item_id: string; quantidade_devolvida: number; quantidade_vendida: number }[];
      observacoes?: string;
    }) => {
      // Create devolucao record
      const { error: devolucaoError } = await supabase
        .from('devolucoes')
        .insert({
          consignacao_id,
          observacoes,
        });
      
      if (devolucaoError) throw devolucaoError;
      
      // Update itens quantities
      for (const item of itens) {
        const { error } = await supabase
          .from('itens_consignacao')
          .update({
            quantidade_devolvida: item.quantidade_devolvida,
            quantidade_vendida: item.quantidade_vendida,
          })
          .eq('id', item.item_id);
        
        if (error) throw error;
      }
      
      // Update consignacao status
      await supabase
        .from('consignacoes')
        .update({ status: 'devolvida' })
        .eq('id', consignacao_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consignacoes'] });
      toast.success('Devolução registrada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar devolução: ' + error.message);
    },
  });
}
