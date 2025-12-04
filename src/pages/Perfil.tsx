import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useRelatorios";

const Perfil = () => {
  const { profile } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Olá, {profile?.name || 'Usuário'}!
        </h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao Simplix - Gestão Completa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Vendas do Mês</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : formatCurrency(stats?.vendasMes || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xs ${(stats?.variacaoVendas || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(stats?.variacaoVendas || 0) >= 0 ? '+' : ''}{(stats?.variacaoVendas || 0).toFixed(1)}% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Quantidade de Vendas</CardDescription>
            <CardTitle className="text-2xl">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.quantidadeVendasMes || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Clientes Cadastrados</CardDescription>
            <CardTitle className="text-2xl">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalClientes || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Oportunidades Abertas</CardDescription>
            <CardTitle className="text-2xl text-warning">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.oportunidadesAbertas || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Visão geral do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-success" />
              <div className="flex-1">
                <p className="text-sm font-medium">Produtos Ativos</p>
                <p className="text-xs text-muted-foreground">{stats?.totalProdutos || 0} produtos cadastrados</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Clientes</p>
                <p className="text-xs text-muted-foreground">{stats?.totalClientes || 0} clientes na base</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Oportunidades</p>
                <p className="text-xs text-muted-foreground">{stats?.oportunidadesAbertas || 0} em negociação</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
