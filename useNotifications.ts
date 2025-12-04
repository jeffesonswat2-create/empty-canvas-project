import { useNotificationsStore } from "@/stores/useNotificationsStore";
import type { NotificationType } from "@/stores/useNotificationsStore";

interface NotificationOptions {
  titulo: string;
  mensagem: string;
  tipo: NotificationType;
  link?: string;
}

export const useNotifications = () => {
  const { addNotification } = useNotificationsStore();

  const notifyCRM = (titulo: string, mensagem: string, link?: string) => {
    addNotification({ tipo: 'crm', titulo, mensagem, link });
  };

  const notifyFiscal = (titulo: string, mensagem: string, link?: string) => {
    addNotification({ tipo: 'fiscal', titulo, mensagem, link });
  };

  const notifyFinanceiro = (titulo: string, mensagem: string, link?: string) => {
    addNotification({ tipo: 'financeiro', titulo, mensagem, link });
  };

  const notifyVendas = (titulo: string, mensagem: string, link?: string) => {
    addNotification({ tipo: 'vendas', titulo, mensagem, link });
  };

  const notifyAutomacoes = (titulo: string, mensagem: string, link?: string) => {
    addNotification({ tipo: 'automacoes', titulo, mensagem, link });
  };

  const notifyConsignacao = (titulo: string, mensagem: string, link?: string) => {
    addNotification({ tipo: 'consignacao', titulo, mensagem, link });
  };

  const notifySistema = (titulo: string, mensagem: string, link?: string) => {
    addNotification({ tipo: 'sistema', titulo, mensagem, link });
  };

  const notify = ({ tipo, titulo, mensagem, link }: NotificationOptions) => {
    addNotification({ tipo, titulo, mensagem, link });
  };

  return {
    notify,
    notifyCRM,
    notifyFiscal,
    notifyFinanceiro,
    notifyVendas,
    notifyAutomacoes,
    notifyConsignacao,
    notifySistema,
  };
};
