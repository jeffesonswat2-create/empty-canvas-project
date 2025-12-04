import { create } from 'zustand';

export type NotificationType = 'crm' | 'fiscal' | 'financeiro' | 'vendas' | 'automacoes' | 'consignacao' | 'sistema';

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  descricao: string;
  data: Date;
  lida: boolean;
  link?: string;
}

interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'data' | 'lida'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getRecentNotifications: (count: number) => Notification[];
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [
    {
      id: '1',
      tipo: 'vendas',
      titulo: 'Nova venda realizada',
      descricao: 'Venda #1234 no valor de R$ 1.500,00',
      data: new Date(),
      lida: false,
      link: '/app/historico'
    },
    {
      id: '2',
      tipo: 'fiscal',
      titulo: 'NF-e autorizada',
      descricao: 'Nota fiscal #5678 autorizada com sucesso',
      data: new Date(Date.now() - 3600000),
      lida: false,
      link: '/app/fiscal'
    },
    {
      id: '3',
      tipo: 'financeiro',
      titulo: 'Pagamento recebido',
      descricao: 'Recebimento de R$ 2.300,00 confirmado',
      data: new Date(Date.now() - 7200000),
      lida: true,
      link: '/app/financeiro'
    }
  ],
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        data: new Date(),
        lida: false
      },
      ...state.notifications
    ]
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, lida: true } : n
    )
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, lida: true }))
  })),
  
  getUnreadCount: () => get().notifications.filter((n) => !n.lida).length,
  
  getRecentNotifications: (count) => get().notifications.slice(0, count)
}));
