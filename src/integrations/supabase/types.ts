export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      caixas: {
        Row: {
          created_at: string
          data_abertura: string
          data_fechamento: string | null
          descricao: string | null
          id: string
          operador_id: string | null
          organization_id: string
          status: string
          valor_abertura: number | null
          valor_fechamento: number | null
        }
        Insert: {
          created_at?: string
          data_abertura?: string
          data_fechamento?: string | null
          descricao?: string | null
          id?: string
          operador_id?: string | null
          organization_id: string
          status?: string
          valor_abertura?: number | null
          valor_fechamento?: number | null
        }
        Update: {
          created_at?: string
          data_abertura?: string
          data_fechamento?: string | null
          descricao?: string | null
          id?: string
          operador_id?: string | null
          organization_id?: string
          status?: string
          valor_abertura?: number | null
          valor_fechamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "caixas_operador_id_fkey"
            columns: ["operador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caixas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_financeiras: {
        Row: {
          cor: string | null
          created_at: string
          id: string
          nome: string
          organization_id: string
          tipo: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          id?: string
          nome: string
          organization_id: string
          tipo?: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          id?: string
          nome?: string
          organization_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_financeiras_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          created_at: string
          documento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          organization_id: string
          tags: string[] | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          organization_id: string
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          organization_id?: string
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      consignacoes: {
        Row: {
          cliente_id: string
          created_at: string
          data_envio: string
          data_retorno_previsto: string | null
          id: string
          observacoes: string | null
          organization_id: string
          status: string
          updated_at: string
          valor_total: number | null
          vendedor_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_envio?: string
          data_retorno_previsto?: string | null
          id?: string
          observacoes?: string | null
          organization_id: string
          status?: string
          updated_at?: string
          valor_total?: number | null
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_envio?: string
          data_retorno_previsto?: string | null
          id?: string
          observacoes?: string | null
          organization_id?: string
          status?: string
          updated_at?: string
          valor_total?: number | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consignacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consignacoes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consignacoes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contas: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          organization_id: string
          saldo: number | null
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          organization_id: string
          saldo?: number | null
          tipo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          organization_id?: string
          saldo?: number | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      devolucoes: {
        Row: {
          consignacao_id: string
          created_at: string
          data_devolucao: string
          id: string
          observacoes: string | null
        }
        Insert: {
          consignacao_id: string
          created_at?: string
          data_devolucao?: string
          id?: string
          observacoes?: string | null
        }
        Update: {
          consignacao_id?: string
          created_at?: string
          data_devolucao?: string
          id?: string
          observacoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devolucoes_consignacao_id_fkey"
            columns: ["consignacao_id"]
            isOneToOne: false
            referencedRelation: "consignacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      etapas_funil: {
        Row: {
          cor: string | null
          created_at: string
          id: string
          nome: string
          ordem: number
          organization_id: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          id?: string
          nome: string
          ordem?: number
          organization_id: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          id?: string
          nome?: string
          ordem?: number
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etapas_funil_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      figuras_tributarias: {
        Row: {
          aliquota: number | null
          codigo: string | null
          created_at: string
          id: string
          nome: string
          organization_id: string
          tipo: string | null
        }
        Insert: {
          aliquota?: number | null
          codigo?: string | null
          created_at?: string
          id?: string
          nome: string
          organization_id: string
          tipo?: string | null
        }
        Update: {
          aliquota?: number | null
          codigo?: string | null
          created_at?: string
          id?: string
          nome?: string
          organization_id?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "figuras_tributarias_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_consignacao: {
        Row: {
          consignacao_id: string
          created_at: string
          id: string
          preco_unitario: number
          produto_id: string
          quantidade_devolvida: number | null
          quantidade_enviada: number
          quantidade_vendida: number | null
        }
        Insert: {
          consignacao_id: string
          created_at?: string
          id?: string
          preco_unitario: number
          produto_id: string
          quantidade_devolvida?: number | null
          quantidade_enviada?: number
          quantidade_vendida?: number | null
        }
        Update: {
          consignacao_id?: string
          created_at?: string
          id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade_devolvida?: number | null
          quantidade_enviada?: number
          quantidade_vendida?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_consignacao_consignacao_id_fkey"
            columns: ["consignacao_id"]
            isOneToOne: false
            referencedRelation: "consignacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_consignacao_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_venda: {
        Row: {
          acrescimo: number | null
          created_at: string
          desconto: number | null
          id: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Insert: {
          acrescimo?: number | null
          created_at?: string
          desconto?: number | null
          id?: string
          preco_unitario: number
          produto_id: string
          quantidade?: number
          subtotal: number
          venda_id: string
        }
        Update: {
          acrescimo?: number | null
          created_at?: string
          desconto?: number | null
          id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade?: number
          subtotal?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_venda_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_venda_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos: {
        Row: {
          categoria_id: string | null
          conta_id: string | null
          created_at: string
          data_lancamento: string
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string
          id: string
          organization_id: string
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_lancamento?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao: string
          id?: string
          organization_id: string
          status?: string
          tipo?: string
          updated_at?: string
          valor: number
        }
        Update: {
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_lancamento?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string
          id?: string
          organization_id?: string
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_fiscais: {
        Row: {
          chave_acesso: string | null
          created_at: string
          id: string
          numero: string | null
          organization_id: string
          serie: string | null
          status: string
          valor_total: number | null
          venda_id: string | null
          xml: string | null
        }
        Insert: {
          chave_acesso?: string | null
          created_at?: string
          id?: string
          numero?: string | null
          organization_id: string
          serie?: string | null
          status?: string
          valor_total?: number | null
          venda_id?: string | null
          xml?: string | null
        }
        Update: {
          chave_acesso?: string | null
          created_at?: string
          id?: string
          numero?: string | null
          organization_id?: string
          serie?: string | null
          status?: string
          valor_total?: number | null
          venda_id?: string | null
          xml?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          cliente_id: string | null
          created_at: string
          etapa_id: string | null
          id: string
          observacoes: string | null
          organization_id: string
          previsao_fechamento: string | null
          responsavel_id: string | null
          status: string
          titulo: string
          updated_at: string
          valor_previsto: number | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          etapa_id?: string | null
          id?: string
          observacoes?: string | null
          organization_id: string
          previsao_fechamento?: string | null
          responsavel_id?: string | null
          status?: string
          titulo: string
          updated_at?: string
          valor_previsto?: number | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          etapa_id?: string | null
          id?: string
          observacoes?: string | null
          organization_id?: string
          previsao_fechamento?: string | null
          responsavel_id?: string | null
          status?: string
          titulo?: string
          updated_at?: string
          valor_previsto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "etapas_funil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          document: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pre_vendas: {
        Row: {
          cliente_id: string | null
          created_at: string
          id: string
          items: Json | null
          observacoes: string | null
          organization_id: string
          status: string
          total_previsto: number | null
          updated_at: string
          vendedor_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          items?: Json | null
          observacoes?: string | null
          organization_id: string
          status?: string
          total_previsto?: number | null
          updated_at?: string
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          items?: Json | null
          observacoes?: string | null
          organization_id?: string
          status?: string
          total_previsto?: number | null
          updated_at?: string
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pre_vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_vendas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria: string | null
          codigo_barras: string | null
          created_at: string
          descricao: string | null
          estoque_atual: number
          estoque_minimo: number | null
          id: string
          nome: string
          organization_id: string
          preco_custo: number | null
          preco_venda: number
          sku: string | null
          unidade: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          codigo_barras?: string | null
          created_at?: string
          descricao?: string | null
          estoque_atual?: number
          estoque_minimo?: number | null
          id?: string
          nome: string
          organization_id: string
          preco_custo?: number | null
          preco_venda?: number
          sku?: string | null
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          codigo_barras?: string | null
          created_at?: string
          descricao?: string | null
          estoque_atual?: number
          estoque_minimo?: number | null
          id?: string
          nome?: string
          organization_id?: string
          preco_custo?: number | null
          preco_venda?: number
          sku?: string | null
          unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          created_at: string
          data_vencimento: string | null
          descricao: string
          id: string
          oportunidade_id: string | null
          organization_id: string
          prioridade: string | null
          responsavel_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_vencimento?: string | null
          descricao: string
          id?: string
          oportunidade_id?: string | null
          organization_id: string
          prioridade?: string | null
          responsavel_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_vencimento?: string | null
          descricao?: string
          id?: string
          oportunidade_id?: string | null
          organization_id?: string
          prioridade?: string | null
          responsavel_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendas: {
        Row: {
          acrescimo: number | null
          caixa_id: string | null
          cliente_id: string | null
          created_at: string
          data_venda: string
          desconto: number | null
          forma_pagamento: string | null
          id: string
          observacoes: string | null
          organization_id: string
          parcelas: number | null
          status: string
          subtotal: number
          total: number
          vendedor_id: string | null
        }
        Insert: {
          acrescimo?: number | null
          caixa_id?: string | null
          cliente_id?: string | null
          created_at?: string
          data_venda?: string
          desconto?: number | null
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          organization_id: string
          parcelas?: number | null
          status?: string
          subtotal?: number
          total?: number
          vendedor_id?: string | null
        }
        Update: {
          acrescimo?: number | null
          caixa_id?: string | null
          cliente_id?: string | null
          created_at?: string
          data_venda?: string
          desconto?: number | null
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          organization_id?: string
          parcelas?: number | null
          status?: string
          subtotal?: number
          total?: number
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_caixa_id_fkey"
            columns: ["caixa_id"]
            isOneToOne: false
            referencedRelation: "caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "vendedor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "vendedor"],
    },
  },
} as const
