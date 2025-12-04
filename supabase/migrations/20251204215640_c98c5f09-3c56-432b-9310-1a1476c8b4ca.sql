-- =============================================
-- SIMPLIX - MIGRATION COMPLETA DO BACKEND
-- =============================================

-- 1. ENUM PARA ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'vendedor');

-- 2. TABELA ORGANIZATIONS (MULTI-TENANT)
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  document TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. TABELA PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. TABELA USER_ROLES (SEPARADA PARA SEGURANÇA)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- =============================================
-- MÓDULO CRM
-- =============================================

-- 5. ETAPAS DO FUNIL
CREATE TABLE public.etapas_funil (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  cor TEXT DEFAULT '#3BA3FF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. CLIENTES
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  documento TEXT,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  tags TEXT[],
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. OPORTUNIDADES
CREATE TABLE public.oportunidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  etapa_id UUID REFERENCES public.etapas_funil(id) ON DELETE SET NULL,
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  valor_previsto DECIMAL(15,2) DEFAULT 0,
  previsao_fechamento DATE,
  status TEXT NOT NULL DEFAULT 'andamento',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. TAREFAS CRM
CREATE TABLE public.tarefas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  oportunidade_id UUID REFERENCES public.oportunidades(id) ON DELETE CASCADE,
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  prioridade TEXT DEFAULT 'normal',
  data_vencimento DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- MÓDULO PDV
-- =============================================

-- 9. PRODUTOS
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  sku TEXT,
  codigo_barras TEXT,
  descricao TEXT,
  preco_venda DECIMAL(15,2) NOT NULL DEFAULT 0,
  preco_custo DECIMAL(15,2) DEFAULT 0,
  estoque_atual INTEGER NOT NULL DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 0,
  unidade TEXT DEFAULT 'UN',
  categoria TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. CAIXAS
CREATE TABLE public.caixas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  operador_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  descricao TEXT,
  valor_abertura DECIMAL(15,2) DEFAULT 0,
  valor_fechamento DECIMAL(15,2),
  data_abertura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fechamento TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'aberto',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. VENDAS
CREATE TABLE public.vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  caixa_id UUID REFERENCES public.caixas(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  vendedor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  desconto DECIMAL(15,2) DEFAULT 0,
  acrescimo DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL DEFAULT 0,
  forma_pagamento TEXT,
  parcelas INTEGER DEFAULT 1,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'finalizada',
  data_venda TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. ITENS VENDA
CREATE TABLE public.itens_venda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id UUID NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
  quantidade DECIMAL(15,3) NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(15,2) NOT NULL,
  desconto DECIMAL(15,2) DEFAULT 0,
  acrescimo DECIMAL(15,2) DEFAULT 0,
  subtotal DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. PRÉ-VENDAS
CREATE TABLE public.pre_vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  vendedor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_previsto DECIMAL(15,2) DEFAULT 0,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- MÓDULO CONSIGNAÇÃO
-- =============================================

-- 14. CONSIGNAÇÕES
CREATE TABLE public.consignacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
  vendedor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  data_envio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_retorno_previsto DATE,
  valor_total DECIMAL(15,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'enviada',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. ITENS CONSIGNAÇÃO
CREATE TABLE public.itens_consignacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consignacao_id UUID NOT NULL REFERENCES public.consignacoes(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
  quantidade_enviada INTEGER NOT NULL DEFAULT 0,
  quantidade_devolvida INTEGER DEFAULT 0,
  quantidade_vendida INTEGER DEFAULT 0,
  preco_unitario DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 16. DEVOLUÇÕES
CREATE TABLE public.devolucoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consignacao_id UUID NOT NULL REFERENCES public.consignacoes(id) ON DELETE CASCADE,
  data_devolucao DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- MÓDULO FINANCEIRO
-- =============================================

-- 17. CATEGORIAS FINANCEIRAS
CREATE TABLE public.categorias_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'despesa',
  cor TEXT DEFAULT '#8EA0B5',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 18. CONTAS
CREATE TABLE public.contas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'corrente',
  saldo DECIMAL(15,2) DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 19. LANÇAMENTOS
CREATE TABLE public.lancamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL,
  categoria_id UUID REFERENCES public.categorias_financeiras(id) ON DELETE SET NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'despesa',
  data_lancamento DATE NOT NULL DEFAULT CURRENT_DATE,
  data_vencimento DATE,
  data_pagamento DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- MÓDULO FISCAL (PLACEHOLDER)
-- =============================================

-- 20. FIGURAS TRIBUTÁRIAS
CREATE TABLE public.figuras_tributarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  codigo TEXT,
  tipo TEXT,
  aliquota DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 21. NOTAS FISCAIS
CREATE TABLE public.notas_fiscais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  venda_id UUID REFERENCES public.vendas(id) ON DELETE SET NULL,
  numero TEXT,
  serie TEXT,
  chave_acesso TEXT,
  valor_total DECIMAL(15,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente',
  xml TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- TRIGGERS E FUNCTIONS
-- =============================================

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_oportunidades_updated_at BEFORE UPDATE ON public.oportunidades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tarefas_updated_at BEFORE UPDATE ON public.tarefas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pre_vendas_updated_at BEFORE UPDATE ON public.pre_vendas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consignacoes_updated_at BEFORE UPDATE ON public.consignacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contas_updated_at BEFORE UPDATE ON public.contas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lancamentos_updated_at BEFORE UPDATE ON public.lancamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function para criar profile e organization automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Criar organization para o novo usuário
  INSERT INTO public.organizations (name, email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Minha Empresa'),
    NEW.email
  )
  RETURNING id INTO new_org_id;
  
  -- Criar profile
  INSERT INTO public.profiles (user_id, organization_id, name, email)
  VALUES (
    NEW.id,
    new_org_id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email
  );
  
  -- Criar role padrão (admin para o primeiro usuário da org)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  
  -- Criar etapas de funil padrão
  INSERT INTO public.etapas_funil (organization_id, nome, ordem, cor) VALUES
    (new_org_id, 'Prospecção', 1, '#8B5CF6'),
    (new_org_id, 'Qualificação', 2, '#3BA3FF'),
    (new_org_id, 'Proposta', 3, '#F59E0B'),
    (new_org_id, 'Negociação', 4, '#EC4899'),
    (new_org_id, 'Fechamento', 5, '#10B981');
  
  -- Criar categorias financeiras padrão
  INSERT INTO public.categorias_financeiras (organization_id, nome, tipo, cor) VALUES
    (new_org_id, 'Vendas', 'receita', '#10B981'),
    (new_org_id, 'Serviços', 'receita', '#3BA3FF'),
    (new_org_id, 'Fornecedores', 'despesa', '#EF4444'),
    (new_org_id, 'Operacional', 'despesa', '#F59E0B'),
    (new_org_id, 'Impostos', 'despesa', '#8B5CF6');
  
  RETURN NEW;
END;
$$;

-- Trigger para novo usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function para verificar role (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function para obter organization_id do usuário
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etapas_funil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_venda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consignacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_consignacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devolucoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.figuras_tributarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;

-- POLICIES: Organizations
CREATE POLICY "Users can view own organization" ON public.organizations
  FOR SELECT USING (id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update own organization" ON public.organizations
  FOR UPDATE USING (id = public.get_user_organization_id(auth.uid()));

-- POLICIES: Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view profiles in same org" ON public.profiles
  FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));

-- POLICIES: User Roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- POLICIES: Tabelas com organization_id (padrão multi-tenant)
CREATE POLICY "org_select" ON public.etapas_funil FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.etapas_funil FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.etapas_funil FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.etapas_funil FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.clientes FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.clientes FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.clientes FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.clientes FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.oportunidades FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.oportunidades FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.oportunidades FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.oportunidades FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.tarefas FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.tarefas FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.tarefas FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.tarefas FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.produtos FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.produtos FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.produtos FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.produtos FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.caixas FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.caixas FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.caixas FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.caixas FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.vendas FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.vendas FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.vendas FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.vendas FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "venda_select" ON public.itens_venda FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vendas WHERE id = itens_venda.venda_id AND organization_id = public.get_user_organization_id(auth.uid()))
);
CREATE POLICY "venda_insert" ON public.itens_venda FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.vendas WHERE id = itens_venda.venda_id AND organization_id = public.get_user_organization_id(auth.uid()))
);
CREATE POLICY "venda_delete" ON public.itens_venda FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.vendas WHERE id = itens_venda.venda_id AND organization_id = public.get_user_organization_id(auth.uid()))
);

CREATE POLICY "org_select" ON public.pre_vendas FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.pre_vendas FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.pre_vendas FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.pre_vendas FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.consignacoes FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.consignacoes FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.consignacoes FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.consignacoes FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "consig_select" ON public.itens_consignacao FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.consignacoes WHERE id = itens_consignacao.consignacao_id AND organization_id = public.get_user_organization_id(auth.uid()))
);
CREATE POLICY "consig_insert" ON public.itens_consignacao FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.consignacoes WHERE id = itens_consignacao.consignacao_id AND organization_id = public.get_user_organization_id(auth.uid()))
);
CREATE POLICY "consig_delete" ON public.itens_consignacao FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.consignacoes WHERE id = itens_consignacao.consignacao_id AND organization_id = public.get_user_organization_id(auth.uid()))
);

CREATE POLICY "consig_select" ON public.devolucoes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.consignacoes WHERE id = devolucoes.consignacao_id AND organization_id = public.get_user_organization_id(auth.uid()))
);
CREATE POLICY "consig_insert" ON public.devolucoes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.consignacoes WHERE id = devolucoes.consignacao_id AND organization_id = public.get_user_organization_id(auth.uid()))
);

CREATE POLICY "org_select" ON public.categorias_financeiras FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.categorias_financeiras FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.categorias_financeiras FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.categorias_financeiras FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.contas FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.contas FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.contas FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.contas FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.lancamentos FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.lancamentos FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.lancamentos FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.lancamentos FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.figuras_tributarias FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.figuras_tributarias FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.figuras_tributarias FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.figuras_tributarias FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "org_select" ON public.notas_fiscais FOR SELECT USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_insert" ON public.notas_fiscais FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_update" ON public.notas_fiscais FOR UPDATE USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "org_delete" ON public.notas_fiscais FOR DELETE USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Índices para performance
CREATE INDEX idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX idx_profiles_user ON public.profiles(user_id);
CREATE INDEX idx_clientes_organization ON public.clientes(organization_id);
CREATE INDEX idx_produtos_organization ON public.produtos(organization_id);
CREATE INDEX idx_vendas_organization ON public.vendas(organization_id);
CREATE INDEX idx_vendas_data ON public.vendas(data_venda);
CREATE INDEX idx_oportunidades_organization ON public.oportunidades(organization_id);
CREATE INDEX idx_lancamentos_organization ON public.lancamentos(organization_id);
CREATE INDEX idx_lancamentos_data ON public.lancamentos(data_lancamento);