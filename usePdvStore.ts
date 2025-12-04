import { create } from 'zustand';

export interface CartItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  fator: number;
  quantidade: number;
  precoUnitario: number;
  descontoLinha: number;
  acrescimoLinha: number;
  totalLinha: number;
  observacao?: string;
}

interface PdvState {
  items: CartItem[];
  descontoTotal: number;
  acrescimoTotal: number;
  subtotal: number;
  total: number;
  modeloEmissor: 'NFCe' | 'NFe';
  cliente: any | null;
  cpfCnpjNota: string;
  vendedor: string;
  preVendaId: string | null;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'totalLinha'>) => void;
  editItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setDescontoTotal: (desconto: number) => void;
  setAcrescimoTotal: (acrescimo: number) => void;
  setModeloEmissor: (modelo: 'NFCe' | 'NFe') => void;
  setCliente: (cliente: any) => void;
  setCpfCnpjNota: (doc: string) => void;
  setVendedor: (vendedor: string) => void;
  setPreVendaId: (id: string | null) => void;
  loadPresale: (presale: any) => void;
  recalcTotals: () => void;
}

const calcItemTotal = (item: Omit<CartItem, 'id' | 'totalLinha'>): number => {
  const subtotal = item.quantidade * item.precoUnitario;
  const comDesconto = subtotal - item.descontoLinha;
  return comDesconto + item.acrescimoLinha;
};

export const usePdvStore = create<PdvState>((set, get) => ({
  items: [],
  descontoTotal: 0,
  acrescimoTotal: 0,
  subtotal: 0,
  total: 0,
  modeloEmissor: 'NFCe',
  cliente: null,
  cpfCnpjNota: '',
  vendedor: 'Admin',
  preVendaId: null,

  addItem: (item) => {
    const id = Math.random().toString(36).substr(2, 9);
    const totalLinha = calcItemTotal(item);
    const newItem = { ...item, id, totalLinha };
    
    set((state) => ({
      items: [...state.items, newItem],
    }));
    
    get().recalcTotals();
  },

  editItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          updated.totalLinha = calcItemTotal(updated);
          return updated;
        }
        return item;
      }),
    }));
    
    get().recalcTotals();
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
    
    get().recalcTotals();
  },

  clearCart: () => {
    set({
      items: [],
      descontoTotal: 0,
      acrescimoTotal: 0,
      subtotal: 0,
      total: 0,
      cliente: null,
      cpfCnpjNota: '',
      preVendaId: null,
    });
  },

  setDescontoTotal: (desconto) => {
    set({ descontoTotal: desconto });
    get().recalcTotals();
  },

  setAcrescimoTotal: (acrescimo) => {
    set({ acrescimoTotal: acrescimo });
    get().recalcTotals();
  },

  setModeloEmissor: (modelo) => set({ modeloEmissor: modelo }),
  setCliente: (cliente) => set({ cliente }),
  setCpfCnpjNota: (doc) => set({ cpfCnpjNota: doc }),
  setVendedor: (vendedor) => set({ vendedor }),
  setPreVendaId: (id) => set({ preVendaId: id }),

  loadPresale: (presale) => {
    set({
      items: presale.items,
      descontoTotal: presale.descontoTotal,
      acrescimoTotal: presale.acrescimoTotal,
      modeloEmissor: presale.modeloEmissor,
      cliente: presale.cliente,
      cpfCnpjNota: presale.cpfCnpjNota,
      vendedor: presale.vendedor,
      preVendaId: presale.id,
    });
    get().recalcTotals();
  },

  recalcTotals: () => {
    const state = get();
    const subtotal = state.items.reduce((sum, item) => sum + item.totalLinha, 0);
    const total = subtotal - state.descontoTotal + state.acrescimoTotal;
    
    set({ subtotal, total });
  },
}));
