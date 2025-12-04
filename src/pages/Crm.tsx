import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Target, TrendingUp } from "lucide-react";

const Crm = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CRM</h1>
        <p className="text-muted-foreground mt-1">Gestão de relacionamento com clientes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Total de Clientes</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              1.234
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+45 este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Novos Leads</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-accent" />
              89
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Oportunidades</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-5 w-5 text-warning" />
              23
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Em negociação</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Conversão</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              32%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">+5% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Últimos Clientes</CardTitle>
          <CardDescription>Clientes cadastrados recentemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { nome: "João Silva", email: "joao@email.com", data: "Hoje" },
              { nome: "Maria Santos", email: "maria@email.com", data: "Ontem" },
              { nome: "Pedro Costa", email: "pedro@email.com", data: "Há 2 dias" },
            ].map((cliente, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{cliente.nome}</p>
                  <p className="text-xs text-muted-foreground">{cliente.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">{cliente.data}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Crm;
