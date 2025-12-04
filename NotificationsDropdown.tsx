import { useNavigate } from "react-router-dom";
import { useNotificationsStore } from "@/stores/useNotificationsStore";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, FileText, DollarSign, Briefcase, Zap, Package, Settings } from "lucide-react";
import type { NotificationType } from "@/stores/useNotificationsStore";

const getNotificationIcon = (tipo: NotificationType) => {
  const icons = {
    crm: Briefcase,
    fiscal: FileText,
    financeiro: DollarSign,
    vendas: ShoppingCart,
    automacoes: Zap,
    consignacao: Package,
    sistema: Settings,
  };
  return icons[tipo];
};

const getNotificationColor = (tipo: NotificationType) => {
  const colors = {
    crm: "#8A63FF",
    fiscal: "#3BA3FF",
    financeiro: "#22C55E",
    vendas: "#FF8A00",
    automacoes: "#F97316",
    consignacao: "#8B5CF6",
    sistema: "#6B7280",
  };
  return colors[tipo];
};

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const { notifications, getUnreadCount, markAsRead, getRecentNotifications } = useNotificationsStore();
  
  const unreadCount = getUnreadCount();
  const recentNotifications = getRecentNotifications(10);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-[#20283A] transition-colors"
        >
          <Bell className="h-5 w-5 text-[#E7EEF6]" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              style={{ backgroundColor: '#FF8A00' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 bg-[#151924] border-[#20283A] max-h-[600px] overflow-y-auto z-50"
      >
        <DropdownMenuLabel className="text-[#E7EEF6] font-semibold text-base">
          Notificações
          {unreadCount > 0 && (
            <span className="ml-2 text-sm font-normal text-[#E7EEF6]/70">
              ({unreadCount} não lida{unreadCount !== 1 ? 's' : ''})
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#20283A]" />
        
        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center text-[#E7EEF6]/50">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <>
            {recentNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.tipo);
              const color = getNotificationColor(notification.tipo);
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                  className={`p-4 cursor-pointer hover:bg-[#0F1115] transition-colors ${
                    !notification.lida ? 'bg-[#0F1115]/50' : ''
                  }`}
                >
                  <div className="flex gap-3 w-full">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-[#E7EEF6] truncate">
                          {notification.titulo}
                        </p>
                        {!notification.lida && (
                          <div 
                            className="h-2 w-2 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: '#FF8A00' }}
                          />
                        )}
                      </div>
                      <p className="text-xs text-[#E7EEF6]/70 line-clamp-2 mb-1">
                        {notification.mensagem}
                      </p>
                      <p className="text-xs text-[#E7EEF6]/50">
                        {formatDate(notification.data)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator className="bg-[#20283A]" />
            <DropdownMenuItem
              onClick={() => navigate('/app/notificacoes')}
              className="p-3 cursor-pointer hover:bg-[#0F1115] text-center justify-center text-[#3BA3FF] font-semibold"
            >
              Ver todas as notificações
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
