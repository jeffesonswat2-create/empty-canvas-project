import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Perfil = () => {
  const userName = localStorage.getItem("userName") || "Agnaldo Cardoso";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Olá, {userName}!</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao Simplix - Gestão Completa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Vendas Hoje</CardDescription>
            <CardTitle className="text-2xl text-primary">R$ 12.450,00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+12% vs ontem</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Notas Emitidas</CardDescription>
            <CardTitle className="text-2xl">47</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Clientes Ativos</CardDescription>
            <CardTitle className="text-2xl">234</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+5 novos</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Pendências</CardDescription>
            <CardTitle className="text-2xl text-warning">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">A resolver</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas movimentações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-success" />
              <div className="flex-1">
                <p className="text-sm font-medium">Venda #1234 finalizada</p>
                <p className="text-xs text-muted-foreground">Há 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">NF-e #5678 autorizada</p>
                <p className="text-xs text-muted-foreground">Há 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Novo cliente cadastrado</p>
                <p className="text-xs text-muted-foreground">Há 1 hora</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
