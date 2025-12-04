import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationsStore, type NotificationType } from "@/stores/useNotificationsStore";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, ShoppingCart, FileText, DollarSign, Briefcase, 
  Zap, Package, Settings, CheckCheck, Trash2 
} from "lucide-react";

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

const getNotificationLabel = (tipo: NotificationType) => {
  const labels = {
    crm: "CRM",
    fiscal: "Fiscal",
    financeiro: "Financeiro",
    vendas: "Vendas",
    automacoes: "Automações",
    consignacao: "Consignação",
    sistema: "Sistema",
  };
  return labels[tipo];
};

const CentralNotificacoes = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearAll, getUnreadCount } = useNotificationsStore();
  
  const [filterType, setFilterType] = useState<NotificationType | 'todas'>('todas');
  const [filterStatus, setFilterStatus] = useState<'todas' | 'lidas' | 'nao-lidas'>('todas');
  const [filterPeriod, setFilterPeriod] = useState<'7dias' | '30dias' | 'todas'>('todas');

  const unreadCount = getUnreadCount();

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    // Filtro por tipo
    if (filterType !== 'todas' && notification.tipo !== filterType) {
      return false;
    }

    // Filtro por status
    if (filterStatus === 'lidas' && !notification.lida) {
      return false;
    }
    if (filterStatus === 'nao-lidas' && notification.lida) {
      return false;
    }

    // Filtro por período
    if (filterPeriod !== 'todas') {
      const now = new Date();
      const notificationDate = new Date(notification.data);
      const diffDays = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filterPeriod === '7dias' && diffDays > 7) {
        return false;
      }
      if (filterPeriod === '30dias' && diffDays > 30) {
        return false;
      }
    }

    return true;
  });

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  return (
    <main className="flex-1 p-6 space-y-6 overflow-auto bg-[#0F1115]">
      {/* Header */}
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-[#E7EEF6] mb-2">
          Central de Notificações
        </h2>
        <p className="text-[#E7EEF6]/70">
          Gerencie todas as suas notificações e mantenha-se atualizado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Card className="bg-[#151924] border-[#20283A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E7EEF6]/70 mb-1">Total</p>
                <p className="text-2xl font-bold text-[#E7EEF6]">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-[#3BA3FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#151924] border-[#20283A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E7EEF6]/70 mb-1">Não lidas</p>
                <p className="text-2xl font-bold text-[#FF8A00]">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-[#FF8A00]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#151924] border-[#20283A]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E7EEF6]/70 mb-1">Lidas</p>
                <p className="text-2xl font-bold text-[#22C55E]">{notifications.length - unreadCount}</p>
              </div>
              <CheckCheck className="h-8 w-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="text-[#E7EEF6] text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <p className="text-sm text-[#E7EEF6]/70 font-medium">Tipo</p>
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <TabsList className="bg-[#0F1115] border-[#20283A] flex-wrap h-auto">
                <TabsTrigger value="todas" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="crm" className="data-[state=active]:bg-[#8A63FF] data-[state=active]:text-white">
                  CRM
                </TabsTrigger>
                <TabsTrigger value="fiscal" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
                  Fiscal
                </TabsTrigger>
                <TabsTrigger value="financeiro" className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white">
                  Financeiro
                </TabsTrigger>
                <TabsTrigger value="vendas" className="data-[state=active]:bg-[#FF8A00] data-[state=active]:text-white">
                  Vendas
                </TabsTrigger>
                <TabsTrigger value="automacoes" className="data-[state=active]:bg-[#F97316] data-[state=active]:text-white">
                  Automações
                </TabsTrigger>
                <TabsTrigger value="consignacao" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
                  Consignação
                </TabsTrigger>
                <TabsTrigger value="sistema" className="data-[state=active]:bg-[#6B7280] data-[state=active]:text-white">
                  Sistema
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <p className="text-sm text-[#E7EEF6]/70 font-medium">Status</p>
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <TabsList className="bg-[#0F1115] border-[#20283A]">
                <TabsTrigger value="todas" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="nao-lidas" className="data-[state=active]:bg-[#FF8A00] data-[state=active]:text-white">
                  Não lidas
                </TabsTrigger>
                <TabsTrigger value="lidas" className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white">
                  Lidas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Período */}
          <div className="space-y-2">
            <p className="text-sm text-[#E7EEF6]/70 font-medium">Período</p>
            <Tabs value={filterPeriod} onValueChange={(v) => setFilterPeriod(v as any)}>
              <TabsList className="bg-[#0F1115] border-[#20283A]">
                <TabsTrigger value="7dias" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
                  Últimos 7 dias
                </TabsTrigger>
                <TabsTrigger value="30dias" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
                  Últimos 30 dias
                </TabsTrigger>
                <TabsTrigger value="todas" className="data-[state=active]:bg-[#3BA3FF] data-[state=active]:text-white">
                  Todas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex-1 bg-[#3BA3FF] hover:bg-[#3BA3FF]/90 text-white"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
            <Button
              onClick={clearAll}
              disabled={notifications.length === 0}
              variant="outline"
              className="flex-1 border-[#20283A] text-[#EF4444] hover:bg-[#EF4444]/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar todas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de notificações */}
      <Card className="bg-[#151924] border-[#20283A] animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <CardHeader>
          <CardTitle className="text-[#E7EEF6]">
            Notificações ({filteredNotifications.length})
          </CardTitle>
          <CardDescription className="text-[#E7EEF6]/70">
            {filterStatus === 'nao-lidas' && 'Exibindo apenas notificações não lidas'}
            {filterStatus === 'lidas' && 'Exibindo apenas notificações lidas'}
            {filterStatus === 'todas' && 'Exibindo todas as notificações'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-[#E7EEF6]/50">
              <Bell className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhuma notificação encontrada</p>
              <p className="text-sm mt-2">Ajuste os filtros ou aguarde novas notificações</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.tipo);
                const color = getNotificationColor(notification.tipo);
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-[#3BA3FF] ${
                      !notification.lida 
                        ? 'bg-[#0F1115] border-[#FF8A00]/30' 
                        : 'bg-[#0F1115]/30 border-[#20283A]'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div 
                        className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-base font-semibold text-[#E7EEF6]">
                              {notification.titulo}
                            </p>
                            <Badge 
                              className="text-xs"
                              style={{ backgroundColor: `${color}20`, color }}
                            >
                              {getNotificationLabel(notification.tipo)}
                            </Badge>
                          </div>
                          {!notification.lida && (
                            <div 
                              className="h-3 w-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#FF8A00' }}
                            />
                          )}
                        </div>
                        <p className="text-sm text-[#E7EEF6]/70 mb-2">
                          {notification.mensagem}
                        </p>
                        <p className="text-xs text-[#E7EEF6]/50">
                          {formatDate(notification.data)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default CentralNotificacoes;
