import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Users,
  DollarSign,
  FileText,
  PieChart,
  Zap,
  HelpCircle,
  Settings,
  LogOut,
  TrendingUp,
  ShoppingCart,
  FileEdit,
  RotateCcw,
  History,
  Download,
  Tag,
  Upload,
  ChevronDown,
  FileSignature,
  Package,
  Eye,
  Send,
  RotateCcw as Return,
  CheckCircle,
  ClipboardList,
  FileBarChart,
  Sliders,
  Percent,
  FileCode,
  Truck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const menuItems = [
  { title: "Início", url: "/app/perfil", icon: Home },
  { title: "CRM", url: "/app/crm", icon: Users },
  { title: "Meu Contrato", url: "/app/meu-contrato", icon: FileSignature },
  { title: "Financeiro", url: "/app/financeiro", icon: DollarSign },
  { title: "Fiscal", url: "/app/fiscal", icon: FileText },
];

const gerenciamentoSubItems = [
  { title: "Parametrização", url: "/app/gerenciamento/parametrizacao", icon: Sliders },
  { title: "Figuras Tributárias", url: "/app/gerenciamento/figuras-tributarias", icon: Percent },
  { title: "Autorização ao XML", url: "/app/gerenciamento/autorizacao-xml", icon: FileCode },
  { title: "Transportadora", url: "/app/gerenciamento/transportadora", icon: Truck },
];

const consignacaoSubItems = [
  { title: "Visão Geral", url: "/app/consignacao/visao-geral", icon: Eye },
  { title: "Estoque Consignado", url: "/app/consignacao/estoque", icon: Package },
  { title: "Envios", url: "/app/consignacao/envios", icon: Send },
  { title: "Devoluções", url: "/app/consignacao/devolucoes", icon: Return },
  { title: "Acertos", url: "/app/consignacao/acertos", icon: CheckCircle },
  { title: "Histórico", url: "/app/consignacao/historico", icon: ClipboardList },
  { title: "Relatórios", url: "/app/consignacao/relatorios", icon: FileBarChart },
];

const relatoriosSubItems = [
  { title: "Relatório de Vendas", subtitle: "Análises e Faturamento", url: "/app/relatorios/vendas", icon: TrendingUp },
  { title: "Relatório de Estoque", subtitle: "Movimentação e Saldo", url: "/app/relatorios/estoque", icon: Package },
  { title: "Relatório Fiscal", subtitle: "Notas Emitidas e Status", url: "/app/relatorios/fiscal", icon: FileText },
  { title: "Relatório de Clientes", subtitle: "Atividades e Compras", url: "/app/relatorios/clientes", icon: Users },
  { title: "Relatório de Usuários", subtitle: "Acessos e Permissões", url: "/app/relatorios/usuarios", icon: Users },
];

const vendasSubItems = [
  { title: "PDV", url: "/app/pdv", icon: ShoppingCart },
  { title: "Carta de Correção", url: "/app/carta-correcao", icon: FileEdit },
  { title: "Devolução", url: "/app/devolucao", icon: RotateCcw },
  { title: "Histórico", url: "/app/historico", icon: History },
  { title: "Exportação", url: "/app/exportacao", icon: Download },
];

const otherItems = [
  { title: "Etiquetas", url: "/app/etiquetas", icon: Tag },
  { title: "Importador de Arquivos", url: "/app/importador", icon: Upload },
];

const bottomItems = [
  { title: "Ajuda", url: "/app/ajuda", icon: HelpCircle },
  { title: "Suporte", url: "/app/suporte", icon: HelpCircle },
  { title: "Configurações", url: "/app/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [vendasOpen, setVendasOpen] = useState(false);
  const [consignacaoOpen, setConsignacaoOpen] = useState(false);
  const [relatoriosOpen, setRelatoriosOpen] = useState(false);
  const [gerenciamentoOpen, setGerenciamentoOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout realizado com sucesso");
    navigate("/login");
  };

  return (
    <Sidebar className="border-r bg-[#050810] border-[#151924]">
      <SidebarContent 
        className="[&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#151924]">
          <h2 className="text-2xl font-bold text-[#3BA3FF]">Simplix</h2>
          <p className="text-xs mt-1 text-[#8EA0B5]">Gestão Completa</p>
        </div>

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#8EA0B5] font-semibold">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors border-l-4 ${
                          isActive
                            ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                            : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                          <span>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Gerenciamento / Parametrização Collapsible */}
              <Collapsible open={gerenciamentoOpen} onOpenChange={setGerenciamentoOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-[#111827] hover:text-white w-full text-[#E7EEF6] border-l-4 border-transparent"
                    >
                      <Sliders className="h-5 w-5 text-[#8EA0B5]" />
                      <span className="flex-1 text-left">Gerenciamento / Parametrização</span>
                      <ChevronDown 
                        className="h-4 w-4 transition-transform" 
                        style={{ 
                          transform: gerenciamentoOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="ml-6 mt-1">
                      {gerenciamentoSubItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={subItem.url}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm border-l-4 ${
                                  isActive
                                    ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                                    : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <subItem.icon className={`h-4 w-4 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                                  <span>{subItem.title}</span>
                                </>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Consignação Collapsible */}
              <Collapsible open={consignacaoOpen} onOpenChange={setConsignacaoOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-[#111827] hover:text-white w-full text-[#E7EEF6] border-l-4 border-transparent"
                    >
                      <Package className="h-5 w-5 text-[#8EA0B5]" />
                      <span className="flex-1 text-left">Consignação</span>
                      <ChevronDown 
                        className="h-4 w-4 transition-transform" 
                        style={{ 
                          transform: consignacaoOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="ml-6 mt-1">
                      {consignacaoSubItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={subItem.url}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm border-l-4 ${
                                  isActive
                                    ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                                    : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <subItem.icon className={`h-4 w-4 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                                  <span>{subItem.title}</span>
                                </>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Relatórios Collapsible */}
              <Collapsible open={relatoriosOpen} onOpenChange={setRelatoriosOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-[#111827] hover:text-white w-full text-[#E7EEF6] border-l-4 border-transparent"
                    >
                      <PieChart className="h-5 w-5 text-[#8EA0B5]" />
                      <span className="flex-1 text-left">Relatórios</span>
                      <ChevronDown 
                        className="h-4 w-4 transition-transform" 
                        style={{ 
                          transform: relatoriosOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="ml-6 mt-1">
                      {relatoriosSubItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={subItem.url}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm border-l-4 ${
                                  isActive
                                    ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                                    : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <subItem.icon className={`h-4 w-4 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                                  <span>{subItem.title}</span>
                                </>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Automações */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/app/automacao"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-md transition-colors border-l-4 ${
                        isActive
                          ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                          : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Zap className={`h-5 w-5 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                        <span>Automações</span>
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Vendas Collapsible */}
              <Collapsible open={vendasOpen} onOpenChange={setVendasOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-[#111827] hover:text-white w-full text-[#E7EEF6] border-l-4 border-transparent"
                    >
                      <ShoppingCart className="h-5 w-5 text-[#8EA0B5]" />
                      <span className="flex-1 text-left">Vendas</span>
                      <ChevronDown 
                        className="h-4 w-4 transition-transform" 
                        style={{ 
                          transform: vendasOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="ml-6 mt-1">
                      {vendasSubItems.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={subItem.url}
                              target={subItem.title === "PDV" ? "_blank" : undefined}
                              rel={subItem.title === "PDV" ? "noopener noreferrer" : undefined}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm border-l-4 ${
                                  isActive
                                    ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                                    : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <subItem.icon className={`h-4 w-4 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                                  <span>{subItem.title}</span>
                                </>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors border-l-4 ${
                          isActive
                            ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                            : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                          <span>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Menu */}
        <SidebarGroup className="mt-auto border-t border-[#151924]">
          <SidebarGroupLabel className="text-[#8EA0B5] font-semibold">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors border-l-4 ${
                          isActive
                            ? "bg-[#111827] border-[#3BA3FF] font-medium text-[#3BA3FF]"
                            : "text-[#E7EEF6] hover:bg-[#111827] hover:text-white border-transparent"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-[#3BA3FF]' : 'text-[#8EA0B5]'}`} />
                          <span>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => setLogoutDialogOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors w-full text-left text-[#F97373] hover:bg-[#111827] hover:text-[#F97373] border-l-4 border-transparent opacity-90 hover:opacity-100"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Status */}
        <div className="p-4 border-t border-[#151924]">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#3BA3FF] animate-pulse" />
            <span className="text-[#8EA0B5]">Sistema Online</span>
          </div>
        </div>
      </SidebarContent>

      {/* AlertDialog para confirmar logout */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent className="bg-card border-border rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Deseja realmente sair do sistema?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você será desconectado do sistema e precisará fazer login novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-secondary">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
