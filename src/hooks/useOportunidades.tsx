import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Oportunidade = Tables<'oportunidades'>;
type OportunidadeInsert = TablesInsert<'oportunidades'>;
type OportunidadeUpdate = TablesUpdate<'oportunidades'>;

export function useOportunidades() {
  return useQuery({
    queryKey: ['oportunidades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oportunidades')
        .select(`
          *,
          cliente:clientes(id, nome, email),
          etapa:etapas_funil(id, nome, cor, ordem),
          responsavel:profiles(id, name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useOportunidade(id: string) {
  return useQuery({
    queryKey: ['oportunidades', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oportunidades')
        .select(`
          *,
          cliente:clientes(id, nome, email, telefone),
          etapa:etapas_funil(id, nome, cor, ordem),
          responsavel:profiles(id, name, email)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateOportunidade() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (oportunidade: Omit<OportunidadeInsert, 'organization_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();
      
      if (!profile?.organization_id) throw new Error('Organization not found');
      
      const { data, error } = await supabase
        .from('oportunidades')
        .insert({ ...oportunidade, organization_id: profile.organization_id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
      toast.success('Oportunidade criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar oportunidade: ' + error.message);
    },
  });
}

export function useUpdateOportunidade() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: OportunidadeUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('oportunidades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oportunidades'] });
      toast.success('Oportunidade atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar oportunidade: ' + error.message);
    },
  });
}

export function useEtapasFunil() {
  return useQuery({
    queryKey: ['etapas_funil'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('etapas_funil')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}
