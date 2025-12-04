import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Venda = Tables<'vendas'>;
type VendaInsert = TablesInsert<'vendas'>;
type ItemVendaInsert = TablesInsert<'itens_venda'>;

interface ItemCarrinho {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  desconto?: number;
  acrescimo?: number;
}

interface NovaVenda {
  cliente_id?: string;
  caixa_id?: string;
  forma_pagamento?: string;
  parcelas?: number;
  desconto?: number;
  acrescimo?: number;
  observacoes?: string;
  itens: ItemCarrinho[];
}

export function useVendas() {
  return useQuery({
    queryKey: ['vendas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          cliente:clientes(id, nome),
          vendedor:profiles(id, name)
        `)
        .order('data_venda', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useVenda(id: string) {
  return useQuery({
    queryKey: ['vendas', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          cliente:clientes(id, nome, email, telefone),
          vendedor:profiles(id, name),
          itens:itens_venda(
            id,
            quantidade,
            preco_unitario,
            desconto,
            acrescimo,
            subtotal,
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

export function useCreateVenda() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (venda: NovaVenda) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();
      
      if (!profile?.organization_id) throw new Error('Organization not found');
      
      // Calculate totals
      const subtotal = venda.itens.reduce((acc, item) => {
        const itemSubtotal = item.quantidade * item.preco_unitario;
        return acc + itemSubtotal - (item.desconto || 0) + (item.acrescimo || 0);
      }, 0);
      
      const total = subtotal - (venda.desconto || 0) + (venda.acrescimo || 0);
      
      // Create venda
      const { data: novaVenda, error: vendaError } = await supabase
        .from('vendas')
        .insert({
          organization_id: profile.organization_id,
          cliente_id: venda.cliente_id,
          caixa_id: venda.caixa_id,
          forma_pagamento: venda.forma_pagamento,
          parcelas: venda.parcelas || 1,
          subtotal,
          total,
          desconto: venda.desconto || 0,
          acrescimo: venda.acrescimo || 0,
          observacoes: venda.observacoes,
          status: 'finalizada',
        })
        .select()
        .single();
      
      if (vendaError) throw vendaError;
      
      // Create itens_venda
      const itensVenda: ItemVendaInsert[] = venda.itens.map(item => ({
        venda_id: novaVenda.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        desconto: item.desconto || 0,
        acrescimo: item.acrescimo || 0,
        subtotal: item.quantidade * item.preco_unitario - (item.desconto || 0) + (item.acrescimo || 0),
      }));
      
      const { error: itensError } = await supabase
        .from('itens_venda')
        .insert(itensVenda);
      
      if (itensError) throw itensError;
      
      // Update product stock - fetch current and decrement
      for (const item of venda.itens) {
        const { data: produto } = await supabase
          .from('produtos')
          .select('estoque_atual')
          .eq('id', item.produto_id)
          .single();
        
        if (produto) {
          await supabase
            .from('produtos')
            .update({ estoque_atual: Math.max(0, produto.estoque_atual - item.quantidade) })
            .eq('id', item.produto_id);
        }
      }
      
      return novaVenda;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast.success('Venda finalizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao finalizar venda: ' + error.message);
    },
  });
}

export function useVendasHoje() {
  return useQuery({
    queryKey: ['vendas', 'hoje'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('vendas')
        .select('*')
        .gte('data_venda', today.toISOString())
        .eq('status', 'finalizada');
      
      if (error) throw error;
      
      const totalVendas = data.reduce((acc, v) => acc + Number(v.total), 0);
      const quantidadeVendas = data.length;
      const ticketMedio = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0;
      
      return {
        vendas: data,
        totalVendas,
        quantidadeVendas,
        ticketMedio,
      };
    },
  });
}
