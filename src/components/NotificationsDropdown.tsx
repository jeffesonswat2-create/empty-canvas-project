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
  const { getUnreadCount, markAsRead, getRecentNotifications } = useNotificationsStore();

  const unreadCount = getUnreadCount();
  const recentNotifications = getRecentNotifications(10);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Nenhuma notificação
          </div>
        ) : (
          recentNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.tipo);
            const color = getNotificationColor(notification.tipo);
            return (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.lida ? "bg-muted/50" : ""}`}
                onClick={() => handleNotificationClick(notification.id, notification.link)}
              >
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{notification.titulo}</p>
                  <p className="text-xs text-muted-foreground truncate">{notification.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(notification.data, { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
                {!notification.lida && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                )}
              </DropdownMenuItem>
            );
          })
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-center text-primary cursor-pointer justify-center"
          onClick={() => navigate("/app/notificacoes")}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
