import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'crm' | 'fiscal' | 'financeiro' | 'vendas' | 'automacoes' | 'consignacao' | 'sistema';

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  link?: string;
}

interface NotificationsStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'data' | 'lida'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getRecentNotifications: (limit?: number) => Notification[];
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          data: new Date(),
          lida: false,
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, lida: true } : n
          ),
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, lida: true })),
        }));
      },
      
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.lida).length;
      },
      
      getRecentNotifications: (limit = 10) => {
        return get().notifications.slice(0, limit);
      },
      
      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'simplix-notifications',
    }
  )
);
